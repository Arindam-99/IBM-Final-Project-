import express from "express";
import {
  addFood,
  listFood,
  removeFood,
} from "../controllers/foodController.js";

import multer from "multer";

const foodRouter = express.Router();
// Image Storage Engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

// Routes
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.post("/add-test", addFood); // Route for testing without file upload
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;
