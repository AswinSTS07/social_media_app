const express = require("express");
const {
  register,
  login,
  getAllPost,
} = require("../controllers/userController");
const Post = require("../models/postModel");
const { post } = require("../data");

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

module.exports = userRouter;
