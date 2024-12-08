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

    const handleSaveChanges = async () => {
        const completeUpdatedUser = {
            id: user.id,  // Kullanıcının ID'sini eklediğinizden emin olun
            password: "123",
            username: updatedUser.username,
            email: updatedUser.email,
            gender: updatedUser.gender,
            name: updatedUser.name,
            surname: updatedUser.surname, // Surname eklenmiş olmalı
            department: updatedUser.department,
            phone: updatedUser.phone,
            img: updatedUser.img,  // Eğer bir resim değişikliği varsa, img de eklenmeli
        };

        console.log(completeUpdatedUser); // Gönderilen veriyi console.log ile kontrol edin

        try {
            const updatedData = await updateUser(user.id, completeUpdatedUser);
            localStorage.setItem("user", JSON.stringify(updatedData));
            alert("Profil başarıyla güncellendi.");
            setIsEditing(false);
        } catch (error) {
            const errorMessage = typeof error === "string" ? error : error.message || "Bilinmeyen bir hata oluştu.";
            alert(`Profil güncelleme hatası: ${errorMessage}`);
        }
    };


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
                                {["email", "username", "gender", "department", "phone", "name", "surname"].map((field) => (
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
                                    </div>
                                ))}
                            </div>
                            {isEditing && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="save-changes-button"
                                    onClick={handleSaveChanges}
                                >
                                    Save Changes
                                </Button>
                            )}
                            <IconButton className="edit-icon" onClick={handleEditToggle}>
                                <EditIcon />
                            </IconButton>
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
