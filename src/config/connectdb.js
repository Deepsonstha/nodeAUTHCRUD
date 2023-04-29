import mongoose from "mongoose";

const connectDB = async (DATABASE_URL) => {
  try {
    const option = {
      dbName: "AuthCrud",
    };

   await mongoose.connect(DATABASE_URL, option);
    console.log("====   Database connected =====");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
