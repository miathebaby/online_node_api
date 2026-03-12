const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = Schema({
    name: String,
    photo: { type: String, default: 'nopic.png' },
    location: {
        lat: { type: Number },
        lgn: { type: Number }, 
    },
}, {
    toJSON: { virtuals: true }, //แปลงเป็น JSON ก่อนส่งกลับ ไม่งั้น virtual ไม่ออก
    toObject: { virtuals: true },
    timestamps: true,
    collection: 'shops'
});

//เราสร้าง field นี้ ทำให้เรียก field menus ใน ShopController ได้
blogSchema.virtual('menus', {
    ref: 'Menu', //ลิ้งไปที่ Model Menu
    localField: '_id',//id ฟิลด์ของโมเดล Shops ไฟล์นี้
    foreignField: 'shop',//id ฟิลด์ของโมเดล Menu ไฟล์นี้ มันก็คือ FK
});

// mongoose.model('company', blogSchema, 'company') :: company อันสุดท้ายคือชื่อตารางในฐานข้อมูล
const shops = mongoose.model('shops', blogSchema, 'shops');
module.exports = shops;