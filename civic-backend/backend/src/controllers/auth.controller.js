import { signupUser, loginUser } from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { db } from "../config/db.js";

const users = () => db.collection("users");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

/* =========================================================
   SIGNUP
========================================================= */

export async function signup(req, res) {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are required",
      });
    }

    const allowedRoles = ["citizen", "authority"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account type. Choose citizen or authority.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters",
      });
    }

    const user = await signupUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: phone?.trim(),
      role,
    });

    const { token } = await loginUser(
      email.trim().toLowerCase(),
      password
    );

    res
      .cookie("civicplus_token", token, cookieOptions)
      .status(201)
      .json({
        success: true,
        message: "Account created successfully",
        user,
      });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Signup failed",
    });
  }
}

/* =========================================================
   LOGIN
========================================================= */

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const { token, user } = await loginUser(
      email.trim().toLowerCase(),
      password,
    );

    res.cookie("civicplus_token", token, cookieOptions).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    });
  }
}

/* =========================================================
   LOGOUT
========================================================= */

export async function logout(req, res) {
  res.clearCookie("civicplus_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return res.json({
    success: true,
    message: "Logged out successfully",
  });
}

/* =========================================================
   CURRENT USER
========================================================= */

export async function getCurrentUser(req, res) {
  try {
    const token = req.cookies?.civicplus_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof decoded !== "object" || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    const user = await users().findOne({
      _id: new ObjectId(decoded.userId),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired session",
    });
  }
}
