import { Schema, model } from "mongoose";

const UserRegisterSchema = Schema({
  name: { type: String, trim: true },
  email: { type: String, require: true, trim: true },
  password: { type: String, require: true, trim: true },
});

const UserModel = model("User", UserRegisterSchema);
export default UserModel;
