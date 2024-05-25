import React from "react";
import Header from "./Components/Header/Header";
import HomeScreen from "./Screens/HomeScreen/HomeScreen";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProfileScreen from "./Screens/ProfileScreen/ProfileScreen";
import LoginScreen from "./Screens/LoginScreen/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen/RegisterScreen";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <div className="container-fluid">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/profile/:id" element={<ProfileScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
