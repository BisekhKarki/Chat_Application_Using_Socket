const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../lib/utils");
const cloudinary = require("../lib/cloudinary");

const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log(req.body);
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid user data",
      });
    }
  } catch (error) {
    console.log("Error in Sign In Controller", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    generateToken(user._id, res);
    return res.status(200).json({
      success: true,
      message: "You have been logged In",
    });
  } catch (error) {
    console.log("Error in login Controller", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    return res.status(200).json({
      success: true,
      message: "You have been logged out",
    });
  } catch (error) {
    console.log("Error in logout Controller", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({
        success: false,
        message: "Profile Pic Required",
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: updatedUser,
    });
  } catch (error) {
    console.log("Error in Profile Controller", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const checkAuth = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in Check Controller", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { signup, login, logout, updateProfile, checkAuth };
