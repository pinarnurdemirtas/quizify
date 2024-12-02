import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, IconButton, Grid, Avatar, Button, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import "./Profile.css";

const Profile = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleDeleteAccount = () => {
        alert("Hesabınız silindi.");
        localStorage.removeItem("user");
        navigate("/");
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
                                <div className="profile-detail">
                                    <Typography className="profile-label">Email:</Typography>
                                    <TextField
                                        value={user?.email}
                                        variant="outlined"
                                        fullWidth
                                        className="profile-input"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <IconButton className="edit-icon">
                                        <EditIcon />
                                    </IconButton>
                                </div>
                                <div className="profile-detail">
                                    <Typography className="profile-label">Username:</Typography>
                                    <TextField
                                        value={user?.username}
                                        variant="outlined"
                                        fullWidth
                                        className="profile-input"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <IconButton className="edit-icon">
                                        <EditIcon />
                                    </IconButton>
                                </div>
                                <div className="profile-detail">
                                    <Typography className="profile-label">Gender:</Typography>
                                    <TextField
                                        value={user?.gender}
                                        variant="outlined"
                                        fullWidth
                                        className="profile-input"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <IconButton className="edit-icon">
                                        <EditIcon />
                                    </IconButton>
                                </div>
                                <div className="profile-detail">
                                    <Typography className="profile-label">Department:</Typography>
                                    <TextField
                                        value={user?.department}
                                        variant="outlined"
                                        fullWidth
                                        className="profile-input"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <IconButton className="edit-icon">
                                        <EditIcon />
                                    </IconButton>
                                </div>
                                <div className="profile-detail">
                                    <Typography className="profile-label">Phone Number:</Typography>
                                    <TextField
                                        value={user?.phone}
                                        variant="outlined"
                                        fullWidth
                                        className="profile-input"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <IconButton className="edit-icon">
                                        <EditIcon />
                                    </IconButton>
                                </div>
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
