const express = require('express');
const router = express.Router();
const blockController= require('../controllers/block_controller');


router.get('/:id', blockController.block);

module.exports = router;