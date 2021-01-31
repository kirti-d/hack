const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('router loaded');


router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/likes', require('./likes'));
router.use('/block', require('./block'));
router.use('/search', require('../controllers/search_controller').search);
router.use('/mail', require('../controllers/mail_controller').sendMail);
router.use('/places',require('../controllers/places_controller').getPlaces);
router.post('/addToilet',require('../controllers/places_controller').addToilet);
router.use('/friends', require('./friends'));

// send text msgs using trilio
router.post('/send-sms', (req, res) => {
    const { to, body } = req.body;
    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    client.messages
        .create({
            body,
            from: process.env.TWILIO_PHONE_NUMBER,
            to
        })
        .then(message => {
            return res.json({
                body: message.sid
            })
        }).catch(err => {
            return res.json({
                body: err
            })
        })

});

// for any further routes, access from here
// router.use('/routerName', require('./routerfile));


module.exports = router;