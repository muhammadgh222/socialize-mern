import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
import app from "./app.js";

const PORT = process.env.PORT || 3000;

const DB = process.env.MONGO_URI.replace("<password>", process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database connected successfuly");
  });

mongoose.set("strictQuery", false);

app.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`);
});
