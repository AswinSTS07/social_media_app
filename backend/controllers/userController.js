const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { successResponse, errorResponse } = require("../constants");
const Post = require("../models/postModel");
const Follow = require("../models/followingModel");
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
  searchUser: (query) => {
    return new Promise(async (resolve, reject) => {
      const users = await User.find({
        username: { $regex: query?.username, $options: "i" },
      });
      successResponse.data = users;
      resolve(successResponse);
    });
  },
  getUserDetails: (userId) => {
    return new Promise(async (resolve, reject) => {
      let user = await User.findOne({ _id: userId });
      if (user) {
        successResponse.data = user;
        resolve(successResponse);
      } else {
        errorResponse.message = "User not found";
        resolve(errorResponse);
      }
    });
  },
  checkFollowed: (fromId, toId) => {
    return new Promise(async (resolve, reject) => {
      User.findOne({ _id: fromId }).then(async (fromUser) => {
        let followingCount = fromUser?.following;

        if (followingCount == 0) {
          resolve(false);
        } else {
          let check = await Follow.findOne({ userId: fromId });

          if (check) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });
  },
  sendFollowRequest: (fromId, toId) => {
    return new Promise((resolve, reject) => {
      User.findOne({ _id: fromId }).then(async (fromUser) => {
        let followingCount = fromUser?.following;
        let private = false;
        let toUser = await User.findOne({ _id: toId }, { private: 1 });
        private = toUser?.private;

        if (private) {
          // Send notification to user
        } else {
          let userFollowDetails = await Follow.findOne({ userId: fromId });

          if (followingCount == 0 || userFollowDetails == null) {
            let new_data = {
              userId: fromId,
              following: [toId],
            };
            await Follow.create(new_data);
            await User.updateOne(
              { _id: fromId },
              { $set: { following: followingCount + 1 } }
            );
            resolve(true);
          } else {
            const result = await Follow.updateOne(
              { userId: fromId },
              { $push: { following: toId } },
              { new: true, useFindAndModify: false }
            );
            if (result?.modifiedCount == 1) {
              resolve(true);
            }
          }
        }
      });
    });
  },
};
