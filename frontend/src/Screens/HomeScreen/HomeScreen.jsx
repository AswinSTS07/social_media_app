import React, { useEffect, useState } from "react";
import LeftCard from "../../Components/LeftCard/BasicList";
import RightCard from "../../Components/RightCard/RightCard";
import Post from "../../Components/Post/Post";
import axios from "axios";
import { BASE_URL } from "../../constant";

const user = {
  name: "John Doe",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

function HomeScreen() {
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <div className="row mt-5">
      <div className="col-md-3">
        <div className="container-fluid card">
          <LeftCard />
        </div>
      </div>
      <div className="col-md-6 scrollable-column">
        {loading ? (
          <>Loading....</>
        ) : post.length > 0 ? (
          post.map((p, index) => (
            <Post
              user={p}
              time="2 hrs ago"
              content="This is a sample post content. It's a beautiful day!"
              image={p?.src}
            />
          ))
        ) : (
          <>No post available</>
        )}
      </div>
      <div className="col-md-3">
        <h4 className="medium">Recommended for you</h4>
        <div className="container-fluid card">
          <RightCard />
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
