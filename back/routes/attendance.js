const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret'; // Замените на ваш секретный ключ

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.sendStatus(401); // Если токен отсутствует, возвращаем 401
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Если токен недействителен, возвращаем 403
        req.user = user; // Сохраняем информацию о пользователе в запросе
        next();
    });
};

router.get('/', authenticateToken, async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find().sort({ group: 1, lastName: 1, date: 1 }); // Сортировка по группе, фамилии и дате
        res.json(attendanceRecords);
    } catch (error) {
        res.status(500).send('Ошибка сервера');
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, patronymic, group, present, date } = req.body; // Обновлено для новых полей

    // Проверка на наличие обязательных полей
    if (!firstName || !lastName || !patronymic || !group || typeof present !== 'boolean' || !date) {
        return res.status(400).send('Неверные данные');
    }

    try {
        const updatedRecord = await Attendance.findByIdAndUpdate(id, { firstName, lastName, patronymic, group, present, date }, { new: true });
        if (!updatedRecord) {
            return res.status(404).send('Запись не найдена');
        }
        res.json(updatedRecord);
    } catch (error) {
        console.error('Ошибка при обновлении записи:', error);
        res.status(500).send('Ошибка сервера');
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { firstName, lastName, patronymic, group, present, date } = req.body; // Обновлено для новых полей

    // Проверка на наличие обязательных полей
    if (!firstName || !lastName || !patronymic || !group || typeof present !== 'boolean' || !date) {
        return res.status(400).send('Неверные данные');
    }

    try {
        const newAttendance = new Attendance({ firstName, lastName, patronymic, group, present, date });
        await newAttendance.save();
        res.status(201).json(newAttendance);
    } catch (error) {
        res.status(500).send('Ошибка сервера');
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRecord = await Attendance.findByIdAndDelete(id);
        if (!deletedRecord) {
            return res.status(404).send('Запись не найдена');
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).send('Ошибка сервера');
    }
});

module.exports = router;