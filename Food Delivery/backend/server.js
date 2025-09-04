import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";
import restaurantRouter from "./routes/restaurantRoute.js";
import authRouter from "./routes/authRoute.js";

// App config
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Admin panel
      "http://localhost:5174", // Frontend
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

// Serve static files (uploaded images)
app.use("/images", express.static("uploads"));
app.use(
  "/profiles",
  express.static(path.join(process.cwd(), "uploads", "profiles"))
);

//Db Connection
connectDB();

//API Endpoints
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/auth", authRouter);
app.get("/", (req, res) => {
  res.send("API is running");
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(port, () => {
  console.log(` Server Started on http://localhost:${port}`);
  console.log(` Food images: http://localhost:${port}/images/`);
  console.log(` Profile images: http://localhost:${port}/profiles/`);
  console.log(` Authentication API: http://localhost:${port}/api/auth/`);
});

// mongodb+srv://arindamibm:ari022004@cluster0.aybntz6.mongodb.net/?
