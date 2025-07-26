const express = require('express');
const router=express.Router();
const {getAllBookings} = require('../controller/allBooking');

router.get('/All-Bookings',getAllBookings);


module.exports = router;