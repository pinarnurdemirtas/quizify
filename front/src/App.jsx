import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Component/Login.jsx";
import Profile from "./Component/Profile.jsx";
import Register from "./Component/Register.jsx";
import Questions from "./Component/Questions.jsx"
import Home from "./Component/HomePage.jsx";
import "./App.css"

const App = () => {
    return (
        <Router>
            <div className="app">
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/questions" element={<Questions />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
            </div>
        </Router>
    );
};

export default App;
