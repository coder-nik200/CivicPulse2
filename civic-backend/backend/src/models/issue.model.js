import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    category: {
      type: String,
      enum: [
        "pothole",
        "garbage",
        "streetlight",
        "obstruction",
        "waterlogging",
      ],
      required: true,
      index: true,
    },

    description: {
      type: String,
      maxlength: 500,
      default: "",
    },

    imageUrl: {
      type: String,
      required: true,
    },

    imagePublicId: {
      type: String,
      default: null,
    },

    thumbnailUrl: {
      type: String,
      default: null,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        required: true,
      },
    },

    lat: {
      type: Number,
      required: true,
    },

    lng: {
      type: Number,
      required: true,
    },

    address: {
      type: String,
      default: "",
    },

    area: {
      type: String,
      default: "",
    },

    severity: {
      type: Number,
      min: 0,
      max: 10,
      default: 5,
    },

    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    priority: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },

    status: {
      type: String,

      enum: [
        "REPORTED",
        "AI_ANALYZED",
        "VERIFIED",
        "ASSIGNED",
        "IN_PROGRESS",
        "RESOLVED",
        "RESOLUTION_VERIFIED",
        "CLOSED",
        "REJECTED",
      ],

      default: "REPORTED",
      index: true,
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reporterEmail: {
      type: String,
      default: "",
    },

    reportCount: {
      type: Number,
      default: 1,
      min: 1,
    },

    uniqueReporterCount: {
      type: Number,
      default: 1,
      min: 1,
    },

    upvotes: {
      type: Number,
      default: 0,
      min: 0,
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    verifiedAt: {
      type: Date,
    },

    resolvedAt: {
      type: Date,
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    assignedTeam: {
      type: String,
      default: "",
    },

    resolutionImageUrl: {
      type: String,
    },

    resolutionImagePublicId: {
      type: String,
    },

    resolutionNotes: {
      type: String,
      maxlength: 1000,
    },

    resolutionVerificationScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    citizenConfirmedResolution: {
      type: Boolean,
      default: false,
    },

    duplicateOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      default: null,
    },

    isDuplicate: {
      type: Boolean,
      default: false,
    },

    aiAnalysis: {
      category: {
        type: String,
      },

      confidence: {
        type: Number,
        min: 0,
        max: 100,
      },

      summary: {
        type: String,
      },

      severity: {
        type: Number,
        min: 0,
        max: 10,
      },

      suggestedPriority: {
        type: Number,
        min: 0,
        max: 100,
      },

      analyzedAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  },
);

/*
 * Geospatial index
 *
 * coordinates must always be:
 *
 * [longitude, latitude]
 */
issueSchema.index({
  location: "2dsphere",
});

issueSchema.index({
  status: 1,
  createdAt: -1,
});

issueSchema.index({
  category: 1,
  status: 1,
});

issueSchema.index({
  lat: 1,
  lng: 1,
});

export const Issue = mongoose.model("Issue", issueSchema);

export default Issue;
