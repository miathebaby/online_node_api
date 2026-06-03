var express = require('express');
var router = express.Router();
const guestController = require('../controllers/guestController');

/* GET users listing. */
router.get('/', guestController.index);
router.post('/', guestController.insert);
router.put('/:id', guestController.update);

module.exports = router;