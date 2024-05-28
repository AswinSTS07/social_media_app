const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    caption: { type: String },
    type: { type: String, required: true },
    src: { type: String, required: true },
    likes: [{ type: String }],
    comment: [commentSchema],
    category: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
