import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Snackbar, Alert } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Categories from "./CategoryList";
import Profile from "./Profile";
import Questions from "./Questions";
import Cart from "./Cart";
import Exams from "./Exams.jsx";
import "./Home.css";

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
            // Sepetteki sorular arasında, eklemeye çalıştığın soru var mı diye kontrol et
            const isQuestionInCart = prevItems.some(item => item.text === question.question_text);

            if (isQuestionInCart) {
                setSnackbar({
                    open: true,
                    message: 'Bu soru zaten sepette!',
                    severity: 'warning',
                });
                return prevItems;  // Eğer soru zaten sepetteyse, listeyi değiştirme
            }

            // Soru sepette değilse, yeni soru ekle
            const updatedItems = [
                ...prevItems,
                {
                    id: question.id,
                    text: question.question_text,
                    category: question.category,
                    options: [question.op1, question.op2, question.op3, question.op4],
                },
            ];

            setSnackbar({
                open: true,
                message: 'Soru sepete başarıyla eklendi!',
                severity: 'success',
            });

            console.log(updatedItems);
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
            case "home":
                return (
                    <div className="content-container">
                        <h1>Ana Sayfa</h1>
                        <p>Hoş geldiniz! Yukarıdaki menüden bir seçim yapın.</p>
                    </div>
                );
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
                                <p style={{color:"white"}}>Lütfen bir kategori seçin.</p>
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
            <AppBar position="static" sx={{ background: "linear-gradient(to left, #000000, #3533cd)" }}
            >
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
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={1000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{ zIndex: 1500 }}  
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </div>
    );
};

export default HomePage;
