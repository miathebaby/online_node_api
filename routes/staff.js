var express = require('express');
var router = express.Router();
const staffController = require('../controllers/staffController');
// const passportJWT = require('../middleware/passportJWT');

/* GET users listing. */
router.get('/',  staffController.index);

// Get by id http://localhost:3000/staff/id
// อยากรู้ว่า id นี้เป็นใคร
router.get('/:id', staffController.show);

// Post data
router.post('/', staffController.insert);

//delete by id http://localhost:3000/staff/id
router.delete('/:id', staffController.destroy);

//update by id http://localhost:3000/staff/id ด้วย body { name: 'สมชาย', salary: 10000 }
router.put('/:id', staffController.update);

module.exports = router;