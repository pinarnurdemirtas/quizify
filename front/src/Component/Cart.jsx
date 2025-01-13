import React, { useState, useEffect } from 'react';
import {Drawer, Card, CardContent, Typography, List, ListItem, IconButton, ListItemSecondaryAction, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Box} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { saveExam } from '../services/api';
import jsPDF from 'jspdf';
import DejaVuSans from '../assets/Fonts/DejaVuSans.ttf';
import { uploadPdf } from '../services/api.jsx'; 

const Cart = ({ cartItems, open, onClose, onRemove }) => {
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

    const generateAnswerKeyPdf = (questions) => {
        const doc = new jsPDF();
        doc.addFont(DejaVuSans, 'DejaVu', 'normal');
        doc.setFont('DejaVu');
        doc.setFontSize(16);
        doc.text('Cevap Anahtarı', 20, 20);

        let yPosition = 40;
        questions.forEach((question, index) => {
            if (question.answer !== undefined && question.answer !== null) {
                doc.setFontSize(12);
                doc.text(`${index + 1}. ${question.answer}`, 20, yPosition);
                yPosition += 10;
                if (yPosition > 280) {
                    doc.addPage();
                    yPosition = 20;
                }
            }
        });
        return { doc };
    };

    const generatePdf = (examName, cartItems) => {
        const doc = new jsPDF();
        doc.addFont(DejaVuSans, 'DejaVu', 'normal');
        doc.setFont('DejaVu');
        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        const formattedDate = new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
        doc.text(`Ad Soyad: `, 50, 10, { align: "right" });
        doc.text(`Numara: `, 140, 10, { align: "left" });
        doc.text(`${examName} Sınav Soruları`, 105, 30, { align: "center" });

        let currentY = 50;
        const pageHeight = doc.internal.pageSize.height;
        const marginLeft = 10;
        const marginRight = 10;
        const maxWidth = doc.internal.pageSize.width - marginLeft - marginRight;
        const examQuestions = [];
        const groupedItems = groupByQuestionType(cartItems || []);

        Object.entries(groupedItems).forEach(([type, items]) => {
            doc.setFontSize(15);
            doc.setTextColor(0, 0, 0);
            if (currentY + 10 > pageHeight - 20) {
                doc.addPage();
                currentY = 20;
            }
            doc.text(`${type} Bölümü`, marginLeft, currentY);
            currentY += 13;

            items.forEach((item, index) => {
                doc.setFontSize(14);
                doc.setTextColor(0, 0, 0);

                const itemText = `${index + 1}. ${item.text}`;
                if (currentY + 10 > pageHeight - 20) {
                    doc.addPage();
                    currentY = 20;
                }

                doc.text(itemText, marginLeft, currentY, { maxWidth });
                currentY += 10;

                if (item.questionType === 'dogruyanlıs' || item.questionType === 'boslukdoldurma' || item.questionType === 'klasik') {
                    examQuestions.push({
                        questionId: item.id,
                        testQuestionsId: null,
                        examId: 0,
                        createdAt: new Date().toISOString(),
                    });
                } else {
                    examQuestions.push({
                        questionId: null,
                        testQuestionsId: item.id,
                        examId: 0,
                        createdAt: new Date().toISOString(),
                    });
                }

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
                } else {
                    if (currentY + 8 > pageHeight - 20) {
                        doc.addPage();
                        currentY = 20;
                    }
                    doc.setFontSize(12);
                    doc.text('Cevap: ', marginLeft, currentY);
                    currentY += 20;
                }
                currentY += 10;
            });
        });
        return { doc, examQuestions };
    };

    const uploadExamPdf = async (pdfBlob, examData) => {
        try {
            const fileUrl = await uploadPdf(pdfBlob);
            if (examData.exam) {
                examData.exam.pdf_url = fileUrl;
            } else {
                console.error("Exam nesnesi bulunamadı.");
            }
            return fileUrl;
        } catch (error) {
            console.error("PDF yükleme hatası:", error.message);
            throw error;
        }
    };

    const handleComplete = async () => {
        if (!examName) {
            alert('Lütfen sınav adını girin.');
            return;
        }
        try {
            const { doc, examQuestions } = generatePdf(examName, shuffledItems);
            const pdfBlob = doc.output('blob');
            const user = JSON.parse(localStorage.getItem("user"));
            console.log(user); 

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
                    Cevap Anahtarını PDF Olarak Oluştur
                </Button>

                <Dialog open={openModal} onClose={handleCloseModal}>
                    <DialogTitle>Sınav Adı</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Sınav Adı"
                            fullWidth
                            value={examName}
                            onChange={handleExamNameChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal}>Vazgeç</Button>
                        <Button onClick={handleComplete} color="primary">Tamamla</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Drawer>
    );
};

export default Cart;
