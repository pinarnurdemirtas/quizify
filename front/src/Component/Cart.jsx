import React, { useState } from 'react';
import { Drawer, Card, CardContent, Typography, List, ListItem, IconButton, ListItemSecondaryAction, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { generatePdf, uploadExamPdf } from '../services/pdf.jsx'; 
import { saveExam } from '../services/api';

function Cart({ cartItems, open, onClose, onRemove, onComplete }) {
    const [openModal, setOpenModal] = useState(false);
    const [examName, setExamName] = useState('');

    const handleComplete = async () => {
        if (!examName) {
            alert('Lütfen sınav adını girin.');
            return;
        }

        try {
            const { doc, examQuestions } = generatePdf(examName, cartItems);
            const pdfBlob = doc.output('blob');

            const user = JSON.parse(localStorage.getItem("user"));
            const user_id = user ? user.id : null;
            if (user_id) {
                const examData = {
                    exam: {
                        id: 0,
                        user_id: user_id,
                        name: examName,
                        created_at: new Date().toISOString(),
                    },
                    examQuestions: examQuestions,
                };

                const fileUrl = await uploadExamPdf(pdfBlob, examData);

                await saveExam(examData);
                window.open(fileUrl, '_blank');
            } else {
                console.error("User is not logged in.");
            }
        } catch (error) {
            console.error("Sınav oluşturma hatası:", error.message);
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
                    onClick={handleOpenModal}
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
