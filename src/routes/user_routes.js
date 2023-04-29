import express from "express";
import UserController from "../controller/user_controller.js";
import chekUserAuth from "../middlewares/auth_middleware.js";

const router = express.Router();

// Route middleware

router.use("/changePassword", chekUserAuth);

// public Route

router.get("/login", UserController.userLogin);
router.post("/register", UserController.userRegistration);

// private Route
router.post("/changePassword", UserController.changePassword);

export default router;
