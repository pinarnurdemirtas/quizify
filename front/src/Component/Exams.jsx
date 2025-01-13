import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, CardActionArea, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchExams, deleteExam } from "../services/api.jsx";

const Exam = () => {
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        return <Typography variant="h6" color="error">Kullanıcı verisi bulunamadı. Lütfen giriş yapın.</Typography>;
    }

    const userId = user.id;

    useEffect(() => {
        const getExams = async () => {
            try {
                const examsData = await fetchExams(userId);  
                setExams(examsData);  
            } catch (error) {
                console.error("Error fetching exams:", error);
            }
        };

        getExams();  
    }, [userId]);  

    const handleExamClick = (examId) => {
        const selected = exams.find((exam) => exam.id === examId);
        setSelectedExam(selected);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedExam(null);
    };

    const handleDeleteExam = async (examId) => {
        try {
            await deleteExam(examId);
            setExams(exams.filter((exam) => exam.id !== examId));
            alert("Sınav başarıyla silindi.");
        } catch (error) {
            console.error("Error deleting exam:", error);
            alert("Sınav silinirken bir hata oluştu.");
        }
        console.log("Exam ID:", examId);
        if (!examId) {
            throw new Error("Exam ID is required.");
        }

    };

    return (
        <div style={{ padding: "2rem", overflowY: "auto", maxHeight: "calc(100vh - 100px)" }}>
            <Typography variant="h4" align="center" color="white" gutterBottom>
                Tüm Sınavlar
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {exams.map((exam) => (
                    <Grid item xs={12} sm={6} md={4} key={exam.id}>
                        <Card
                            sx={{
                                cursor: "pointer",
                                boxShadow: 6,
                                borderRadius: "16px",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                ":hover": {
                                    boxShadow: 12,
                                    transform: "scale(1.05)",
                                },
                            }}
                            onClick={() => handleExamClick(exam.id)}
                        >
                            <CardActionArea>
                                <CardContent sx={{ padding: "1.5rem", textAlign: "center", position: "relative" }}>
                                    <IconButton
                                        sx={{
                                            position: "absolute",
                                            top: "10px",
                                            right: "10px",
                                            color: "red",
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteExam(exam.id);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    <Typography variant="h6" component="h2" color="primary" gutterBottom>
                                        {exam.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {exam.created_at ? `Tarih: ${dayjs(exam.created_at).format('DD MMMM YYYY')}` : "Tarih: Belirtilmemiş"}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>{selectedExam?.name}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Oluşturulma Tarihi: {dayjs(selectedExam?.created_at).format('DD MMMM YYYY')}</Typography>
                    <Typography variant="h6">
                        PDF:
                        <a
                            href={selectedExam?.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer">
                            İndir
                        </a>
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">Kapat</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Exam;