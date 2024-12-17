import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Checkbox, FormControlLabel, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const AttendanceForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [patronymic, setPatronymic] = useState('');
    const [group, setGroup] = useState('');
    const [present, setPresent] = useState(false);
    const [date, setDate] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [sortBy, setSortBy] = useState('group');

    const fetchAttendanceRecords = async () => {
        const response = await axios.get(`http://localhost:5000/api/attendance?sortBy=${sortBy}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        setAttendanceRecords(response.data);
    };

    useEffect(() => {
        fetchAttendanceRecords();
    }, [sortBy]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Пожалуйста, войдите в систему');
            return;
        }

        try {
            if (!date || !group || !firstName || !lastName || !patronymic) {
                alert('Пожалуйста, заполните все поля');
                return;
            }

            const dateParts = date.split('.');
            if (dateParts.length !== 3) {
                alert('Неверный формат даты. Используйте DD.MM.YYYY');
                return;
            }

            const formattedDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
            if (isNaN(formattedDate)) {
                alert('Неверная дата');
                return;
            }

            if (isEditing) {
                const response = await axios.put(`http://localhost:5000/api/attendance/${currentId}`, { firstName, lastName, patronymic, group, present, date: formattedDate.toISOString() }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const updatedRecords = attendanceRecords.map(record => (record._id === currentId ? response.data : record));
                setAttendanceRecords(updatedRecords);
                setIsEditing(false);
            } else {
                const response = await axios.post('http://localhost:5000/api/attendance', { firstName, lastName, patronymic, group, present, date: formattedDate.toISOString() }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAttendanceRecords([...attendanceRecords, response.data]); // Исправлено здесь
            }

            setFirstName('');
            setLastName('');
            setPatronymic('');
            setGroup('');
            setPresent(false);
            setDate('');
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
            alert('Ошибка при отправке данных');
        }
    };

    const handleEdit = (record) => {
        setFirstName(record.firstName);
        setLastName(record.lastName);
        setPatronymic(record.patronymic);
        setGroup(record.group);
        setPresent(record.present);
        const dateObj = new Date(record.date);
        const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${dateObj.getFullYear()}`;
        setDate(formattedDate);
        setIsEditing(true);
        setCurrentId(record._id);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) return alert('Пожалуйста, войдите в систему');

        try {
            await axios.delete(`http://localhost:5000/api/attendance/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAttendanceRecords(attendanceRecords.filter(record => record._id !== id));
        } catch (error) {
            console.error('Ошибка при удалении записи:', error);
            alert('Ошибка при удалении записи');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4">Форма посещаемости</Typography>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TextField
                    label="Имя"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    style={{ marginBottom: '10px', width: '300px' }}
                />
                <TextField
                    label="Фамилия"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    style={{ marginBottom: '10px', width: '300px' }}
                />
                <TextField
                    label="Отчество"
                    value={patronymic}
                    onChange={(e) => setPatronymic(e.target.value)}
                    required
                    style={{ marginBottom: '10px', width: '300px' }}
                />
                <TextField
                    label="Группа"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    required
                    style={{ marginBottom: '10px', width: '300px' }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={present}
                            onChange={(e) => setPresent(e.target.checked)}
                        />
                    }
                    label="Присутствует"
                />
                <TextField
                    label="Дата (DD.MM.YYYY)"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    style={{ marginBottom: '10px', width: '300px' }}
                />
                <Button type="submit" variant="contained" style={{ marginTop: '10px' }}>
                    {isEditing ? 'Обновить' : 'Добавить'}
                </Button>
            </form>

            <TableContainer component={Paper} style={{ marginTop: '20px', width: '80%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Имя</TableCell>
                            <TableCell>Фамилия</TableCell>
                            <TableCell>Отчество</TableCell>
                            <TableCell>Группа</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Дата</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attendanceRecords.map(record => (
                            <TableRow key={record._id}>
                                <TableCell>{record.firstName}</TableCell>
                                <TableCell>{record.lastName}</TableCell>
                                <TableCell>{record.patronymic}</TableCell>
                                <TableCell>{record.group}</TableCell>
                                <TableCell>{record.present ? 'Присутствует' : 'Отсутствует'}</TableCell>
                                <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(record)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(record._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default AttendanceForm;