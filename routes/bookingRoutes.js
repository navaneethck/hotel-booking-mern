const express= require('express');
const router = express.Router();

const {checkAvailability}=require('../controller/checkAvailabilityController');
const {createBooking}=require('../controller/bookingController');

router.get('/check-availability',checkAvailability);
router.post('/Booking',createBooking);

module.exports = router;