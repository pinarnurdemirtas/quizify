import React, { useState, useEffect } from 'react';
import {
    Drawer,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    IconButton,
    ListItemSecondaryAction,
    Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { generatePdf, uploadExamPdf } from '../services/pdf.jsx';
import { saveExam } from '../services/api';

function Cart({ cartItems, open, onClose, onRemove }) {
    const [shuffledItems, setShuffledItems] = useState(cartItems); // cartItems'ı ara state olarak al
    const [openModal, setOpenModal] = useState(false);
    const [examName, setExamName] = useState('');


    // Shuffle function
    const shuffleItems = () => {
        const shuffled = [...shuffledItems] // İlk başta soruları karıştır
            .sort(() => Math.random() - 0.5) // Soruları karıştır

        const shuffledWithOptions = shuffled.map(item => {
            // Eğer şıklar varsa, şıkları da karıştır
            if (item.options && Array.isArray(item.options)) {
                const shuffledOptions = [...item.options].sort(() => Math.random() - 0.5); // Şıkları karıştır
                return { ...item, options: shuffledOptions }; // Karışık şıkları item'e ekle
            }
            return item; // Şık yoksa sadece öğeyi geri döndür
        });

        setShuffledItems(shuffledWithOptions); // Yeni karışık listeyi state'e at
    };


    // cartItems değişirse shuffledItems'ı güncelle
    useEffect(() => {
        setShuffledItems(cartItems);
    }, [cartItems]);


    const handleComplete = async () => {
        if (!examName) {
            alert('Lütfen sınav adını girin.');
            return;
        }

        try {
            const { doc, examQuestions } = generatePdf(examName, shuffledItems);
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
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center', // Dikey hizalama
                        justifyContent: 'space-between', // Aralarında boşluk bırakma
                        marginBottom: '20px', // Altına biraz boşluk ekleyelim
                    }}
                >
                    
                    <Button
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(to left, #000000, #3533cd)',
                            color: 'white',
                            width: 'auto',
                            marginLeft: '10px', // Biraz boşluk bırak
                            marginRight: '10px', // İki yanda boşluk eşit olsun
                            transition: 'background 0.5s',
                            '&:hover': {
                                background: 'linear-gradient(to right, #000000, #3533cd)',
                            },
                        }}
                        onClick={shuffleItems} // Karıştırma fonksiyonunu çağırır
                    >
                        Soruları ve Şıkları Karıştır
                    </Button>

                    <IconButton
                        onClick={onClose}
                        color="inherit"
                        sx={{ position: 'relative' }} // Absolute yerine relative kullanalım
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>



                <List>
                    {shuffledItems.map((item) => ( // shuffledItems'ı kullanıyoruz
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

                

                {/* Sınav Oluştur Button */}
                <Button
                    variant="contained"
                    sx={{
                        background: 'linear-gradient(to left, #000000, #3533cd)',
                        color: 'white',
                        width: '100%',
                        marginTop: '10px',
                        transition: 'background 0.5s',
                        '&:hover': {
                            background: 'linear-gradient(to left, #3533cd, #000000)',
                        },
                    }}
                    onClick={handleOpenModal} // Modal açma fonksiyonunu çağırır
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
