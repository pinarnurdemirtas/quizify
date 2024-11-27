import React, { useState } from 'react';
import { Drawer, Card, CardContent, Typography, List, ListItem, IconButton, ListItemSecondaryAction, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from 'axios'; // Import axios
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import jsPDF from 'jspdf';
import DejaVuSans from '../assets/Fonts/DejaVuSans.ttf'; // Fontları doğru şekilde yüklemek için

function Cart({ cartItems, open, onClose, onRemove, onComplete }) {
    const [openModal, setOpenModal] = useState(false);  // Modal açma/kapama durumunu kontrol etmek için
    const [examName, setExamName] = useState('');  // Kullanıcının girdiği sınav adı

    const handleComplete = () => {
        if (!examName) {
            alert('Lütfen sınav adını girin.');
            return;
        }

        const doc = new jsPDF();

        // Türkçe karakter desteği için fontu yükleyin
        doc.addFont(DejaVuSans, 'DejaVu', 'normal');
        doc.setFont('DejaVu'); // Burada fontu kullanıyoruz

        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        // "Ad Soyad" metnini sağa hizalayarak ekliyoruz
        doc.text(`Ad Soyad: `, 50, 10, { align: "right" });

// "Numara" metnini sola hizalayarak ekliyoruz
        doc.text(`Numara: `, 120, 10, { align: "left" }); // Y pozisyonunu 40 yaparak aralarına boşluk ekledik

// "Sınav Soruları" başlığını merkeze hizalayarak daha aşağıya ekliyoruz
        doc.text(` ${examName} Sınav Soruları`, 105, 30, { align: "center" }); // Y pozisyonunu 60 yaparak başlığı daha aşağıya yerleştiriyoruz


        let currentY = 50;
        const pageHeight = doc.internal.pageSize.height;

        const marginLeft = 10;
        const marginRight = 10;
        const maxWidth = doc.internal.pageSize.width - marginLeft - marginRight; // Sayfa genişliği

        const examQuestions = []; // Array to store exam questions
        cartItems.forEach((item, index) => {
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);

            // Soruları eklerken, satıra sığmadığında yeni sayfaya geçmesini sağlamak
            const itemText = `${index + 1}. ${item.text}`;
            if (currentY + 10 > pageHeight - 20) {
                doc.addPage();
                currentY = 20; // Yeni sayfada yazının başladığı yer
            }

            // Metni sığdırmak için doc.text'in genişliğini kontrol edin
            doc.text(itemText, marginLeft, currentY, { maxWidth: maxWidth });
            currentY += 10;

            // Store the question in examQuestions array
            examQuestions.push({
                question_id: item.id,
                exam_id: 0, // You can update this when creating the exam in the database
                created_at: new Date().toISOString()
            });

            if (item.options && Array.isArray(item.options) && item.options.some(opt => opt !== undefined)) {
                item.options.forEach((option, optionIndex) => {
                    if (option !== undefined) {
                        const optionText = `${String.fromCharCode(65 + optionIndex)}. ${option}`;
                        if (currentY + 8 > pageHeight - 20) {
                            doc.addPage();
                            currentY = 20;
                        }
                        doc.text(optionText, marginLeft + 10, currentY, { maxWidth: maxWidth - 10 }); // Option'ları sığdırıyoruz
                        currentY += 8;
                    }
                });
            } else {
                const noOptionText = '';
                if (currentY + 8 > pageHeight - 20) {
                    doc.addPage();
                    currentY = 20;
                }
                doc.setFontSize(12);
                doc.setTextColor(150, 150, 150);
                doc.text(noOptionText, marginLeft, currentY, { maxWidth: maxWidth });
                currentY += 10;
            }
            currentY += 10;
        });

        // Save the PDF document
        doc.save("sinav_sorulari.pdf");

        // Get user_id from localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        const user_id = user ? user.id : null; // Ensure user is available

        if (user_id) {
            // Create the exam data object
            const examData = {
                exam: {
                    id: 0, // This will be assigned later by the database
                    user_id: user_id, // Use the logged-in user's ID
                    name: examName, // Kullanıcının girdiği sınav adı
                    pdf_url: "path/to/pdf", // You can provide the URL or path where the PDF is saved
                    created_at: new Date().toISOString()
                },
                examQuestions: examQuestions
            };

            console.log('Sending exam data:', examData);  // Log the data
            setExamName('');  // Modal içini temizle
            setOpenModal(false); // Close the modal on success
            axios.post('http://localhost:5000/api/Exam', examData)
                .then(response => {
                    console.log('Exam saved successfully:', response.data);
                })
                .catch(error => {
                    console.error('There was an error saving the exam:', error.response?.data || error.message);
                });

        } else {
            console.error("User is not logged in.");
        }
    };

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const handleExamNameChange = (event) => setExamName(event.target.value);

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <div style={{ width: 350, padding: 20 }}>
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

                <Button
                    variant="contained"
                    sx={{ backgroundColor: "#94a4fa", color: "black", width: '100%', marginTop: '20px' }}
                    onClick={handleOpenModal}  // Modal'ı aç
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
