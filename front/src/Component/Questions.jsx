import React, { useState, useEffect } from 'react';
import {Card, CardContent, Typography, Grid, Paper, Divider, Button, Box, Modal, TextField, IconButton} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import { fetchQuestionsByCategory, fetchTestQuestionsByCategory, addQuestion, addTestQuestion } from '../services/api';

function Questions({ categoryId, handleAddToCart }) {
    const [questions, setQuestions] = useState([]);
    const [testQuestions, setTestQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        question_text: '',
        question_type: '',
        category_id: categoryId,
    });

    useEffect(() => {
        if (!categoryId) return;
        setLoading(true);
        setError(null);
        const getQuestions = async () => {
            try {
                const fetchedQuestions = await fetchQuestionsByCategory(categoryId);
                setQuestions(fetchedQuestions);
            } catch (err) {
                setError(err.message);
            }
        };
        const getTestQuestions = async () => {
            try {
                const fetchedTestQuestions = await fetchTestQuestionsByCategory(categoryId);
                setTestQuestions(fetchedTestQuestions);
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
        Dogru_Yanlis: questions.filter((q) => q.question_type === 'dogru_yanlis'),
        Bosluk_Doldurma: questions.filter((q) => q.question_type === 'bosluk_doldurma'),
        Test: testQuestions,
    };

    const categories = Object.keys(categorizedQuestions);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleOpenModal = () => {
        setNewQuestion((prev) => ({
            ...prev,
            question_type: selectedCategory.toLowerCase(), 
        }));
        setOpenModal(true);
    };

    const handleCloseModal = () => setOpenModal(false);

    const handleAddQuestion = async () => {
        try {
            if (newQuestion.question_type === 'test') {
                const { question_type, ...testQuestionData } = newQuestion;
                const addedTestQuestion = await addTestQuestion({
                    ...testQuestionData,
                    op1: newQuestion.op1 || '',
                    op2: newQuestion.op2 || '',
                    op3: newQuestion.op3 || '',
                    op4: newQuestion.op4 || '',
                });
                setTestQuestions([...testQuestions, addedTestQuestion]);
            } else {
                const addedQuestion = await addQuestion(newQuestion);
                setQuestions([...questions, addedQuestion]); 
            }
            handleCloseModal();
            setNewQuestion({ question_text: '', question_type: '', category_id: categoryId });
        } catch (err) {
            setError(err.message);
        }
    };



    if (loading) return <div>Loading questions...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <Grid container spacing={2} justifyContent="center" sx={{ marginBottom: 3, paddingTop: 5 }}>
                {categories.map((category) => (
                    <Grid item xs={12} sm={3} md={2} key={category}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleCategoryClick(category)}
                            sx={{
                                color: "black",
                                backgroundColor: 'rgba(211,211,211,0.49)',
                                '&:hover': { backgroundColor: 'rgba(143,175,244,0.71)' },
                                '&:focus': { outline: 'none' },
                                boxShadow: '0px 5px 10px #94a4fa',
                            }}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Button>
                    </Grid>
                ))}
            </Grid>
            <Divider sx={{ marginY: 2 }} />
            {selectedCategory && categorizedQuestions[selectedCategory].length > 0 && (
                <div>
                    <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                        {categorizedQuestions[selectedCategory].map((question) => (
                            <Box key={question.id} sx={{ marginBottom: 3 }}>
                                <Paper elevation={5} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
                                    <Card sx={{ width: '100%', margin: 'auto', boxShadow: 3 }}>
                                        <CardContent>
                                            <Typography variant="body2" color="textSecondary">
                                                {question.question_text}
                                            </Typography>
                                            {selectedCategory === 'Test' && (
                                                <div>
                                                    <div><strong>A.</strong> {question.op1}</div>
                                                    <div><strong>B.</strong> {question.op2}</div>
                                                    <div><strong>C.</strong> {question.op3}</div>
                                                    <div><strong>D.</strong> {question.op4}</div>
                                                </div>
                                            )}
                                        </CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                            <Button
                                                size="large"
                                                sx={{
                                                    color: "#152eb1",
                                                    '&:focus': { outline: 'none' },
                                                }}
                                                onClick={() => handleAddToCart(question)}
                                                startIcon={<AddCircleIcon />}
                                            >
                                            </Button>
                                        </Box>
                                    </Card>
                                </Paper>
                            </Box>
                        ))}
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                position: 'fixed', 
                                top: 100, 
                                right: 40,  
                                maxHeight: 70,
                                maxWidth: 130,
                                overflowY: 'auto',
                                zIndex: 1000,  
                                color: "black",
                                backgroundColor: 'rgba(143,175,244,0.71)',
                                '&:hover': { backgroundColor: 'rgba(211,211,211,0.49)' },
                                '&:focus': { outline: 'none' },
                                boxShadow: '0px 15px 20px #D3D3D37C',
                            }}
                            onClick={handleOpenModal}
                            startIcon={<AddCircleIcon />}
                        >
                            Yeni Soru Ekle
                        </Button>

                    </Box>
                </div>
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
                    {selectedCategory === 'Test' && (
                        <>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Seçenek A"
                                variant="outlined"
                                value={newQuestion.op1 || ''}
                                onChange={(e) => setNewQuestion({ ...newQuestion, op1: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Seçenek B"
                                variant="outlined"
                                value={newQuestion.op2 || ''}
                                onChange={(e) => setNewQuestion({ ...newQuestion, op2: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Seçenek C"
                                variant="outlined"
                                value={newQuestion.op3 || ''}
                                onChange={(e) => setNewQuestion({ ...newQuestion, op3: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Seçenek D"
                                variant="outlined"
                                value={newQuestion.op4 || ''}
                                onChange={(e) => setNewQuestion({ ...newQuestion, op4: e.target.value })}
                            />
                        </>
                    )}
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handleAddQuestion}
                    >
                        Ekle
                    </Button>
                </Box>
            </Modal>

        </div>
    );
}

export default Questions;
