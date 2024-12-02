import jsPDF from 'jspdf';
import DejaVuSans from '../assets/Fonts/DejaVuSans.ttf';
import { uploadPdf } from '../services/api.jsx'; // API'deki dosya yükleme fonksiyonunu içe aktar

// PDF oluşturma fonksiyonu
export const generatePdf = (examName, cartItems) => {
    const doc = new jsPDF();
    doc.addFont(DejaVuSans, 'DejaVu', 'normal');
    doc.setFont('DejaVu');
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text(`Ad Soyad: `, 50, 10, { align: "right" });
    doc.text(`Numara: `, 120, 10, { align: "left" });
    doc.text(`${examName} Sınav Soruları`, 105, 30, { align: "center" });

    let currentY = 50;
    const pageHeight = doc.internal.pageSize.height;
    const marginLeft = 10;
    const marginRight = 10;
    const maxWidth = doc.internal.pageSize.width - marginLeft - marginRight;

    const examQuestions = [];
    cartItems.forEach((item, index) => {
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
            question_id: item.id,
            exam_id: 0,
            created_at: new Date().toISOString(),
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
        }
        currentY += 10;
    });

    return { doc, examQuestions };
};

// PDF dosyasını yüklemek için bir fonksiyon
export const uploadExamPdf = async (pdfBlob, examData) => {
    try {
        const fileUrl = await uploadPdf(pdfBlob);
        examData.exam.pdf_url = fileUrl;
        return fileUrl;
    } catch (error) {
        console.error("PDF yükleme hatası:", error.message);
        throw error;
    }
};
