const User = require('../models/user');
const { validationResult } = require('express-validator');//ไว้รับข้อมูลจาก error เมื่อเข้าเงื่อนไขจาก route/users.js
const jwt = require('jsonwebtoken');
const config = require('../config/index');

exports.index = (req, res, next) => {
    res.status(200).json({ message: 'Users List' });
};

exports.login = async (req, res, next) => {

    try {
        const { email, password } = req.body;

        //check email exist
        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error('Email or password is incorrect');
            error.statusCode = 404;
            throw error;
        }

        //validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('ข้อมูลที่กรอกไม่ถูกต้อง');
            error.statusCode = 422;
            error.validation = errors.array();
            throw error;
        }

        //check password
        const isMatch = await user.checkPassword(password);
        if (!isMatch) {
            const error = new Error('Email or password is incorrect');
            error.statusCode = 401;
            throw error;
        }

        const payload = {
            id: user._id,
            role: user.role
        }

        const token = await jwt.sign(payload, config.JWT_SECRET, { expiresIn: '5 days' });

        const expiresIn = jwt.decode(token).exp;

        res.status(200).json({
            message: 'Login Success',
            access_token: token,
            expires_in: expiresIn,
            token_type: 'Bearer',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        return next(error);
    }




};

exports.register = async (req, res, next) => {
    try {
        //destructuring คือ การดึงข้อมูลจาก req.body ออกมาเป็นตัวแปร
        const { name, email, password } = req.body;

        //validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('ข้อมูลที่กรอกไม่ถูกต้อง');
            error.statusCode = 422;
            error.validation = errors.array();
            throw error;
        }

        //เช็คอีเมลซ้ำ
        const emailExist = await User.findOne({ email });
        if (emailExist) {
            const error = new Error('Email already exists');
            error.statusCode = 400;
            throw error;
        }

        const user = new User({ name, email });
        user.password = await user.encryptPassword(password);
        //เข้ารหัส password เราจะเอา business logic ไว้ใน model
        await user.save(); //บันทึกข้อมูลลงในฐานข้อมูล MongoDB
        res.status(201).json({
            message: 'Register Success',
        });

    } catch (error) {
        return next(error);
    }
};

exports.me = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return next(error);
    }
};