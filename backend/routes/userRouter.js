const express = require("express");
const {
  register,
  login,
  getAllPost,
} = require("../controllers/userController");
const Post = require("../models/postModel");
const { post } = require("../data");
const { cloudinary } = require("../utils/cloudinary");

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("user router called....");
});

userRouter.post("/login", async (req, res) => {
  let userData = req.body;
  await login(userData).then((result) => {
    res.send(result);
  });
});

userRouter.post("/register", async (req, res) => {
  let userData = req.body;
  await register(userData).then((result) => {
    res.send(result);
  });
});

userRouter.get("/posts/:id", async (req, res) => {
  let userId = req.params.id;
  await getAllPost(userId).then((result) => {
    res.send(result);
  });
});

userRouter.post("/upload-cover-photo/:id", async (req, res) => {
  try {
    const fileStr = req.body.src;

    const uploadResponse = await cloudinary.uploader
      .upload(fileStr, {
        upload_preset: "cloudinary_react",
        public_id: Date.now(),
      })
      .then(async (response) => {
        if (response && response.url) {
          let postData = {
            userId: req.params.id,
            caption: req.body.caption,
            type: "image",
            src: req.body.src,
            category: "photography",
          };
          await Post.create(postData);
          res.status(200).json({ message: "Cover photo uploaded" });
        } else {
          res.status(400);
        }
      });
  } catch (err) {
    console.error("Error ", err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

module.exports = userRouter;
