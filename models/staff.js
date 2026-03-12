const mongoose = require('mongoose');
// const { Schema } = mongoose;

const blogSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    salary: { type: Number },
    created: { type: Date, default: Date.now },
});

// mongoose.model('company', blogSchema, 'company') :: company อันสุดท้ายคือชื่อตารางในฐานข้อมูล
const staff = mongoose.model('staff', blogSchema, 'staffs');
module.exports = staff;