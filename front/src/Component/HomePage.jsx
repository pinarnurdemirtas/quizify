import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Categories from "./CategoryList";
import Profile from "./Profile";
import Questions from "./Questions";
import Cart from "./Cart";
import "./home.css";

const HomePage = () => {
    const [currentPage, setCurrentPage] = useState("questions");
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [cartItems, setCartItems] = useState([]); // Sepet öğeleri burada tutuluyor
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navigate = (page) => {
        setCurrentPage(page);
    };

    const handleLogout = () => {
        console.log("Logged out");
        window.location.href = "/login";
    };

    const handleLeafCategorySelect = (categoryId) => {
        setSelectedCategoryId(categoryId);
    };

    const handleAddToCart = (question) => {
        setCartItems((prevItems) => {
            const updatedItems = [
                ...prevItems,
                {
                    id: question.id,
                    text: question.question_text,
                    category: question.category,
                    options: [question.op1, question.op2, question.op3, question.op4], // Şıkları her durumda ekle
                },
            ];
            console.log(updatedItems); // Debug cart items
            return updatedItems;
        });
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
                return (
                    <div className="content-container">
                        <h1>Sınavlar</h1>
                        <p>Burada sınavlarınızı görebilirsiniz.</p>
                    </div>
                );
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
                                    handleAddToCart={handleAddToCart} // Cart'a ekleme fonksiyonu props olarak gönderiliyor
                                />
                            ) : (
                                <p>Lütfen bir kategori seçin.</p>
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
            <AppBar position="static" sx={{ backgroundColor: "#6E8EFBFF" }}>
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
        </div>
    );
};

export default HomePage;
