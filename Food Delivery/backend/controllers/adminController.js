import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";

// Admin Dashboard Stats
const getDashboardStats = async (req, res) => {
  try {
    const totalFoods = await foodModel.countDocuments();
    const totalUsers = await userModel.countDocuments();
    
    // Get food items by category
    const foodsByCategory = await foodModel.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    // Get recent food items
    const recentFoods = await foodModel.find().sort({ _id: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        totalFoods,
        totalUsers,
        foodsByCategory,
        recentFoods
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.json({ success: false, message: "Error fetching dashboard stats" });
  }
};

// Get all food items with pagination
const getAllFoods = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const foods = await foodModel.find()
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const total = await foodModel.countDocuments();

    res.json({
      success: true,
      data: {
        foods,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: foods.length,
          totalItems: total
        }
      }
    });
  } catch (error) {
    console.error("Error fetching foods:", error);
    res.json({ success: false, message: "Error fetching food items" });
  }
};

// Update food item
const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
    };

    // Handle image update
    if (req.file) {
      // Remove old image
      const oldFood = await foodModel.findById(id);
      if (oldFood && oldFood.image && oldFood.image !== "default-food.jpg") {
        fs.unlink(`uploads/${oldFood.image}`, (err) => {
          if (err) console.log("Error deleting old image:", err);
        });
      }
      updateData.image = req.file.filename;
    }

    const updatedFood = await foodModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedFood) {
      return res.json({ success: false, message: "Food item not found" });
    }

    res.json({
      success: true,
      message: "Food item updated successfully",
      data: updatedFood
    });
  } catch (error) {
    console.error("Error updating food item:", error);
    res.json({ success: false, message: "Error updating food item" });
  }
};

// Get single food item
const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await foodModel.findById(id);

    if (!food) {
      return res.json({ success: false, message: "Food item not found" });
    }

    res.json({ success: true, data: food });
  } catch (error) {
    console.error("Error fetching food item:", error);
    res.json({ success: false, message: "Error fetching food item" });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password").sort({ _id: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.json({ success: false, message: "Error fetching users" });
  }
};

export { 
  getDashboardStats, 
  getAllFoods, 
  updateFood, 
  getFoodById, 
  getAllUsers 
};
