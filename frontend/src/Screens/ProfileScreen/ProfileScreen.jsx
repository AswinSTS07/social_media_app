import React, { useEffect, useState } from "react";
import Post from "../../Components/Post/Post";
import "./ProfileScreen.css";
import RightCard from "../../Components/RightCard/RightCard";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import axios from "axios";
import { BASE_URL } from "../../constant";
import Swal from "sweetalert2";
import LinearWithValueLabel from "../../Components/LinearProgressWithLabel/LinearProgressWithLabel";

const user = {
  name: "John Doe",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  coverPhoto:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsrggrkJsAFC4nYdnLwWRixXAR4-thhAF-kAKeMK6B9w&s",
  bio: "This is a short bio about John Doe.",
  followers: 123,
  following: 343,
  posts: [
    {
      id: 1,
      content: "This is a sample post content. It's a beautiful day!",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOw1jOBmA-ZYJ75YpXWTe-GjcRBk4RljuIefCdcqNQBQ&s",
      time: "2 hrs ago",
    },
    {
      id: 2,
      content: "Enjoying a lovely evening with friends.",
      image: "https://via.placeholder.com/600x400",
      time: "4 hrs ago",
    },
  ],
};

function ProfileScreen() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
    setSelectedFile(file);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    previewFile(file);
    setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const uploadCoverPic = async () => {
    setLoading(true);
    let res = await axios.post(
      BASE_URL + `/api/v1/user/upload-cover-photo/6651ed15a4bdda4cea79e9e0`,
      { src: previewSource, caption }
    );
    if (res && res.status == 200) {
      setLoading(false);
      Swal.fire({
        title: "Success!",
        text: "Your Post uploaded",
        icon: "success",
      });
      window.location.reload();
    }
  };

  const [post, setPost] = useState([]);
  const [postLoading, setPostLoading] = useState(false);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        setLoading(true);
        let user = JSON.parse(localStorage.getItem("userInfo"));
        let res = await axios.get(BASE_URL + `/api/v1/user/posts/${user?.id}`);
        setPost(res?.data?.data);
        setLoading(false);
      };
      fetchPost();
    } catch (error) {
      console.log("Error while fetching post : ", error);
    }
  }, []);

  return (
    <div className="container mt-2">
      <div className="row">
        <div>
          <div className="cover-photo">
            <img src={user.coverPhoto} alt="Cover" />
          </div>
          <div className="profile-info">
            <div className="avatar">
              <img src={user.avatar} alt="Avatar" />
            </div>
            <div className="details">
              <h1 className="name">{user.name}</h1>
              <p className="bio">{user.bio}</p>
              <div className="stats">
                <span>{user.following} Following</span>
                <span>{user.followers} Followers</span>
                <span>{user.posts.length} Posts</span>
              </div>
            </div>
            <div>
              <button
                className="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Add Post
              </button>
              <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1
                        className="modal-title fs-5"
                        id="exampleModalLabel"
                        style={{
                          fontSize: "17px",
                          fontFamily: "sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        Create post
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="upload-modal">
                        <div
                          className="drop-zone"
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                        >
                          {previewSource ? (
                            <img
                              src={previewSource}
                              alt="Preview"
                              className="image-preview"
                            />
                          ) : (
                            <p>
                              Drag & drop an image here, or click to select a
                              file
                            </p>
                          )}
                          <input
                            id="fileInput"
                            type="file"
                            name="image"
                            onChange={handleCoverImageChange}
                            className="file-input"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Enter caption"
                          value={caption}
                          onChange={handleCaptionChange}
                          className="caption-input"
                        />
                        <button
                          className="upload-button"
                          onClick={() => uploadCoverPic()}
                        >
                          Upload
                        </button>
                        {loading && <LinearWithValueLabel />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <Tabs>
            <TabList>
              <Tab>Post</Tab>
              <Tab>Followers</Tab>
              <Tab>Following</Tab>
            </TabList>

            <TabPanel>
              <div className="profile-page">
                <div className="profile-posts">
                  {post.map((p, index) => (
                    <div key={index} className="post">
                      <Post
                        user={p}
                        time="2 hrs ago"
                        content="This is a sample post content. It's a beautiful day!"
                        image={p?.src}
                        avatar={user?.avatar}
                        name={user?.name}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <RightCard />
            </TabPanel>
            <TabPanel>
              <RightCard />
            </TabPanel>
          </Tabs>
        </div>
        <div className="col-md-4 mt-4 card">
          <h4 className="medium-text mt-3">People your may know</h4>
          <RightCard />
        </div>
      </div>
    </div>
  );
}

export default ProfileScreen;
