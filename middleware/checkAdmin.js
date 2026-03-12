module.exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้ เฉพาะผู้ดูแลระบบเท่านั้น' });
    }
    next();
};