import jwt from "jsonwebtoken";
import { promisify } from "util";
import User from "../models/userModel.js";

const jwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};
export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, passwordConfirm } = req.body;

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
    });

    const token = jwtToken(user._id);

    res.status(201).json({
      status: "success",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "failed",
      error,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Please provied email and password",
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }
    const token = jwtToken(user._id);

    res.status(201).json({
      status: "success",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "failed",
      error,
    });
  }
};

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(403).json({
      message: "You are not logged in to access this route",
    });
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({
      message: "You are not logged in to access this route",
    });
  }
  req.user = currentUser;
  next();
};
