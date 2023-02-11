import express from "express";
import cors from "cors";

import postRoutes from "./routes/postRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import ErrorHandler from "./utilities/ErrorHandler.js";
import AppError from "./utilities/AppError.js";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/", (req, res) => {
  res.send({
    message: "Hello",
  });
});

app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);

app.all("*", (req, res, next) => {
  return next(new AppError("There is no such page", 404));
});

app.use(ErrorHandler);
export default app;
