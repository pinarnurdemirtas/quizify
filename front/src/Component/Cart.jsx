import React, { useState } from 'react';
import { Drawer, Card, CardContent, Typography, List, ListItem, IconButton, ListItemSecondaryAction, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import jsPDF from 'jspdf';
import DejaVuSans from '../assets/Fonts/DejaVuSans.ttf'; 
import { uploadPdf, saveExam } from '../services/api'; 

function Cart({ cartItems, open, onClose, onRemove, onComplete }) {
    const [openModal, setOpenModal] = useState(false);  
    const [examName, setExamName] = useState('');  

    const handleComplete = async () => {
        if (!examName) {
            alert('Lütfen sınav adını girin.');
            return;
        }
        const doc = new jsPDF();
        
        doc.addFont(DejaVuSans, 'DejaVu', 'normal');
        doc.setFont('DejaVu'); 
        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        doc.text(`Ad Soyad: `, 50, 10, { align: "right" });
        doc.text(`Numara: `, 120, 10, { align: "left" });
        doc.text(`${examName} Sınav Soruları`, 105, 30, { align: "center" });

        let currentY = 50;
        const pageHeight = doc.internal.pageSize.height;
        const marginLeft = 10;
        const marginRight = 10;
        const maxWidth = doc.internal.pageSize.width - marginLeft - marginRight;

        const examQuestions = [];
        cartItems.forEach((item, index) => {
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);

            const itemText = `${index + 1}. ${item.text}`;
            if (currentY + 10 > pageHeight - 20) {
                doc.addPage();
                currentY = 20;
            }

            doc.text(itemText, marginLeft, currentY, { maxWidth });
            currentY += 10;

            examQuestions.push({
                question_id: item.id,
                exam_id: 0,
                created_at: new Date().toISOString(),
            });

            if (item.options && Array.isArray(item.options) && item.options.some(opt => opt !== undefined)) {
                item.options.forEach((option, optionIndex) => {
                    if (option !== undefined) {
                        const optionText = `${String.fromCharCode(65 + optionIndex)}. ${option}`;
                        if (currentY + 8 > pageHeight - 20) {
                            doc.addPage();
                            currentY = 20;
                        }
                        doc.text(optionText, marginLeft + 10, currentY, { maxWidth: maxWidth - 10 });
                        currentY += 8;
                    }
                });
            }
            currentY += 10;
        });

        const pdfBlob = doc.output('blob');

        try {
            const fileUrl = await uploadPdf(pdfBlob);
            const user = JSON.parse(localStorage.getItem("user"));
            const user_id = user ? user.id : null;
            if (user_id) {
                const examData = {
                    exam: {
                        id: 0,
                        user_id: user_id,
                        name: examName,
                        pdf_url: fileUrl,
                        created_at: new Date().toISOString(),
                    },
                    examQuestions: examQuestions,
                };

                await saveExam(examData);
                window.open(fileUrl, '_blank');
            } else {
                console.error("User is not logged in.");
            }
        } catch (error) {
            console.error(error.message);
        }

        setExamName('');
        setOpenModal(false);
    };

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const handleExamNameChange = (event) => setExamName(event.target.value);

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <div style={{ width: 350, padding: 20 }}>
                <IconButton
                    onClick={onClose}
                    color="inherit"
                    sx={{ position: 'absolute', top: 10, right: 10 }}
                >
                    <CloseIcon />
                </IconButton>

                <Typography variant="h5" gutterBottom>
                    Sepetim
                </Typography>
                <List>
                    {cartItems.map((item) => (
                        <ListItem key={item.id} style={{ marginBottom: '20px' }}>
                            <Card sx={{ width: '100%', padding: '10px', boxShadow: 'none' }}>
                                <CardContent>
                                    <Typography variant="body1" gutterBottom>
                                        {item.text}
                                    </Typography>
                                    {item.options && Array.isArray(item.options) && item.options.some(opt => opt !== undefined) ? (
                                        <List>
                                            {item.options.map((option, index) => (
                                                option !== undefined ? (
                                                    <ListItem key={index} style={{ paddingLeft: '0' }}>
                                                        <Typography variant="body2">
                                                            {`${String.fromCharCode(65 + index)}. ${option}`}
                                                        </Typography>
                                                    </ListItem>
                                                ) : null
                                            ))}
                                        </List>
                                    ) : (
                                        <Typography variant="body2" color="textSecondary">
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => onRemove(item.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>

                <Button
                    variant="contained"
                    sx={{ backgroundColor: "#94a4fa", color: "black", width: '100%', marginTop: '20px' }}
                    onClick={handleOpenModal}  // Modal'ı aç
                >
                    Sınav Oluştur
                </Button>
            </div>

            {/* Modal - Sınav Adı Girme */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Sınav Adı Belirle</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="exam-name"
                        label="Sınav Adı"
                        type="text"
                        fullWidth
                        value={examName}
                        onChange={handleExamNameChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        İptal
                    </Button>
                    <Button onClick={handleComplete} color="primary">
                        Oluştur
                    </Button>
                </DialogActions>
            </Dialog>
        </Drawer>
    );
}

export default Cart;
