import React from 'react';
import { Drawer, Card, CardContent, Typography, List, ListItem, IconButton, ListItemSecondaryAction, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';  // Çarpı simgesini ekliyoruz

function Cart({ cartItems, open, onClose, onRemove, onComplete }) {

    // Sepet öğelerini konsola yazdıracak fonksiyon
    const handleComplete = () => {
        // Sepetteki öğeleri konsola yazdırıyoruz
        console.log("Sepetteki Sorular:", cartItems);
        // onComplete fonksiyonu varsa çalıştırıyoruz
        if (onComplete) {
            onComplete();
        }
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <div style={{ width: 350, padding: 20 }}>
                {/* Çarpı simgesini üst sağ köşeye yerleştiriyoruz */}
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

                                    {/* Eğer şıklar varsa ve undefined değilse, sadece Test sorularında göster */}
                                    {item.options && Array.isArray(item.options) && item.options.length > 0 ? (
                                        <List>
                                            {item.options.map((option, index) => (
                                                // undefined değerlerini kontrol ediyoruz
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
                                        // Şık olmayan sorularda sadece text'i göster
                                        <Typography variant="body2" color="textSecondary">
                                            Şıklar mevcut değil.
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Çöp ikonunu sağ tarafa yerleştiriyoruz */}
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => onRemove(item.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>

                {/* Sepeti Tamamla butonunu altta yerleştiriyoruz */}
                <Button
                    variant="contained"
                    sx={{ backgroundColor: "#94a4fa", color: "black", width: '100%', marginTop: '20px' }}
                    onClick={handleComplete}  // onComplete yerine handleComplete fonksiyonunu kullanıyoruz
                >
                    Sınav Oluştur
                </Button>
            </div>
        </Drawer>
    );
}

export default Cart;
