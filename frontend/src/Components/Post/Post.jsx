import React from "react";
import "./Post.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

function Post({ user, time, content, image, avatar, name }) {
  return (
    <div>
      <div className="post">
        <div className="post-header">
          <div className="user-avatar">
            <img src={user.avatar || avatar} alt={`${user.name}'s avatar`} />
          </div>
          <div className="user-info">
            <span className="user-name">{user.name || name}</span>
            <span className="post-time">{time}</span>
          </div>
        </div>
        <div className="post-content">
          <p>{content}</p>
          {image && <img src={image} alt="Post content" className="w-100" />}
        </div>
        <div className="post-actions">
          <button className="action-button">
            <FavoriteBorderIcon />
          </button>
          <button className="action-button">
            <ChatBubbleOutlineIcon />
          </button>
          <button className="action-button">
            <BookmarkBorderIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Post;
