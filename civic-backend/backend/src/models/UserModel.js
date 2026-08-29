import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: String,

    role: {
      type: String,
      enum: ["citizen", "authority", "admin"],
      default: "citizen",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
