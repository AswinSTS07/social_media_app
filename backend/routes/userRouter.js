const express = require("express");
const {
  register,
  login,
  getAllPost,
  searchUser,
  getUserDetails,
  checkFollowed,
  sendFollowRequest,
  unFollow,
  getFollowing,
} = require("../controllers/userController");
const Post = require("../models/postModel");
const { post } = require("../data");
const { cloudinary } = require("../utils/cloudinary");
const User = require("../models/userModel");

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

const uploadImage = async (src) => {
  try {
    const fileStr = src;
    if (src && fileStr) {
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: "cloudinary_react",
        public_id: Date.now(),
      });
      if (uploadResponse && uploadResponse.url) {
        return uploadResponse.url;
      } else {
        throw new Error("Failed to upload image");
      }
    }
  } catch (err) {
    console.error("Error", err);
    throw err;
  }
};

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

userRouter.get("/search", async (req, res) => {
  let query = req.query;

  await searchUser(query).then((result) => {
    res.send(result);
  });
});

userRouter.get("/user/:id", async (req, res) => {
  await getUserDetails(req.params.id).then((result) => {
    res.send(result);
  });
});

userRouter.post("/edit-profile/:id", async (req, res) => {
  try {
    const coverSrc = await uploadImage(req.body?.coverPhoto);
    const profileSrc = await uploadImage(req.body?.profile);
    delete req.body.coverPhoto;
    delete req.body.profile;

    req.body.profileImage = profileSrc;
    req.body.coverImage = coverSrc;

    const result = await User.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );

    res.status(200).json({ message: "Profile updated successfully", coverSrc });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update profile", error: err.message });
  }
});

userRouter.post("/check-followed", async (req, res) => {
  await checkFollowed(req.body.fromId, req.body.toId).then((result) => {
    res.send(result);
  });
});

userRouter.post("/send-follow-request", async (req, res) => {
  await sendFollowRequest(req.body.fromId, req.body.toId).then((result) => {
    res.send(result);
  });
});

userRouter.post("/unfollow", async (req, res) => {
  await unFollow(req.body.fromId, req.body.toId).then((result) => {
    res.send(result);
  });
});

userRouter.get("/following/:id", async (req, res) => {
  await getFollowing(req.params.id).then((result) => {
    res.send(result);
  });
});

userRouter.put("/:postId/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    console.log("req body userId : ", req.body.userId);
    if (!post.likes.includes(req.body.userId)) {
      post.likes.push(req.body.userId);
    } else {
      post.likes.pull(req.body.userId);
    }
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

userRouter.post("/:postId/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    const newComment = {
      userId: req.body.userId,
      text: req.body.text,
    };
    post.comment.push(newComment);
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = userRouter;
