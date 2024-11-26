import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, IconButton, Grid, Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import "./profile.css";

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
                    <Grid container spacing={3}>
                        {/* Sol Sütun - Profil Fotoğrafı ve Bilgiler */}
                        <Grid item xs={12} sm={6}>
                            <div className="profile-header">
                                <Avatar
                                    alt={user?.name}
                                    src={user?.img}
                                    sx={{ width: 90, height: 90 }}
                                    className="profile-avatar"
                                />
                            </div>
                            <div className="profile-detail">
                                <Typography variant="h6">Email</Typography>
                                <Typography variant="body1">{user?.email}</Typography>
                                <IconButton className="edit-icon">
                                    <EditIcon />
                                </IconButton>
                            </div>
                            <div className="profile-detail">
                                <Typography variant="h6">Kullanıcı Adı</Typography>
                                <Typography variant="body1">{user?.username}</Typography>
                                <IconButton className="edit-icon">
                                    <EditIcon />
                                </IconButton>
                            </div>
                            <div className="profile-detail">
                                <Typography variant="h6">Cinsiyet</Typography>
                                <Typography variant="body1">{user?.gender}</Typography>
                                <IconButton className="edit-icon">
                                    <EditIcon />
                                </IconButton>
                            </div>
                        </Grid>

                        {/* Sağ Sütun - Diğer Bilgiler */}
                        <Grid item xs={12} sm={6}>
                            <div className="profile-detail">
                                <Typography variant="h6">Departman</Typography>
                                <Typography variant="body1">{user?.department}</Typography>
                                <IconButton className="edit-icon">
                                    <EditIcon />
                                </IconButton>
                            </div>
                            <div className="profile-detail">
                                <Typography variant="h6">Telefon</Typography>
                                <Typography variant="body1">{user?.phone}</Typography>
                                <IconButton className="edit-icon">
                                    <EditIcon />
                                </IconButton>
                            </div>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
