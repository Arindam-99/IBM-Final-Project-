import express from "express";
import { 
  addRestaurant, 
  listRestaurants, 
  removeRestaurant, 
  updateRestaurant, 
  getRestaurantById 
} from "../controllers/restaurantController.js";
import multer from "multer";

const restaurantRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

// Restaurant Routes
restaurantRouter.post("/add", upload.single("image"), addRestaurant);
restaurantRouter.get("/list", listRestaurants);
restaurantRouter.post("/remove", removeRestaurant);
restaurantRouter.put("/:id", upload.single("image"), updateRestaurant);
restaurantRouter.get("/:id", getRestaurantById);

export default restaurantRouter;
