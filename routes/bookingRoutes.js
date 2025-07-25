const express= require('express');
const router = express.Router();

const {checkAvailability}=require('../controller/checkAvailabilityController');
const {createBooking}=require('../controller/bookingController');
const{getUserBooking}=require('../controller/getUserBooking');

router.get('/check-availability',checkAvailability);
router.post('/Booking',createBooking);
router.get('/Show-All-Bookings',getUserBooking)

module.exports = router;