const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    bio: { type: String },
    profileImage: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3BJK8zCgDz7hqUMbXayfD2pryk0TfUpE80N4AQ7d_Sg&s",
    },
    coverImage: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpOhXFWuDsG4QecgZ3Eei3mmz1BJsOzk2nit7fCNNFQA&s",
    },
    token: { type: String },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    private: { type: Boolean, default: false },
    blockedAcs: [],
    interests: ["travel", "food"],
    saved: [],
    profileCompleted: { type: Boolean, default: false },
  },
  {
    timestamp: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
