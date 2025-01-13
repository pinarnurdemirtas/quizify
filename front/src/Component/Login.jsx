import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";  
import "./Css/Login.css";
import {Token} from "@mui/icons-material";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); 
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError("Alanları eksiksiz doldurunuz.");
            return;
        }
        setIsLoading(true);
        try {
            const data = await loginUser({ username, password }); 
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/home");
            console.log(data.token);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <div className="login-card">
            <div className="login-form">
                <h1 className="login-title">Hoş Geldiniz!</h1>
                {error && <div className="error-message">Giriş Hatalı</div>}

                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Kullanıcı Adı"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="l_input-field"
                    />
                    <input
                        type="password"
                        placeholder="Şifre"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="l_input-field"
                    />
                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                    </button>
                </form>

                <p className="sign-up">
                    Yeni Hesap Oluştur <Link to="/register" className="sign-up-link">Kayıt Ol</Link>
                </p>
            </div>

            <div className="info-section">
                {/* Any other content can go here */}
            </div>
        </div>
    );
};

export default Login;
