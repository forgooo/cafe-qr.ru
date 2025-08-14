import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BodyRegister = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate(); // Хук для навигации

    const handleSubmit = (event) => {
        event.preventDefault();

        // Проверка совпадения паролей
        if (password !== confirmPassword) {
            setErrorMessage("Пароли не совпадают");
            return;
        }

        setErrorMessage("");

        // Формирование данных для отправки
        const data = {
            email: email,
            password: password,
            is_active: true,
            is_superuser: false,
            is_verified: false,
            username: username,
            role_id: 0,
        };

        // Отправка POST запроса
        fetch("https://cafe-qr.ru/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Ошибка при регистрации");
                }
                return response.json();
            })
            .then((result) => {
                console.log("Успешно зарегистрировано:", result);
                navigate("/profile"); // Переадресация на страницу профиля
            })
            .catch((error) => {
                console.error("Ошибка при регистрации:", error);
                setErrorMessage("Произошла ошибка при регистрации.");
            });
    };

    return (
        <div className="beautiful-container wow fadeIn" data-wow-delay="0.2s" style={{ fontFamily: "'Nunito', cursive" }}>
            <div className="register-container">
                <h2 className="register-text">Регистрация</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-floating">
                        <input
                            className="register-input form-control"
                            type="email"
                            placeholder="Почта"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="email">Почта</label>
                    </div>
                    <div className="form-floating">
                        <input
                            className="register-input form-control"
                            type="text"
                            placeholder="Имя Пользователя"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <label htmlFor="username">Имя Пользователя</label>
                    </div>
                    <div className="form-floating">
                        <input
                            className="register-input form-control"
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="password">Пароль</label>
                    </div>
                    <div className="form-floating">
                        <input
                            className="register-input form-control"
                            type="password"
                            placeholder="Повторите пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="confirmPassword">Повторите пароль</label>
                    </div>
                    <button className="register-button" type="submit">Зарегистрироваться</button>
                </form>
                <div className="text-log-reg">
                    Уже создали аккаунт?
                    <Link to="/login" className="nav-item link-log-reg"> Войдите в него!</Link>
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
        </div>
    );
};

export default BodyRegister;