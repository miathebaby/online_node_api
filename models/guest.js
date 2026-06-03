const mongoose = require('mongoose');
// const { Schema } = mongoose;

const guestSchema = new mongoose.Schema({
    name: String,
    count: Number,
    isComing: Boolean
});

// mongoose.model('guests', guestSchema, 'guests') :: guests อันสุดท้ายคือชื่อตารางในฐานข้อมูล
const guest = mongoose.model('guests', guestSchema, 'guests');
module.exports = guest;