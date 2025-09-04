import foodModel from "../models/foodModel.js";
import fs from "fs";

// Add food item
const addFood = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    // Check if required fields are provided
    if (
      !req.body.name ||
      !req.body.description ||
      !req.body.price ||
      !req.body.category
    ) {
      return res.json({
        success: false,
        message:
          "Please provide all required fields: name, description, price, category",
      });
    }

    // Handle image filename (optional for testing)
    let image_filename = req.file ? req.file.filename : "default-food.jpg";

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      image: image_filename,
    });

    console.log("Food object to save:", food);

    const savedFood = await food.save();
    console.log("Food saved successfully:", savedFood);

    res.json({
      success: true,
      message: "Food added successfully",
      data: savedFood,
    });
  } catch (error) {
    console.error("Error adding food item:", error);
    res.json({
      success: false,
      message: "Error adding food item",
      error: error.message,
    });
  }
};

// List all food items
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching food items" });
  }
};

// Remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (food && food.image) {
      fs.unlink(`uploads/${food.image}`, () => {});
    }

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing food item" });
  }
};

export { addFood, listFood, removeFood };
