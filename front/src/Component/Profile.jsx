import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, IconButton, Grid, Avatar, Button, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { deleteUser, updateUser } from "../services/api.jsx";
import "./Profile.css";

const Profile = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({ ...user });

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleDeleteAccount = async () => {
        if (window.confirm("Hesabınızı silmek istediğinize emin misiniz?")) {
            try {
                await deleteUser(user.id);
                alert("Hesabınız silindi.");
                localStorage.removeItem("user");
                navigate("/");
            } catch (error) {
                alert(`Hata: ${error}`);
            }
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    

    if (!user) {
        return null;
    }

    return (
        <div className="profile-page">
            <Card className="profile-card">
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4} className="avatar-container">
                            <Avatar
                                alt={user?.name}
                                src={user?.img}
                                className="profile-avatar"
                            />
                            <Typography variant="h5" className="profile-name">{user?.name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <div className="profile-info">
                                {["email", "username", "gender", "department", "phone"].map((field) => (
                                    <div key={field} className="profile-detail">
                                        <Typography className="profile-label">{field.charAt(0).toUpperCase() + field.slice(1)}:</Typography>
                                        <TextField
                                            value={updatedUser[field] || ""}
                                            variant="outlined"
                                            fullWidth
                                            className="profile-input"
                                            name={field}
                                            onChange={handleInputChange}
                                            InputProps={{
                                                readOnly: !isEditing,
                                            }}
                                        />
                                        <IconButton className="edit-icon" onClick={handleEditToggle}>
                                            <EditIcon />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        </Grid>
                    </Grid>
                    <div className="delete-button-container">
                        <Button
                            variant="contained"
                            color="error"
                            className="delete-account-button"
                            onClick={handleDeleteAccount}
                        >
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
