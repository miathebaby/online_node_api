//model คือ การสร้าง schema สำหรับฐานข้อมูล MongoDB และเป็นส่วนของ business logic
const mongoose = require('mongoose'); //mongoose คือ library สำหรับเชื่อมต่อกับ MongoDB
// const { Schema } = mongoose;
const bcrypt = require('bcryptjs'); //bcrypt คือ library สำหรับเข้ารหัส password
const saltRounds = 10; //saltRounds คือ จำนวนรอบของการเข้ารหัส password

const blogSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, index: true }, //index คือ การสร้าง index สำหรับค้นหา ทำให้การค้นหาเร็วขึ้น
    password: { type: String, required: true, trim: true, minlength: 3 }, //minlength คือ การกำหนดความยาวของรหัสผ่าน
    role: { type: String, default: 'member' },
});

//สร้าง method สำหรับเข้ารหัส password
blogSchema.methods.encryptPassword = async function (password) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword; //ฟังก์ชันนี้ใช้เพื่อเข้ารหัส password
};

blogSchema.methods.checkPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const user = mongoose.model('user', blogSchema, 'users');

module.exports = user;