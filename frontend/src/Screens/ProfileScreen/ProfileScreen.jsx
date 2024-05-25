import React from "react";
import Post from "../../Components/Post/Post";
import "./ProfileScreen.css";
import RightCard from "../../Components/RightCard/RightCard";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const user = {
  name: "John Doe",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  coverPhoto:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsrggrkJsAFC4nYdnLwWRixXAR4-thhAF-kAKeMK6B9w&s",
  bio: "This is a short bio about John Doe.",
  followers: 123,
  following:343,
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
                  {user.posts.map((post) => (
                    <div key={post.id} className="post">
                      <Post
                        user={post}
                        time="2 hrs ago"
                        content="This is a sample post content. It's a beautiful day!"
                        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOw1jOBmA-ZYJ75YpXWTe-GjcRBk4RljuIefCdcqNQBQ&s"
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
