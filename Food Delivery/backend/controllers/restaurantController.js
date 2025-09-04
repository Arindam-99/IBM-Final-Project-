import restaurantModel from "../models/restaurantModel.js";
import fs from "fs";

// Add restaurant
const addRestaurant = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    // Check if required fields are provided
    if (!req.body.name || !req.body.rating || !req.body.deliveryTime || !req.body.cuisine || !req.body.address || !req.body.phone || !req.body.email) {
      return res.json({ 
        success: false, 
        message: "Please provide all required fields" 
      });
    }

    // Handle image filename
    let image_filename = req.file ? req.file.filename : "default-restaurant.jpg";

    const restaurant = new restaurantModel({
      name: req.body.name,
      image: image_filename,
      rating: Number(req.body.rating),
      deliveryTime: req.body.deliveryTime,
      cuisine: req.body.cuisine,
      badge: req.body.badge || "",
      discount: req.body.discount || "",
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });

    console.log("Restaurant object to save:", restaurant);
    
    const savedRestaurant = await restaurant.save();
    console.log("Restaurant saved successfully:", savedRestaurant);
    
    res.json({ 
      success: true, 
      message: "Restaurant added successfully",
      data: savedRestaurant
    });
  } catch (error) {
    console.error("Error adding restaurant:", error);
    res.json({ 
      success: false, 
      message: "Error adding restaurant",
      error: error.message 
    });
  }
};

// List all restaurants
const listRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantModel.find({}).sort({ _id: -1 });
    res.json({ success: true, data: restaurants });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching restaurants" });
  }
};

// Remove restaurant
const removeRestaurant = async (req, res) => {
  try {
    const restaurant = await restaurantModel.findById(req.body.id);
    if (restaurant && restaurant.image && restaurant.image !== "default-restaurant.jpg") {
      fs.unlink(`uploads/${restaurant.image}`, () => {});
    }
    
    await restaurantModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Restaurant removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing restaurant" });
  }
};

// Update restaurant
const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      name: req.body.name,
      rating: Number(req.body.rating),
      deliveryTime: req.body.deliveryTime,
      cuisine: req.body.cuisine,
      badge: req.body.badge || "",
      discount: req.body.discount || "",
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    // Handle image update
    if (req.file) {
      // Remove old image
      const oldRestaurant = await restaurantModel.findById(id);
      if (oldRestaurant && oldRestaurant.image && oldRestaurant.image !== "default-restaurant.jpg") {
        fs.unlink(`uploads/${oldRestaurant.image}`, (err) => {
          if (err) console.log("Error deleting old image:", err);
        });
      }
      updateData.image = req.file.filename;
    }

    const updatedRestaurant = await restaurantModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedRestaurant) {
      return res.json({ success: false, message: "Restaurant not found" });
    }

    res.json({
      success: true,
      message: "Restaurant updated successfully",
      data: updatedRestaurant
    });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.json({ success: false, message: "Error updating restaurant" });
  }
};

// Get single restaurant
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await restaurantModel.findById(id);

    if (!restaurant) {
      return res.json({ success: false, message: "Restaurant not found" });
    }

    res.json({ success: true, data: restaurant });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.json({ success: false, message: "Error fetching restaurant" });
  }
};

export { addRestaurant, listRestaurants, removeRestaurant, updateRestaurant, getRestaurantById };
