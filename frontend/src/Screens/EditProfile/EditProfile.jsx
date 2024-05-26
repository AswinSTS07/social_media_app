import React, { useState } from "react";
import "./EditProfile.css";

const EditProfile = ({ user }) => {
  console.log("USER--------->", user ? user : "no user");
  console.log("coverPhoto-------------", user?.coverImage);
  const [name, setName] = useState(user?.username);
  const [bio, setBio] = useState(user?.bio);
  const [avatar, setAvatar] = useState(user?.profile);
  const [coverPhoto, setCoverPhoto] = useState(user?.coverImage);
  const [previewAvatar, setPreviewAvatar] = useState(user?.profile);
  const [previewCover, setPreviewCover] = useState(user?.coverImage);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    previewFile(file, setPreviewAvatar);
    setAvatar(file);
  };

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    previewFile(file, setPreviewCover);
    setCoverPhoto(file);
  };

  const previewFile = (file, setPreview) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreview(reader.result);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Profile updated:", { name, bio, avatar, coverPhoto });
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="coverPhoto">Cover Photo</label>
          <div className="image-preview-container">
            {console.log("previewCover--------", previewCover)}
            <img
              src={previewCover}
              alt="Cover Preview"
              className="image-preview"
            />
          </div>
          <input
            type="file"
            id="coverPhoto"
            accept="image/*"
            onChange={handleCoverPhotoChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="avatar">Avatar</label>
          <div className="image-preview-container">
            <img
              src={previewAvatar}
              alt="Avatar Preview"
              className="image-preview"
            />
          </div>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="save-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
