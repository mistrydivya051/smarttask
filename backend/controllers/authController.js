import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// register
export const register = async (req, res,next) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: "User registered successfully",
      id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

// login
export const login = async (req, res,next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // check if user exists and password matches
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      messsage: "User LoggedIn successfully.",
      id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};


// get all users (name and email only)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("name email"); 

    res.status(200).json({
      message: "Users fetched successfully",
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

