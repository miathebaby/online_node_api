const Guest = require('../models/guest');

exports.index = async (req, res, next) => {
    const guests = await Guest.find();
    res.status(200).json({ data: guests });
};

exports.update = async (req, res, next) => {
    try {
        const { name, count, isComing } = req.body;
        const guest = await Guest.findByIdAndUpdate(
            req.params.id,
            { name, count, isComing },
            { new: true }
        );
        if (!guest) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
        res.status(200).json({ message: 'อัปเดตสำเร็จ', data: guest });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
};

exports.insert = async (req, res, next) => {
    try {
        const { name, count, isComing } = req.body;
        const guest = new Guest({ name, count, isComing });
        const saved = await guest.save();
        res.status(201).json({ message: 'เพิ่มข้อมูลสำเร็จ', data: saved });
    } catch (error) {
        console.error('Error saving guest:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
};