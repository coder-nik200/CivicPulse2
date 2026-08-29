import mongoose from "mongoose";

const authoritySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    issueTypes: [
      {
        type: String,
        enum: [
          "pothole",
          "streetlight",
          "garbage",
          "water_leakage",
          "road_damage",
          "other",
        ],
      },
    ],

    area: {
      type: String,
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Authority", authoritySchema);
