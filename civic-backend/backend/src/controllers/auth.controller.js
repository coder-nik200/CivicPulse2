import { signupUser, loginUser } from "../services/auth.service.js";

import jwt from "jsonwebtoken";

import { ObjectId } from "mongodb";

import { db } from "../config/db.js";

/* =========================================================
   USERS COLLECTION
========================================================= */

const usersCollection = () => db.collection("users");

/* =========================================================
   COOKIE OPTIONS
========================================================= */

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
    console.log("Signup request body:", req.body);

    const { name, email, password, phone, role } = req.body;

    /* ---------------------------------------------
       VALIDATION
    --------------------------------------------- */

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

    const cleanName = name.trim();

    const cleanEmail = email.trim().toLowerCase();

    const cleanPhone = phone?.trim() || undefined;

    /* ---------------------------------------------
       CREATE USER
    --------------------------------------------- */

    const user = await signupUser({
      name: cleanName,
      email: cleanEmail,
      password,
      phone: cleanPhone,
      role,
    });

    /* ---------------------------------------------
       LOGIN AFTER SIGNUP
    --------------------------------------------- */

    const { token } = await loginUser(cleanEmail, password);

    /* ---------------------------------------------
       SEND COOKIE
    --------------------------------------------- */

    res
      .cookie("civicplus_token", token, cookieOptions)
      .status(201)
      .json({
        success: true,

        message: "Account created successfully",

        user: {
          id: user.id || user._id?.toString(),

          name: user.name,

          email: user.email,

          phone: user.phone,

          role: user.role,

          avatar: user.avatar,
        },
      });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(400).json({
      success: false,

      message: error instanceof Error ? error.message : "Signup failed",
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

    const cleanEmail = email.trim().toLowerCase();

    const { token, user } = await loginUser(cleanEmail, password);

    return res
      .cookie("civicplus_token", token, cookieOptions)
      .status(200)
      .json({
        success: true,

        message: "Login successful",

        user: {
          id: user.id || user._id?.toString(),

          name: user.name,

          email: user.email,

          phone: user.phone,

          role: user.role,

          avatar: user.avatar,
        },
      });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(401).json({
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

    const user = await usersCollection().findOne({
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
