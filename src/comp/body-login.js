import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BodyLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();  // Хук для навигации

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = new URLSearchParams({
            grant_type: "password",
            client_id: "string",
            client_secret: "string",
            username: username,
            password: password,
            scope: "",  // Добавляем поле scope
        });

        try {
            const response = await fetch("https://cafe-qr.ru/auth/jwt/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: data.toString(),
            });

            // Обработка статуса 204
            if (response.status === 204) {
                navigate("/profile"); // чуть что удалить
                return;
            }

            // Если ответ не успешный, обработаем ошибку
            if (!response.ok) {
                throw new Error("Неверные учетные данные");
            }

            // Перенаправление на профиль при успешном входе
            navigate("/profile");

        } catch (error) {
            console.error("Ошибка при входе:", error);
            setErrorMessage("Неверный логин или пароль. Пожалуйста, попробуйте снова.");
        }
    };




    return (
        <div className="beautiful-container wow fadeIn" data-wow-delay="0.2s" style={{ fontFamily: "'Nunito', cursive" }}>
            <div className="register-container">
                <h2 className="register-text">Авторизация</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-floating">
                        <input
                            className="register-input form-control"
                            type="text"
                            placeholder="Имя пользователя"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <label htmlFor="username">Почта</label>
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
                    <button className="register-button" type="submit">Войти</button>
                </form>
                <div className="text-log-reg">Ещё нет аккаунта?
                    <Link to="/register" className="nav-item link-log-reg"> Создайте его!</Link>
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
        </div>
    );
};

export default BodyLogin;