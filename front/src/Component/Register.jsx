import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css"; // CSS dosyanız varsa

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

        // Conditionally set the image URL based on gender
        const img =
            gender === "male"
                ? "https://api.dicebear.com/8.x/adventurer/svg?seed=Cuddles&flip=true"
                : gender === "female"
                    ? "https://api.dicebear.com/8.x/adventurer/svg?seed=Cookie&flip=true"
                    : ""; // You can add a default or blank image for "other" or empty selection

        const payload = {
            name,
            surname,
            email,
            username,
            password,
            phone,
            department,
            gender,
            img,
        };
        console.log(payload); // Log to check data
        try {
            const response = await axios.post('http://localhost:5000/api/Register/Register', payload);
            // handle success
            console.log('Registration successful:', response.data);
            // Optionally, you can redirect the user after successful registration
            navigate("/somePath"); // Change to the appropriate route
        } catch (error) {
            console.error('Registration failed:', error.message);

            if (error.response && error.response.data && error.response.data.errors) {
                console.error('Validation Errors:', error.response.data.errors);
            } else {
                console.error('Error details:', error.response);
            }
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

export default Register;
