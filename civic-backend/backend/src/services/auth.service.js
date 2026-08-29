import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

const usersCollection = () => db.collection("users");

function createToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
}

export async function signupUser({ name, email, password, phone, role }) {
  const users = usersCollection();

  const existingUser = await users.findOne({
    email,
  });

  if (existingUser) {
    throw new Error("An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = {
    name,
    email,
    password: hashedPassword,
    phone: phone || null,
    role,
    avatar: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await users.insertOne(newUser);

  if (!result.insertedId) {
    throw new Error("Failed to create user");
  }

  return {
    id: result.insertedId.toString(),
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    role: newUser.role,
    avatar: newUser.avatar,
  };
}

export async function loginUser(email, password) {
  const users = usersCollection();

  const user = await users.findOne({
    email,
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    throw new Error("Invalid email or password");
  }

  const token = createToken(user._id.toString());

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
