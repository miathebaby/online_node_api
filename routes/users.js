var express = require('express');
const { body } = require('express-validator');
var router = express.Router();
const userController = require('../controllers/userController');
const passportJWT = require('../middleware/passportJWT');

/* GET users listing. */
router.get('/', userController.index);

router.post('/login', userController.login);
// router.post('/login', [
//     body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
//     body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
// ], userController.login);

router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], userController.register);

router.get('/me', [passportJWT.isLoging], userController.me);

module.exports = router;
