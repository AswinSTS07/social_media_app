import React, { useEffect, useState } from "react";
import Header from "./Components/Header/Header";
import HomeScreen from "./Screens/HomeScreen/HomeScreen";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProfileScreen from "./Screens/ProfileScreen/ProfileScreen";
import LoginScreen from "./Screens/LoginScreen/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen/RegisterScreen";
import EditProfile from "./Screens/EditProfile/EditProfile";
import UserProfile from "./Screens/UserProfile/UserProfile";

const user = {
  name: "John Doe",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  coverPhoto: "https://via.placeholder.com/800x400",
  bio: "This is a short bio about John Doe.",
};

function App() {
  const [uid, setUid] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    const fetchUser = () => {
      let user = JSON.parse(localStorage.getItem("userInfo"));
      if (user) {
        setUid(user?.id);
        setUserInfo(user);
      }
    };
    fetchUser();
  }, []);

  return (
    <BrowserRouter>
      <div>
        <Header uid={uid} />
        <div className="container-fluid">
          <Routes>
            <Route path="/" element={<HomeScreen uid={uid} />} />
            <Route
              path="/my-profile/:id"
              element={<ProfileScreen uid={uid} />}
            />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route
              path="/edit-profile/:id"
              element={<EditProfile user={userInfo} />}
            />
            <Route path="/user/:id" element={<UserProfile />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
