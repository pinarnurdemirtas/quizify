import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const loginData = {
            username,
            password,
        };

        try {
            const response = await fetch("http://localhost:5000/api/Login/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                throw new Error("Invalid username or password");
            }

            const data = await response.json();

            // Check the data in the console for debugging
            console.log("Login successful:", data);

            // Store the token in localStorage (or sessionStorage depending on your needs)
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect to home page after successful login
            alert(`Welcome, ${data.user.name}!`);
            navigate("/home");  // Or use: window.location.href = "/home" for an alternative method

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-card">
            <div className="login-form">
                <h1 className="login-title">Login</h1>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                    />
                    <button type="submit" className="login-button">Sign In</button>
                </form>

                <p className="sign-up">
                    Don't have an account? <Link to="/register" className="sign-up-link">Sign Up</Link>
                </p>
            </div>

            <div className="info-section">
                {/* Any other content can go here */}
            </div>
        </div>
    );
};

export default Login;
