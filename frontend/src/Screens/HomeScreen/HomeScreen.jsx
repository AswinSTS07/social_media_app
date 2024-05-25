import React from "react";
import LeftCard from "../../Components/LeftCard/BasicList";
import RightCard from "../../Components/RightCard/RightCard";
import Post from "../../Components/Post/Post";

const user = {
  name: "John Doe",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

function HomeScreen() {
  return (
    <div className="row mt-5">
      <div className="col-md-3">
        <div className="container-fluid card">
          <LeftCard />
        </div>
      </div>
      <div className="col-md-6 scrollable-column">
        <Post
          user={user}
          time="2 hrs ago"
          content="This is a sample post content. It's a beautiful day!"
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOw1jOBmA-ZYJ75YpXWTe-GjcRBk4RljuIefCdcqNQBQ&s"
        />
        <Post
          user={user}
          time="2 hrs ago"
          content="This is a sample post content. It's a beautiful day!"
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOw1jOBmA-ZYJ75YpXWTe-GjcRBk4RljuIefCdcqNQBQ&s"
        />
        <Post
          user={user}
          time="2 hrs ago"
          content="This is a sample post content. It's a beautiful day!"
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOw1jOBmA-ZYJ75YpXWTe-GjcRBk4RljuIefCdcqNQBQ&s"
        />
        <Post
          user={user}
          time="2 hrs ago"
          content="This is a sample post content. It's a beautiful day!"
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOw1jOBmA-ZYJ75YpXWTe-GjcRBk4RljuIefCdcqNQBQ&s"
        />
      </div>
      <div className="col-md-3">
        <div className="container-fluid card">
          <RightCard />
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
