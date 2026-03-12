const Staff = require('../models/staff');

//อยากรู้ว่า Table นี้มีข้อมูลอะไรบ้าง
//หรือเรียกผ่าน http://localhost:3000/staff?id=695e1f2f4f640def6f3a0fb9 โดยหาตาม id
exports.index = async (req, res, next) => {
    const { id } = req.query;

    // Support query param ?id=<...> while keeping existing list behavior
    if (id) {
        const staff = await Staff.findById(id);
        if (!staff) {
            return res.status(404).json({ message: 'ไม่พบข้อมูล' });
        }
        return res.status(200).json({ data: staff });
    }

    // -1 คือ เรียงจากมากไปน้อย
    const staffList = await Staff.find().sort({ _id: -1 });
    res.status(200).json({ data: staffList });
};

//อยากรู้ว่า id นี้เป็นใคร
//เรียกผ่าน http://localhost:3000/staff/695e1f2f4f640def6f3a0fb9
exports.show = async (req, res, next) => {
    try {
        const { id } = req.params;
        const staff = await Staff.findById(id);
        if (!staff) {
            throw new Error('ไม่พบข้อมูลพนักงาน');
        }
        res.status(200).json({ data: staff });
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: `รหัสไม่ถูกต้อง: ${error.message}` });
    }
};

exports.destroy = async (req, res, next) => {
    try {
        const { id } = req.params;
        const staff = await Staff.deleteOne({ _id: id });
        if (staff.deletedCount === 0) {
            throw new Error('ไม่พบข้อมูลพนักงานนี้ ไม่สามารถลบได้');
        } else {
            res.status(200).json({
                message: 'ลบข้อมูลสำเร็จ'
            });
        }

    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: `รหัสไม่ถูกต้อง: ${error.message}` });
    }
};


exports.insert = async (req, res, next) => {
    try {
        // const staff = new Staff(req.body);
        const { name, salary } = req.body;
        let data = new Staff({ name: name, salary: salary + 10, },);
        const saved = await data.save();
        console.log('Saved staff:', saved);
        res.status(201).json({ message: 'เพิ่มข้อมูลสำเร็จ', data: saved });
    } catch (error) {
        console.error('Error saving staff:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
};


exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, salary } = req.body;
        //วิธีที่ 1
        // const staff = await Staff.findById(id);
        // staff.name = name;
        // staff.salary = salary;
        // await staff.save();

        //วิธีที่ 2
        // const staff = await Staff.findByIdAndUpdate(id, {
        //     name: name,
        //     salary: salary
        // });

        const staff = await Staff.updateOne({ _id: id }, {
            name: name,
            salary: salary
        });

        if (staff.modifiedCount === 0) {
            throw new Error('ไม่พบข้อมูลพนักงานนี้ ไม่สามารถแก้ไขได้');
        } else {
            res.status(200).json({
                message: 'แก้ไขข้อมูลสำเร็จ'
            });
        }

        // console.log('Updated staff:', staff);

        res.status(200).json({
            message: 'แก้ไขข้อมูลสำเร็จ'
        });

    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: `รหัสไม่ถูกต้อง: ${error.message}` });
    }
};