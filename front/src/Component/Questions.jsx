import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Paper, Divider, Button, Box, Modal, TextField, IconButton, Snackbar, Alert } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { fetchQuestionsByCategory, fetchTestQuestionsByCategory, addQuestion, addTestQuestion } from '../services/api';
import './Css/Questions.css'; 

function Questions({ categoryId, handleAddToCart }) {
    const [questions, setQuestions] = useState([]);
    const [testQuestions, setTestQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const [openModal, setOpenModal] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        question_text: '',
        question_type: '',
        category_id: categoryId,
        Answer: '', 
    });

    const [answerError, setAnswerError] = useState(false); 

    useEffect(() => {
        if (!categoryId) return;
        setLoading(true);
        setError(null);

        const getQuestions = async () => {
            try {
                const fetchedQuestions = await fetchQuestionsByCategory(categoryId);
                const validQuestions = fetchedQuestions.map(q => ({
                    ...q,
                    question_type: q.question_type || 'default',
                }));
                setQuestions(validQuestions);
            } catch (err) {
                setError(err.message);
            }
        };

        const getTestQuestions = async () => {
            try {
                const fetchedTestQuestions = await fetchTestQuestionsByCategory(categoryId);
                setTestQuestions(fetchedTestQuestions || []);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        getQuestions();
        getTestQuestions();
    }, [categoryId]);


    const categorizedQuestions = {
        Klasik: questions.filter((q) => q.question_type === 'klasik'),
        DogruYanlıs: questions.filter((q) => q.question_type === 'dogruyanlıs'),
        BoslukDoldurma: questions.filter((q) => q.question_type === 'boslukdoldurma'),
        Test: testQuestions,
    };

    const categories = Object.keys(categorizedQuestions);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category === selectedCategory ? null : category); 
    };

    const handleOpenModal = () => {
        setNewQuestion((prev) => ({
            ...prev,
            question_type: selectedCategory ? selectedCategory.toLowerCase() : 'default',
        }));
        setOpenModal(true);
    };

    const handleCloseModal = () => setOpenModal(false);

    const handleAddQuestion = async () => {
        if (!newQuestion.Answer) { 
            setAnswerError(true); 
            return;
        }
        setAnswerError(false); 

        try {
            let addedQuestion;
            if (newQuestion.question_type === 'test') {
                const { question_type, ...testQuestionData } = newQuestion;
                addedQuestion = await addTestQuestion({
                    ...testQuestionData,
                    Op1: newQuestion.Op1 || '',
                    Op2: newQuestion.Op2 || '',
                    Op3: newQuestion.Op3 || '',
                    Op4: newQuestion.Op4 || '',
                    Op5: newQuestion.Op5 || '',
                    Answer: newQuestion.Answer || '', 
                });
                console.log("Test Question Added: ", addedQuestion);
                setTestQuestions([...testQuestions, addedQuestion]);
            } else {
                addedQuestion = await addQuestion(newQuestion);
                console.log("Normal Question Added: ", addedQuestion);
                setQuestions([...questions, addedQuestion]);
            }

            setSnackbar({
                open: true,
                message: 'Soru ekleme isteğiniz başarıyla ileildi!',
                severity: 'success',
            });

            setTimeout(() => {
                handleCloseModal();
            }, 1000);

            setNewQuestion({ question_text: '', question_type: '', category_id: categoryId, Answer: '' });

        } catch (err) {
            setError(err.message);
        }
    };
    
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) return <div>Loading questions...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="element_q">
            <div className="container">
                {/* Kategori butonları */}
                <Grid container spacing={2} justifyContent="center" sx={{ marginBottom: 3, paddingTop: 5 }}>
                    {categories.map((category) => (
                        <Grid item xs={12} sm={3} md={2} key={category}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={() => handleCategoryClick(category)}
                                className="category-button-q"
                            >
                                {category} 
                            </Button>
                        </Grid>
                    ))}
                </Grid>
                <Divider sx={{ marginY: 2 }} />

                <Box className="element" sx={{ maxHeight: 'calc(100vh - 200px)' }}>
                    {(selectedCategory ? [selectedCategory] : categories).map((category) => (
                        <div key={category}>
                            {categorizedQuestions[category].length > 0 ? (
                                categorizedQuestions[category].map((question) => (
                                    <Box key={question.id} sx={{ marginBottom: 3 }}>
                                        <Paper elevation={5} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
                                            <Card sx={{ width: '100%', margin: 'auto', boxShadow: 3 }}>
                                                <CardContent>
                                                    <Typography variant="body4" color="#000000">
                                                        {question.question_text}
                                                    </Typography>
                                                    {category === 'Test' && (
                                                        <div>
                                                            <div><strong>A.</strong> {question.op1}</div>
                                                            <div><strong>B.</strong> {question.op2}</div>
                                                            <div><strong>C.</strong> {question.op3}</div>
                                                            <div><strong>D.</strong> {question.op4}</div>
                                                            <div><strong>E.</strong> {question.op5}</div>
                                                        </div>
                                                    )}
                                                    <Box sx={{ display: 'flex', justifyContent: 'end', marginTop: 1 }}>
                                                        <IconButton
                                                            sx={{
                                                                color: "#000000",
                                                                borderRadius: '8px',
                                                                '&:focus': { outline: 'none' },
                                                            }}
                                                            onClick={() => handleAddToCart(question)}
                                                        >
                                                            <AddCircleIcon />
                                                        </IconButton>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Paper>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2" color="textSecondary">No questions available for this category.</Typography>
                            )}
                        </div>
                    ))}
                </Box>

                {selectedCategory && (
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            position: 'fixed',
                            fontSize: 12,
                            top: 95,
                            right: 70,
                            maxHeight: 40,
                            maxWidth: 140,
                            zIndex: 1000,
                            color: "white",
                            backgroundColor: '#080822',
                            '&:hover': {
                                background: 'linear-gradient(to left, #090909, #080822)',
                            },
                            '&:focus': {
                                outline: 'none'
                            },
                        }}
                        onClick={handleOpenModal}
                    >
                        Yeni Soru Ekle
                    </Button>
                )}

                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    aria-labelledby="add-question-modal"
                    aria-describedby="add-question-form"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                        }}
                    >
                        <IconButton
                            onClick={handleCloseModal}
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" component="h2" gutterBottom>
                            Yeni Soru Ekle
                        </Typography>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Soru Metni"
                            variant="outlined"
                            value={newQuestion.question_text}
                            onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                        />
                        {/* Answer Alanı Eklendi */}
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Doğru Cevap"
                            variant="outlined"
                            value={newQuestion.Answer || ''}
                            onChange={(e) => setNewQuestion({ ...newQuestion, Answer: e.target.value })}
                            error={answerError} // Error göstermek için
                            helperText={answerError ? "Doğru cevap girilmelidir." : ""}
                        />
                        {selectedCategory === 'Test' && (
                            <>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Seçenek A"
                                    variant="outlined"
                                    value={newQuestion.Op1 || ''}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, Op1: e.target.value })}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Seçenek B"
                                    variant="outlined"
                                    value={newQuestion.Op2 || ''}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, Op2: e.target.value })}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Seçenek C"
                                    variant="outlined"
                                    value={newQuestion.Op3 || ''}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, Op3: e.target.value })}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Seçenek D"
                                    variant="outlined"
                                    value={newQuestion.Op4 || ''}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, Op4: e.target.value })}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Seçenek E"
                                    variant="outlined"
                                    value={newQuestion.Op5 || ''}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, Op5: e.target.value })}
                                />
                            </>
                        )}
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                color: "white",
                                backgroundColor: '#010b2c',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
                                },
                                '&:focus': {
                                    outline: 'none'
                                }
                            }}
                            onClick={handleAddQuestion}
                        >
                            Ekle
                        </Button>
                    </Box>
                </Modal>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
}

export default Questions;
