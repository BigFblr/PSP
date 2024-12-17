const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    patronymic: { type: String, required: true },
    group: { type: String, required: true },
    present: { type: Boolean, default: false },
    date: { type: Date, required: true }
});

module.exports = mongoose.model('Attendance', attendanceSchema);