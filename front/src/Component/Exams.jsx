import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, CardActionArea, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs"; // dayjs kütüphanesini import ediyoruz
import DeleteIcon from "@mui/icons-material/Delete"; // Delete iconunu import ediyoruz

const Exam = () => {
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null); // Seçilen sınav detayları
    const [openModal, setOpenModal] = useState(false); // Modal'ı kontrol etmek için state
    const navigate = useNavigate();

    // Kullanıcı verilerini localStorage'dan alıyoruz
    const user = JSON.parse(localStorage.getItem("user"));

    // Eğer user verisi bulunamazsa, hata mesajı gösterilebilir veya yönlendirme yapılabilir
    if (!user) {
        return <Typography variant="h6" color="error">Kullanıcı verisi bulunamadı. Lütfen giriş yapın.</Typography>;
    }

    // Kullanıcı ID'sini alıyoruz
    const userId = user.id;

    // Sınavları API'den çekiyoruz (kullanıcıya özel)
    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/Exam/user/${userId}`);
                setExams(response.data);
            } catch (error) {
                console.error("Error fetching exams:", error);
            }
        };
        fetchExams();
    }, [userId]);

    // Sınavın detaylarını almak için API çağrısı
    const handleExamClick = (examId) => {
        // Modal'ı açıyoruz ve seçilen sınavın detaylarını alıyoruz
        const selected = exams.find((exam) => exam.id === examId);
        setSelectedExam(selected);
        setOpenModal(true);
    };

    // Modal'ı kapatma fonksiyonu
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedExam(null);
    };

    // Sınavı silmek için fonksiyon
    const handleDeleteExam = async (examId) => {
        try {
            await axios.delete(`http://localhost:5000/api/Exam/${examId}`);
            setExams(exams.filter((exam) => exam.id !== examId)); // Silinen sınavı listeden çıkar
            alert("Sınav başarıyla silindi.");
        } catch (error) {
            console.error("Error deleting exam:", error);
            alert("Sınav silinirken bir hata oluştu.");
        }
    };

    return (
        <div style={{ padding: "2rem", overflowY: "auto", maxHeight: "calc(100vh - 100px)" }}>
            <Typography variant="h4" align="center" color="primary" gutterBottom>
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
                                            e.stopPropagation(); // Butona tıklanırken kartın tıklanmasını engelle
                                            handleDeleteExam(exam.id);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    <Typography variant="h6" component="h2" color="primary" gutterBottom>
                                        {exam.name}
                                    </Typography>
                                    {/* Tarih bilgisi 'created_at' üzerinden formatlanıyor */}
                                    <Typography variant="body2" color="textSecondary">
                                        {exam.created_at ? `Tarih: ${dayjs(exam.created_at).format('DD MMMM YYYY')}` : "Tarih: Belirtilmemiş"}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Modal Bileşeni */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>{selectedExam?.name}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Oluşturulma Tarihi: {dayjs(selectedExam?.created_at).format('DD MMMM YYYY')}</Typography>
                    <Typography variant="h6">PDF: <a href={selectedExam?.pdf_url} target="_blank" rel="noopener noreferrer">İndir</a></Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">Kapat</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Exam;
