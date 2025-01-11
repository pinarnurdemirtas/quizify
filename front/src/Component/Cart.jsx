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
import { generatePdf, uploadExamPdf, generateAnswerKeyPdf } from '../services/pdf.jsx';
import { saveExam } from '../services/api';

function Cart({ cartItems, open, onClose, onRemove }) {
    const [shuffledItems, setShuffledItems] = useState(cartItems);
    const [openModal, setOpenModal] = useState(false);
    const [examName, setExamName] = useState('');

    const groupByQuestionType = (items) => {
        return items.reduce((groups, item) => {
            const type = item.questionType || 'Diğer';
            if (!groups[type]) {
                groups[type] = [];
            }
            groups[type].push(item);
            return groups;
        }, {});
    };

    const shuffleItems = () => {
        const shuffled = [...shuffledItems].sort(() => Math.random() - 0.5);
        const shuffledWithOptions = shuffled.map(item => {
            if (item.options && Array.isArray(item.options)) {
                const shuffledOptions = [...item.options].sort(() => Math.random() - 0.5);
                return { ...item, options: shuffledOptions };
            }
            return item;
        });
        setShuffledItems(shuffledWithOptions);
    };

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
            console.log(user); // Burada user objesini kontrol edin

            const user_id = user.id;
            if (user_id) {
                const examData = {
                    exam: {
                        id: 0,
                        user_id: user_id,
                        name: examName,
                        pdf_url: pdfBlob,
                        createdAt: new Date().toISOString(),
                    },
                    exam_questions: examQuestions,
                };
                console.log('Gönderilen examData:', JSON.stringify(examData, null, 2));

                const fileUrl = await uploadExamPdf(pdfBlob, examData);
                console.log('Gönderilen url:', fileUrl);

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

    const handleGenerateAnswerKey = async () => {
        try {
            const { doc } = generateAnswerKeyPdf(shuffledItems);
            const pdfBlob = doc.output('blob');
            const url = URL.createObjectURL(pdfBlob);
            window.open(url, '_blank');
        } catch (error) {
            console.error("Cevap anahtarı oluşturma hatası:", error.message);
        }
    };

    const groupedItems = groupByQuestionType(shuffledItems);

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <div style={{ width: 800, padding: 20 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '20px',
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(to left, #000000, #3533cd)',
                            color: 'white',
                            width: 'auto',
                            marginLeft: '10px',
                            marginRight: '10px',
                            transition: 'background 0.5s',
                            '&:hover': {
                                background: 'linear-gradient(to right, #000000, #3533cd)',
                            },
                        }}
                        onClick={shuffleItems}
                    >
                        Soruları ve Şıkları Karıştır
                    </Button>

                    <IconButton
                        onClick={onClose}
                        color="inherit"
                        sx={{ position: 'relative' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                {Object.entries(groupedItems).map(([type, items]) => (
                    <div key={type}>
                        <Typography variant="h6" gutterBottom>{type}</Typography>
                        <List>
                            {items.map((item) => (
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
                    </div>
                ))}

                <Button
                    variant="contained"
                    sx={{
                        background: 'linear-gradient(to left, #009900, #000000)',
                        color: 'white',
                        width: '100%',
                        marginTop: '10px',
                        transition: 'background 0.5s',
                        '&:hover': {
                            background: 'linear-gradient(to left, #000000, #009900)',
                        },
                    }}
                    onClick={handleOpenModal}
                >
                    Sınav Oluştur
                </Button>

                <Button
                    variant="contained"
                    sx={{
                        background: 'linear-gradient(to left, #C80815, #000000)',
                        color: 'white',
                        width: '100%',
                        marginTop: '10px',
                        transition: 'background 0.5s',
                        '&:hover': {
                            background: 'linear-gradient(to left, #000000, #C80815)',
                        },
                    }}
                    onClick={handleGenerateAnswerKey}
                >
                    Cevap Anahtarı Oluştur
                </Button>
            </div>
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
