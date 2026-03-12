const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = Schema({
    name: String,
    price: Number,
    shop: { type: Schema.Types.ObjectId, ref: 'shops' },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    collection: 'menus'
});

//เพิ่ม field price_vat ที่ไม่มีในฐานข้อมูล
menuSchema.virtual('price_vat').get(function () {
    return (this.price * 0.07) + this.price;
});

// menu model
const Menu = mongoose.model('Menu', menuSchema, 'menus');
module.exports = Menu;