import jsPDF from 'jspdf';
import DejaVuSans from '../assets/Fonts/DejaVuSans.ttf';
import { uploadPdf } from '../services/api.jsx'; // API'deki dosya yükleme fonksiyonunu içe aktar

export const generateAnswerKeyPdf = (questions) => {
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

export const generatePdf = (examName, cartItems) => {
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

    const groupByQuestionType = (items) => {
        if (!Array.isArray(items) || items.length === 0) return {};
        return items.reduce((groups, item) => {
            const type = item.questionType || 'Diğer';
            if (!groups[type]) {
                groups[type] = [];
            }
            groups[type].push(item);
            return groups;
        }, {});
    };

    const groupedItems = groupByQuestionType(cartItems || []);

    Object.entries(groupedItems).forEach(([type, items]) => {
        doc.setFontSize(15);
        doc.setTextColor(0, 0, 0); // Yeni renk (mor)
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

            examQuestions.push({
                questionId: item.id,
                examId: 0,
                createdAt: new Date().toISOString(),
            });

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
                // Cevap yazılacak boşluk ekleme
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

// PDF dosyasını yüklemek için bir fonksiyon
export const uploadExamPdf = async (pdfBlob, examData) => {
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
