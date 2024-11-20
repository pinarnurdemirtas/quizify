import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    // Kullanıcı bilgisi yoksa login sayfasına yönlendir
   
    // Kullanıcı bilgisi yoksa herhangi bir şey render etme
    if (!user) {
        return null;
    }

    const handleLogout = () => {
        // LocalStorage'dan token ve kullanıcı bilgilerini sil
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Kullanıcıyı login sayfasına yönlendir
        navigate("/");
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
