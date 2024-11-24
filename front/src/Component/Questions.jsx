// Questions.js
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Paper, Divider, Button, Box } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function Questions({ categoryId, handleAddToCart }) {
    const [questions, setQuestions] = useState([]);
    const [testQuestions, setTestQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        if (!categoryId) return;

        setLoading(true);
        setError(null);

        // Kategoriye bağlı soruları almak için API çağrısı
        fetch(`http://localhost:5000/api/Questions?category=${categoryId}`)
            .then((response) => response.json())
            .then((data) => {
                setQuestions(data);
            })
            .catch((err) => {
                setError(err.message);
            });

        // Test soruları için ayrı API çağrısı
        fetch(`http://localhost:5000/api/Tests/category/${categoryId}`)
            .then((response) => response.json())
            .then((data) => {
                setTestQuestions(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [categoryId]);

    const categorizedQuestions = {
        Klasik: questions.filter((q) => q.question_type === 'klasik'),
        DogruYanlis: questions.filter((q) => q.question_type === 'dogru_yanlis'),
        BosluDoldurma: questions.filter((q) => q.question_type === 'bosluk_doldurma'),
        Test: testQuestions,
    };

    const categories = Object.keys(categorizedQuestions);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
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
                                '&:hover': {
                                    backgroundColor: 'rgba(143,175,244,0.71)',
                                },
                                '&:focus': {
                                    outline: 'none',
                                },
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
                    <Box>
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
                                                    '&:focus': {
                                                        outline: 'none',
                                                    },
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
                    </Box>
                </div>
            )}
        </div>
    );
}

export default Questions;
