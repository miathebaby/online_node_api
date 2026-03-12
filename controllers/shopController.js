const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid');
const { promisify } = require('util') //เปลี่ยนการเขียนไฟล์เป็น async
const writeFileAsync = promisify(fs.writeFile) // ไว้สำหรับเขียนไฟล์เป็น async
const { Storage } = require('@google-cloud/storage');
const stream = require('stream'); // ไว้สำหรับจัดการ stream ของรูปภาพ ไปไว้ที่ Google Cloud Storage

const config = require('../config/index');

const Shop = require('../models/shops');
const Menu = require('../models/menu');

exports.index = async (req, res, next) => {
    const shop = await Shop.find().select('name photo location').sort({ _id: -1 });

    const shopWithPhotoDomain = await shop.map((shop, index) => {
        return {
            id: index + 1,
            name: shop.name,
            // photo: config.DOMAIN + '/images/' + shop.photo,
            photo: config.DOMAIN_GOOGLE_STORAGE + shop.photo,
            location: shop.location,
        }
    });
    res.status(200).json({ data: shopWithPhotoDomain });
};


//Get menu
exports.menu = async (req, res, next) => {
    // const menus = await Menu.find()
    //     .populate('shop', 'name photo location')
    //     .sort({ _id: -1 });

    // ค้นหา menu ที่ราคามากกว่าเท่ากับ 100
    // const menus = await Menu.find().where('price').gte(100).sort({ _id: -1 });

    // const menus = await Menu.find().select('name price price_vat shop').sort({ _id: -1 });

    const menus = await Menu.find().populate('shop', 'name photo location -_id').sort({ _id: -1 }); //populate คือ ดึงข้อมูลจากตาราง shop มาใส่ในตาราง menu



    res.status(200).json({ data: menus });
};

exports.getShopWithMenu = async (req, res, next) => {
    const { id } = req.params;
    const shop = await Shop.findById(id)
        .populate({
            path: 'menus',
        });

    if (!shop) {
        return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    }

    res.status(200).json({ data: shop });
};

exports.insert = async (req, res, next) => {
    try {
        // const staff = new Staff(req.body);
        const { name, location, photo } = req.body;
        let shop = new Shop({
            name: name,
            location: location,
            // photo: await saveImageToDisk(photo)
            photo: await saveImageToGoogle(photo)
        });
        const saved = await shop.save();
        res.status(201).json({ message: 'เพิ่มข้อมูลสำเร็จ', data: saved });
    } catch (error) {
        console.error('Error saving staff:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
};

exports.insertWithDefaultPhoto = async (req, res, next) => {
    try {
        const { name, location, photo } = req.body;

        let shopData = { name, location };

        if (photo && photo.startsWith('data:') && photo.includes(';base64,')) {
            shopData.photo = await saveImageToGoogle(photo);
        }
        // ถ้าไม่มี photo หรือไม่ใช่ base64 จะไม่ใส่ shopData.photo เลย
        // Mongoose จะใช้ default: 'nopic.png' จาก schema

        let shop = new Shop(shopData);
        const saved = await shop.save();
        res.status(201).json({ message: 'เพิ่มข้อมูลสำเร็จ', data: saved });
    } catch (error) {
        console.error('Error saving staff:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
};

async function saveImageToGoogle(baseImage) {
    //หา path จริงของโปรเจค
    const projectPath = path.resolve('./');

    //หานามสกุลไฟล์
    const ext = baseImage.substring(baseImage.indexOf("/") + 1, baseImage.indexOf(";base64"));

    //สุ่มชื่อไฟล์ใหม่ พร้อมนามสกุล
    let filename = '';
    if (ext === 'svg+xml') {
        filename = `${uuidv4.v4()}.svg`;
    } else {
        filename = `${uuidv4.v4()}.${ext}`;
    }

    //Extract base64 data ออกมา
    let image = decodeBase64Image(baseImage);

    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(image.data, 'base64'));

    // Creates a client and upload to storage
    const storage = new Storage({
        projectId: 'online-node-api-487803',
        keyFilename: `${projectPath}/google_key.json`
    });

    const myBucket = storage.bucket('node_api_course');
    const file = myBucket.file(filename);
    const writeStream = file.createWriteStream({
        gzip: true,
        contentType: image.type,
        metadata: {
            cacheControl: 'public, max-age=31536000',
        },
        // ลบ public: true เพราะ bucket มี Public Access Prevention บังคับ
        validation: false,
    });

    return new Promise((resolve, reject) => {
        writeStream.on('error', (err) => {
            console.error('GCS upload error:', err);
            reject(err);
        });
        writeStream.on('finish', () => {
            console.log('upload successfully...');
            resolve(filename);
        });
        bufferStream.pipe(writeStream);
    });
}


async function saveImageToDisk(baseImage) {
    //หา path จริงของโปรเจค
    const projectPath = path.resolve('./');
    //โฟลเดอร์และ path ของการอัปโหลด
    const uploadPath = `${projectPath}/public/images/`;

    //หานามสกุลไฟล์
    const ext = baseImage.substring(baseImage.indexOf("/") + 1, baseImage.indexOf(";base64"));

    //สุ่มชื่อไฟล์ใหม่ พร้อมนามสกุล
    let filename = '';
    if (ext === 'svg+xml') {
        filename = `${uuidv4.v4()}.svg`;
    } else {
        filename = `${uuidv4.v4()}.${ext}`;
    }

    //Extract base64 data ออกมา
    let image = decodeBase64Image(baseImage);

    //เขียนไฟล์ไปไว้ที่ path
    await writeFileAsync(uploadPath + filename, image.data, 'base64');
    //return ชื่อไฟล์ใหม่ออกไป
    return filename;
}

function decodeBase64Image(base64Str) {
    let matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let image = {};
    if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 string');
    }

    image.type = matches[1];//content type
    image.data = matches[2];//base64 data คือ ข้อมูลของรูปภาพ

    return image;
}