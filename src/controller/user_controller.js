import UserModel from "../models/user_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
  static userRegistration = async (req, res) => {
    const { name, email, password, password_confirmation } = req.body;

    const user = await UserModel.findOne({ email: email });
    if (user) {
      res.status(400).json({
        status: "failed",
        message: "Email already exists",
      });
    } else {
      if (name && email && password && password_confirmation) {
        if (password === password_confirmation) {
          try {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            const userSave = UserModel({
              name: name,
              email: email,
              password: hashPassword,
            });
            await userSave.save();
            const user = await UserModel.findOne({ email: email });
            // Generate jwt token
            const token = jwt.sign(
              {
                userId: user._id,
              },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "2m" }
            );
            res.status(200).send({
              status: "success",
              message: "Successfully register",
              data: userSave,
              token: token,
            });
          } catch (error) {
            res.status(400).json({
              status: "failed",
              message: "Cant register user ",
            });
          }
        } else {
          res.status(400).json({
            status: "failed",
            message: "Password and confirm password doesnot match",
          });
        }
      } else {
        res.status(400).json({
          status: "failed",
          message: "All fields are required",
        });
      }
    }
  };

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });

        if (user != null) {
          const isMatch = bcrypt.compareSync(password, user.password);

          if (user.email === email && isMatch) {
            const token = jwt.sign(
              {
                userId: user._id,
              },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "2h" }
            );
            res.status(200).json({
              status: "success",
              message: "Successfully login",
              data: user,
              token: token,
            });
          } else {
            res.status(400).json({
              status: "error",
              message: "Your email and password do not match",
            });
          }
        } else {
          res.status(400).json({
            status: "error",
            message: "Your are not register user",
          });
        }
      } else {
        res.status(400).json({
          status: "error",
          message: "Email and password required",
        });
      }
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Unable to login",
      });
    }
  };

  static changePassword = (req, res) => {
    const { password, password_confirmation } = req.body;
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        res.status(400).json({
          status: "error",
          message: "password and confirm password doesnot match",
        });
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        console.log(`myhash : ${hashPassword}`);
        console.log(req.user._id);
        UserModel.findByIdAndUpdate(req.user._id, {
          $set: {
            password: hashPassword,
          },
        });
        res.status(200).json({
          status: "success",
          message: "password change successfully",
        });
      }
    } else {
      res.status(400).json({
        status: "error",
        message: "All field are required",
      });
    }
  };
}

export default UserController;
