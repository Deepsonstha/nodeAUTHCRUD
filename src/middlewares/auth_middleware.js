import Jwt from "jsonwebtoken";
import UserModel from "../models/user_model.js";

var chekUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];

      // verify token
      const { userId } = Jwt.verify(token, process.env.JWT_SECRET_KEY);
      // GET User form token

      req.user = await UserModel.findById(userId).select("-password");

     
      next();
    } catch (error) {
      res.status(401).json({
        status: "error",
        message: "Unauthorize user",
      });
    }
  }
  if (!token) {
    res.status(401).json({
      status: "error",
      message: "Unauthorize user with no token",
    });
  }
};

export default chekUserAuth;
