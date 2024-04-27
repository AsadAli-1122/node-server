import express from "express";
import User from "../models/User.js";
import { hashPassword, comparePasswords } from "../utils/bcrypt.js";
import jwt from "jsonwebtoken";
import { validateEmail } from "../utils/validators.js";
import { generateToken } from "../utils/jwt.js";
import authenticateToken from "../middleware/auth.js";
const { JWT_SECRET } = process.env;

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      const missingFields = [];
      if (!firstName) missingFields.push("firstName");
      if (!lastName) missingFields.push("lastName");
      if (!email) missingFields.push("email");
      if (!password) missingFields.push("password");
      return res
        .status(400)
        .json({ message: "Missing required fields", missingFields });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const limitedUser = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      isVerified: newUser.isVerified,
      role: newUser.role,
    };

    const token = generateToken({ userId: newUser._id });

    res
      .status(200)
      .json({
        message: "User registration successful",
        token,
        user: limitedUser,
      });
  } catch (error) {
    console.error(error);
    if (error.code && error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Email already exists", reason: "duplicate_email" });
    }
    res.status(500).json({ message: "Failed to register user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await comparePasswords(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to login" });
  }
});

router.get("/user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "firstName lastName email isVerified role"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User details retrieved successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user details" });
  }
});

router.put("/user", authenticateToken, async (req, res) => {
    try {
      const { firstName, lastName, oldPassword, newPassword } = req.body;
  
      // Check if any field is empty
      if (!firstName && !lastName && !oldPassword && !newPassword) {
        return res.status(400).json({ message: "No fields to update" });
      }
  
      const user = await User.findById(req.userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update first name and last name if provided
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
  
      // Update password if both old and new passwords are provided
      if (oldPassword || newPassword) {
        // Check if both old and new passwords are provided
        if (!oldPassword || !newPassword) {
          return res.status(400).json({ message: "For Change password old and new passwords are required" });
        }
  
        // Check if new password is different from old password
        if (oldPassword === newPassword) {
          return res.status(400).json({ message: "New password must be different from old password" });
        }
  
        // Check if old password matches
        const isPasswordValid = await comparePasswords(oldPassword, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid old password" });
        }
  
        // Update password
        const hashedNewPassword = await hashPassword(newPassword);
        user.password = hashedNewPassword;
      }
  
      const updatedUser = await user.save();
  
      const limitedUser = {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        isVerified: updatedUser.isVerified,
        role: updatedUser.role,
      };
  
      res.status(200).json({
        message: "User details updated successfully",
        user: limitedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update user details" });
    }
  });
  
  

export default router;
