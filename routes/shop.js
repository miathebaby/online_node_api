var express = require('express');
var router = express.Router();
const shopController = require('../controllers/shopController');

/* GET users listing. */
router.get('/', shopController.index);

// http://localhost:3000/shop/menu
router.get('/menu', shopController.menu);

// http://localhost:3000/shop/:id
router.get('/:id', shopController.getShopWithMenu);

router.post('/', shopController.insertWithDefaultPhoto);

module.exports = router;

