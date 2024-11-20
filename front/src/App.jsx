import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Component/Login.jsx";
import Profile from "./Component/Profile.jsx";
import Register from "./Component/Register.jsx";
import "./App.css"

const App = () => {
    return (
        <Router>
            <div className="app">
                <div className="card">
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
