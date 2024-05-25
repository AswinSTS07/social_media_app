const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    type: { type: String, required: true },
    src: { type: String, required: true },
    likes: [],
    comment: [],
    category: { type: String, required: true },
  },
  {
    timestamp: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
