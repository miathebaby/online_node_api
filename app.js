// require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
// Routes
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const companyRouter = require('./routes/company');
const staffRouter = require('./routes/staff');
const shopRouter = require('./routes/shop');
const guestRouter = require('./routes/guest');

const errorHandler = require('./middleware/errorHandler');

// Config
const config = require('./config/index');


const app = express();

app.use(cors());

//Block rate limit ไม่ให้มีการส่ง request มากกว่า 5 ครั้งต่อ 10 วินาที
app.set('trust proxy', 1);

//จำกัดจำนวน Request ที่ส่งมาจาก IP เดียวกัน
const limiter = rateLimit({
    windowMs: 10 * 1000, // 15 seconds
    limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)

app.use(helmet());//ไว้ป้องกันแฮกเกอร์จากภายนอก

// Connection string ที่ถูกต้อง (มีชื่อ database)
// mongoURI = 'mongodb+srv://apasiri24:Ehav243@cluster0.jjqosbg.mongodb.net/online_node_api';
mongoose.connect(config.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

app.use(logger('dev'));
app.use(express.json({
    limit: '50mb' //เพื่อให้อัพโหลดรูปได้ใหญ่ เนื่องจากปกติจะมี limit ที่ 1mb
}));
app.use(express.urlencoded({ extended: false }));//ไว้อ่านข้อมูลจาก body ของ request
app.use(cookieParser());//ใช้สำหรับจัดฟอร์มได้
app.use(express.static(path.join(__dirname, 'public')));

//init passport
app.use(passport.initialize());//

const passportJWT = require('./middleware/passportJWT');
const checkAdmin = require('./middleware/checkAdmin');

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/company', [passportJWT.isLoging, checkAdmin.isAdmin], companyRouter);
app.use('/staff', [passportJWT.isLoging], staffRouter);
app.use('/shop', shopRouter);
app.use('/guest', guestRouter);
app.use(errorHandler);

module.exports = app;
