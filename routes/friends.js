const express = require('express');
const router = express.Router();
const friendsController= require('../controllers/friendship_controller');

router.get('/add/:id', friendsController.add);

module.exports = router;