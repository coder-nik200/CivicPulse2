import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

const users = () => db.collection("users");

export async function signupUser({
  name,
  email,
  password,
  phone,
  role = "citizen",
}) {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await users().findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new Error("An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = {
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    phone: phone?.trim() || "",
    role,
    avatar: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await users().insertOne(user);

  return {
    id: result.insertedId.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

export async function loginUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await users().findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);

  if (!validPassword) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
    },
  };
}
