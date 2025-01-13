import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Snackbar, Alert } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Categories from "./CategoryList";
import Profile from "./Profile";
import Questions from "./Questions";
import Cart from "./Cart";
import Exams from "./Exams.jsx";
import "./Css/Home.css";

const HomePage = () => {
    const [currentPage, setCurrentPage] = useState("questions");
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const navigate = (page) => {
        setCurrentPage(page);
    };

    const handleLogout = () => {
        console.log("Logged out");
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const handleLeafCategorySelect = (categoryId) => {
        setSelectedCategoryId(categoryId);
    };

    const handleAddToCart = (question) => {
        setCartItems((prevItems) => {
            const isQuestionInCart = prevItems.some(item => item.id === question.id);

            if (isQuestionInCart) {
                setSnackbar({
                    open: true,
                    message: 'Bu soru zaten sepette!',
                    severity: 'warning',
                });
                return prevItems;
            }

            const updatedItems = [
                ...prevItems,
                {
                    id: question.id,
                    text: question.question_text,
                    questionType: question.question_type ?? "Test",
                    answer: question.answer,
                    options: [question.op1, question.op2, question.op3, question.op4, question.op5],
                },
            ];

            setSnackbar({
                open: true,
                message: 'Soru sepete başarıyla eklendi!',
                severity: 'success',
            });

            return updatedItems;
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleRemoveFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const renderPage = () => {
        switch (currentPage) {
            case "exams":
                return <Exams />;
            case "profile":
                return <Profile />;
            case "questions":
                return (
                    <div className="questions-container">
                        <Categories onLeafCategorySelect={handleLeafCategorySelect} />
                        <div className="questions-content">
                            {selectedCategoryId ? (
                                <Questions
                                    categoryId={selectedCategoryId}
                                    handleAddToCart={handleAddToCart}
                                />
                            ) : (
                                <p style={{ color: "white", fontSize: 20, textAlign: "center" }}>
                                    Lütfen bir kategori seçin.
                                </p>
                            )}
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="content-container">
                        <h1>Sayfa Bulunamadı</h1>
                    </div>
                );
        }
    };

    return (
        <div className="homepage-container">
            <AppBar position="static" sx={{ background: "linear-gradient(to left, #000000, #3533cd)" }}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Typography variant="h6" className="app-title">
                        QUIZIFY
                    </Typography>
                    <div>
                        <Button color="inherit" onClick={() => navigate("questions")}>
                            Sorular
                        </Button>
                        <Button color="inherit" onClick={() => navigate("profile")}>
                            Profil
                        </Button>
                        <Button color="inherit" onClick={() => navigate("exams")}>
                            Sınavlar
                        </Button>
                    </div>
                    <div>
                        <IconButton color="inherit" onClick={handleDrawerToggle}>
                            <ShoppingCartIcon />
                        </IconButton>
                        <IconButton color="inherit" onClick={handleLogout}>
                            <LogoutIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            <div className="content">{renderPage()}</div>
            <Cart
                cartItems={cartItems}
                open={drawerOpen}
                onClose={handleDrawerToggle}
                onRemove={handleRemoveFromCart}
                ModalProps={{
                    disableEnforceFocus: true,
                }}
            />
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default HomePage;
