import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  category: {
    type: String,
    enum: ["pothole", "garbage", "streetlight", "obstruction", "waterlogging"],
    required: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  imagePublicId: {
    type: String,
  },
  thumbnailUrl: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
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
    required: true,
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
    enum: ["REPORTED", "AI_ANALYZED", "VERIFIED", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "RESOLUTION_VERIFIED", "CLOSED"],
    default: "REPORTED",
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reporterEmail: {
    type: String,
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
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
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
  },
  resolutionImageUrl: {
    type: String,
  },
  resolutionImagePublicId: {
    type: String,
  },
  resolutionNotes: {
    type: String,
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
    type: String,
    ref: "Issue",
  },
  isDuplicate: {
    type: Boolean,
    default: false,
  },
  aiAnalysis: {
    category: String,
    confidence: Number,
    summary: String,
    severity: Number,
    suggestedPriority: Number,
    analyzedAt: Date,
  },
});

// Create geospatial index for location-based queries
issueSchema.index({ location: "2dsphere" });
issueSchema.index({ status: 1, createdAt: -1 });
issueSchema.index({ category: 1, status: 1 });
issueSchema.index({ id: 1 });

// Auto-update updatedAt on every save
issueSchema.pre("findOneAndUpdate", function () {
  this.set({ updatedAt: new Date() });
});

export const Issue = mongoose.model("Issue", issueSchema);
