import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, uploadPdf } from "../services/api.jsx";
import "./Css/Register.css";

const Register = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [pdfFile, setPdfFile] = useState(null);
    const [department, setDepartment] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!gender) {
            setError("Lütfen cinsiyetinizi seçin.");
            return;
        }

        // PDF dosyasını yükle
        let document = null;
        if (pdfFile) {
            if (pdfFile.type !== "application/pdf") {
                setError("Lütfen geçerli bir PDF dosyası yükleyin.");
                return;
            }
            try {
                document = await uploadPdf(pdfFile); // PDF yükle ve URL al
            } catch (error) {
                console.error('Error uploading PDF:', error);
                alert("PDF yükleme sırasında hata oluştu.");
                return;
            }
        }

        const img =
            gender === "male"
                ? "https://api.dicebear.com/8.x/adventurer/svg?seed=Cuddles&flip=true"
                : gender === "female"
                    ? "https://api.dicebear.com/8.x/adventurer/svg?seed=Cookie&flip=true"
                    : "";

        const payload = {
            name,
            surname,
            email,
            username,
            password,
            phone,
            gender,
            img,
            department,
            document,
            isVerified: true,
        };

        if (!pdfFile) {
            setError("Lütfen öğretmenlik belgenizi PDF formatında yükleyin.");
            return;
        }

        try {
            const response = await registerUser(payload); // Kullanıcıyı kaydet
            console.log('Registration successful:', response);
            alert("Hesabınız doğrulandığında mail alacaksınız.");
            navigate("/");
        } catch (error) {
            console.error('Registration failed:', error.response.data);
            setError(error.response.data);
        }
    };

    return (
        <div className="register-card">
            <div className="register-form">
                <h1 className="register-title">Kayıt Ekranı</h1>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleRegister}>
                    <div className="input-pair">
                        <label className={username ? "active-label" : ""}>Kullanıcı Adı</label>
                        <input
                            type="text"
                            placeholder="Kullanıcı Adı"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-field"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Şifre"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="input-pair">
                        <input
                            type="email"
                            placeholder="E-posta"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Bölüm"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="input-pair">
                        <input
                            type="text"
                            placeholder="İsim"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Soyisim"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>
                    <div className="input-pair">
                        <input
                            type="tel"
                            placeholder="Telefon"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="input-field"
                            required
                        />
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="input-field"
                            required
                        >
                            <option value="">Cinsiyet</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="input-pair" style={{ paddingLeft: 12 }}>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setPdfFile(e.target.files[0])}
                            className="input-field"
                        />
                        <p>Lütfen öğretmenlik belgenizi PDF formatında yükleyin.</p>
                    </div>
                    <button
                        type="submit"
                        className="register-button"
                    >
                        Kayıt Ol
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
