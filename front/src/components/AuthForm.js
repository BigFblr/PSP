import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true); // true для входа, false для регистрации
    const navigate = useNavigate(); // Хук для навигации

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/register', { username, password });
            alert('Пользователь зарегистрирован');
            setIsLogin(true); // Переключаемся на форму входа
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            alert('Ошибка регистрации');
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            localStorage.setItem('token', response.data.token); // Сохраняем токен
            alert('Вход выполнен');
            navigate('/attendance'); // Перенаправляем на страницу посещаемости
        } catch (error) {
            console.error('Ошибка входа:', error);
            alert('Ошибка входа');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            handleLogin();
        } else {
            handleRegister();
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>{isLogin ? 'Вход' : 'Регистрация'}</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Имя пользователя"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Пароль"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary">
                    {isLogin ? 'Войти' : 'Зарегистрироваться'}
                </Button>
                <Button onClick={() => setIsLogin(!isLogin)} color="secondary">
                    {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
                </Button>
            </form>
        </div>
    );
};

export default AuthForm;