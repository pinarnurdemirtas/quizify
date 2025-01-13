import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Grid, Avatar, Button, TextField, Snackbar, Alert } from "@mui/material";
import { updateUser, deleteUser } from "../services/api";
import "./Css/Profile.css";

const Profile = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [isEditing, setIsEditing] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({ ...user });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

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
                setSnackbar({
                    open: true,
                    message: `Hesap silme hatası: ${error.message || error}`,
                    severity: 'error',
                });
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
        if (!updatedUser.id) {
            setSnackbar({
                open: true,
                message: "User ID is missing.",
                severity: 'error',
            });
            return;
        }

        const completeUpdatedUser = {
            id: user.id,
            password: " ",
            document: updatedUser.document,
            username: updatedUser.username,
            email: updatedUser.email,
            gender: updatedUser.gender,
            name: updatedUser.name,
            surname: updatedUser.surname,
            department: updatedUser.department,
            phone: updatedUser.phone,
            isVerified: true,
            img: updatedUser.img,
        };

        try {
            const updatedData = await updateUser(user.id, completeUpdatedUser);
            localStorage.setItem("user", JSON.stringify(updatedData));
            setSnackbar({
                open: true,
                message: "Profil başarıyla güncellendi.",
                severity: 'success',
            });
            setIsEditing(false);
        } catch (error) {
            const errorMessage =
                typeof error === "string" ? error : error.message || "Bilinmeyen bir hata oluştu.";
            setSnackbar({
                open: true,
                message: `Profil güncelleme hatası: ${errorMessage}`,
                severity: 'error',
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (!user) {
        return null;
    }

    return (
        <div className="profile-page">
            <Card className="profile-card">
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} className="avatar-container">
                            <Avatar
                                alt={user?.name}
                                src={user?.img}
                                className="profile-avatar"
                            />
                            {["name", "surname", "username"].map((field) => (
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <div className="profile-info">
                                {["email", "gender", "department", "phone"].map((field) => (
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
                        </Grid>
                    </Grid>
                    <div className="save-changes-button-container">
                        <Button
                            variant="contained"
                            color="primary"
                            className="save-changes-button"
                            onClick={handleEditToggle}
                        >
                            {isEditing ? "Cancel Edit" : "Edit Profile"}
                        </Button>
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
                    </div>
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
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{ zIndex: 1500 }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Profile;
