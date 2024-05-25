const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { successResponse, errorResponse } = require("../constants");
const Post = require("../models/postModel");
const JWT_SECRET = process.env.JWT_SECRET || "something_secret";

module.exports = {
  register: (userData) => {
    return new Promise(async (resolve, reject) => {
      let { username, email } = userData;
      username = await User.findOne({ username });
      email = await User.findOne({ email });
      if (username || email) {
        errorResponse.message =
          "User already exists with this usename or email";
        resolve(errorResponse);
      } else {
        let bcryptedPassword = await bcrypt.hash(userData.password, 10);

        userData.password = bcryptedPassword;
        const token = jwt.sign({ username, email }, JWT_SECRET, {
          expiresIn: "2h",
        });
        userData.token = token;

        await User.create(userData).then((result) => {
          if (result) {
            successResponse.data = result;
            resolve(successResponse);
          } else {
            resolve(errorResponse);
          }
        });
      }
    });
  },
  login: (userData) => {
    return new Promise(async (resolve, reject) => {
      const { email, password } = userData;

      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ user_id: user._id, email }, JWT_SECRET, {
          expiresIn: "2h",
        });

        user.token = token;

        successResponse.data = user;
        resolve(successResponse);
      }
      resolve(errorResponse);
    });
  },
  getAllPost: (userId) => {
    return new Promise(async (resolve, reject) => {
      const user = await User.findOne({ _id: userId });
      let post = [];
      if (user) {
        let user_interest = user?.interests;
        if (user_interest.length == 0) {
          post = await Post.find();
        } else {
          const query = { category: { $in: user_interest } };
          post = await Post.find(query);
        }
        successResponse.data = post;
        resolve(successResponse);
      }
    });
  },
};
