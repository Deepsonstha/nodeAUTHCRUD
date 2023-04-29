import dotenv from "dotenv";
// require("dotenv").config();
import express from "express";
import cors from "cors";
import connectDB from "./config/connectdb.js";
import router from "./routes/user_routes.js";
dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/api/user", router);

connectDB("mongodb://localhost:27017");

app.listen(port, () => {
  console.log(`Server listening at  http://localhost:${port}`);
});
