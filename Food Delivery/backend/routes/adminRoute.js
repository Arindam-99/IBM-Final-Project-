import express from "express";
import { 
  getDashboardStats, 
  getAllFoods, 
  updateFood, 
  getFoodById, 
  getAllUsers 
} from "../controllers/adminController.js";
import { addFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";

const adminRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

// Admin Dashboard Routes
adminRouter.get("/dashboard/stats", getDashboardStats);
adminRouter.get("/foods", getAllFoods);
adminRouter.get("/foods/:id", getFoodById);
adminRouter.post("/foods/add", upload.single("image"), addFood);
adminRouter.put("/foods/:id", upload.single("image"), updateFood);
adminRouter.delete("/foods/remove", removeFood);
adminRouter.get("/users", getAllUsers);

export default adminRouter;
