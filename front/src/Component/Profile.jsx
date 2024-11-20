import React from "react";
import { useNavigate } from "react-router-dom";  // useNavigate kullanımı
// Profile.jsx olarak adlandırıyoruz

const Profile = () => {
    const navigate = useNavigate();  // useNavigate hook'u
    const user = JSON.parse(localStorage.getItem("user"));

    // Kullanıcı bilgisi yoksa login sayfasına yönlendir
    if (!user) {
        navigate("/");  // Kullanıcı bilgisi yoksa login sayfasına yönlendiriyoruz
        return null;  // Kullanıcı bilgisi yoksa render etmiyoruz
    }

    const handleLogout = () => {
        // LocalStorage'dan token ve kullanıcı bilgilerini sil
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Kullanıcıyı login sayfasına yönlendir
        navigate("/");  // Kullanıcı logout olduktan sonra login sayfasına yönlendirme
    };

    return (
        <div>
            <h2>Welcome, {user?.name} {user?.surname}</h2>
            <p>Email: {user?.email}</p>
            <p>Username: {user?.username}</p>
            <button onClick={handleLogout} className="button">Logout</button>
        </div>
    );
};

export default Profile;
