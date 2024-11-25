import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css"; // Eğer ayrı bir CSS dosyası varsa

const Register = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const registerData = {
            name,
            surname,
            email,
            department,
            username,
            password,
            gender,
            phone,
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
                    <div className="input-pair">
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
                    </div>
                    <div className="input-pair">
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
                            placeholder="Department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="input-pair">
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
                    </div>
                    <div className="input-pair">
                        <input
                            type="tel"
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="input-field"
                            required
                        />
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="input-field"
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <button type="submit" className="register-button">Sign Up</button>
                </form>

            </div>
        </div>
    );
};

export default Register;