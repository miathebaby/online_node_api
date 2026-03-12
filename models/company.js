const mongoose = require('mongoose');
// const { Schema } = mongoose;

const blogSchema = new mongoose.Schema({
    name: String,
    address: {
        province: { type: String }
    },
});

// mongoose.model('company', blogSchema, 'company') :: company อันสุดท้ายคือชื่อตารางในฐานข้อมูล
const company = mongoose.model('company', blogSchema, 'company');
module.exports = company;