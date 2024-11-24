import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@mui/material";
import "./Profile.css";

const Profile = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

   

    return (
        <div className="profile-container">
            <Card className="profile-card">
                <CardContent>
                    <Typography variant="h5" component="div" className="profile-title">
                        Hoş Geldiniz, {user?.name} {user?.surname}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" className="profile-info">
                        <strong>Email:</strong> {user?.email}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" className="profile-info">
                        <strong>Kullanıcı Adı:</strong> {user?.username}
                    </Typography>
                    
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
