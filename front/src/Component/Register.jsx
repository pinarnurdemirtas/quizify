import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./register.css"; // Eğer ayrı bir CSS dosyası varsa

const Register = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const registerData = {
            name,
            surname,
            email,
            username,
            password,
        };

        try {
            const response = await axios.post(
                "http://localhost:5000/api/Register/Register",
                registerData
            );

            if (response.status === 200) {
                alert("Registration successful! You can now log in.");
                navigate("/"); // Kayıt başarılıysa login ekranına yönlendir
            }
        } catch (error) {
            setError("Registration failed. Please try again.");
            console.error("Registration failed:", error);
        }
    };

    return (
        <div className="register-card">
            <div className="register-form">
                <h1 className="register-title">Register</h1>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Surname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        className="input-field"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        required
                    />
                    <button type="submit" className="register-button">Sign Up</button>
                </form>

            </div>
        </div>
    );
};

export default Register;