const express= require('express');
const router = express.Router();

const {checkAvailability}=require('../controller/bookingController');

router.get('/check-availability',checkAvailability);

module.exports = router;