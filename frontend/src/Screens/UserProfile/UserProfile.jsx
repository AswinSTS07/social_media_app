import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import RightCard from "../../Components/RightCard/RightCard";
import axios from "axios";
import { BASE_URL } from "../../constant";
import { useParams } from "react-router-dom";
import Post from "../../Components/Post/Post";

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

function UserProfile() {
  const { id } = useParams();
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        setLoading(true);

        let res = await axios.get(BASE_URL + `/api/v1/user/posts/${id}`);
        setPost(res?.data?.data);
        setLoading(false);
      };
      fetchPost();
    } catch (error) {
      console.log("Error while fetching post : ", error);
    }
  }, []);
  return (
    <div>
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
                    {post.length > 0 ? (
                      post.map((p, index) => (
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
                      ))
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          top: "100px",
                          position: "relative",
                        }}
                      >
                        No post
                      </div>
                    )}
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
    </div>
  );
}

export default UserProfile;
