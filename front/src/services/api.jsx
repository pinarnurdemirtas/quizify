import axios from 'axios';
const URL = "http://localhost:5000/api";


//Login API çağrısı
export const loginUser = async (payload) => {
    const loginUrl = `${URL}/Users/login`; 
    try {
        const response = await axios.post(loginUrl, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Login error:", error.message);
        throw error;
    }
};

//Register API çağrısı
export const registerUser = async (payload) => {
    const registerUrl = `${URL}/Register/Register`;
    try {
        const response = await axios.post(registerUrl, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

//Hesap silme API çağrısı
export const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`${URL}/Register/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

//Hesap düzenleme API çağrısı
export const updateUser = async (id, updatedUser) => {
    try {
        const response = await axios.put(`${URL}/Users/${id}`, updatedUser);
        return response.data
    } catch (error) {
        console.error("Error response:", error.response);  // Hata cevabını yazdır
        throw error.response ? error.response.data : error.message;
    }
};


// Soruları almak için API çağrısı
export const fetchQuestionsByCategory = async (categoryId) => {
    try {
        const response = await fetch(`${URL}/Questions?category=${categoryId}`);
        if (!response.ok) throw new Error('Failed to fetch questions');
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Soru eklemek için API çağrısı
export const addQuestion = async (questionData) => {
    const response = await fetch(`${URL}/Questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionData),
    });
    if (!response.ok) {
        throw new Error('Soru eklenemedi!');
    }
    return await response.json();
};


// Test soruları için ayrı API çağrısı
export const fetchTestQuestionsByCategory = async (categoryId) => {
    try {
        const response = await fetch(`${URL}/TestQuestions/category/${categoryId}`);
        if (!response.ok) throw new Error('Failed to fetch test questions');
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Test Sorusu eklemek için API çağrısı
export const addTestQuestion = async (testQuestionData) => {
    try {
        const response = await fetch(`${URL}/TestQuestions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testQuestionData),
        });
        if (!response.ok) {
            throw new Error('Test sorusu eklenirken bir hata oluştu.');
        }
        return await response.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
};



// PDF'yi sunucuya yüklemek için API çağrısı
export const uploadPdf = async (pdfBlob) => {
    const formData = new FormData();
    formData.append('file', pdfBlob, 'sinav_sorulari.pdf');

    try {
        const uploadResponse = await axios.post(`${URL}/Exam/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return uploadResponse.data.url;
    } catch (error) {
        throw new Error('There was an error uploading the PDF: ' + (error.response?.data || error.message));
    }
};

// Sınav verisini kaydetmek için API çağrısı
export const saveExam = async (examData) => {
    try {
        const token = localStorage.getItem('token'); // Token'ı localStorage'dan al
        await axios.post(`${URL}/Exam`, examData, {
            headers: {
                Authorization: `Bearer ${token}`, // Token'ı başlığa ekle
            }
        });
        console.log('Exam saved successfully!');
    } catch (error) {
        throw new Error('There was an error saving the exam: ' + (error.response?.data || error.message));
    }
};


// Kategorileri almak için API çağrısı
export const fetchCategories = async () => {
    try {
        const response = await fetch(`${URL}/Categories`);
        if (!response.ok) {
            throw new Error('Error fetching categories');
        }
        const data = await response.json();
        return data;
    } catch (err) {
        throw new Error(err.message || 'Unknown error');
    }
};



// Sınavları almak için API çağrısı
export const fetchExams = async (userId, token) => {
    try {
        const token = localStorage.getItem('token'); // Token'ı localStorage'dan al
        const response = await axios.get(`${URL}/Exam/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Token'ı başlığa ekliyoruz
            }
        });
        return response.data;
    } catch (error) {
        throw new Error("Error fetching exams: " + error.message);
    }
};



// Sınav silmek için API çağrısı
export const deleteExam = async (examId) => {
    try {
        const token = localStorage.getItem('token'); // Token'ı localStorage'dan al
        await axios.delete(`${URL}/Exam/${examId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Token'ı başlığa ekliyoruz
            }
        })
    } catch (error) {
        console.error("Error deleting exam:", error); // Tüm hata detaylarını göster
        throw new Error("Error deleting exam: " + error.message);
    }
};
