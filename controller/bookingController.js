const Booking =  require('../models/bookingModel');
const {checkRoomAvailability } = require('../controller/checkAvailabilityController');


const createBooking = async(req,res)=>{
    try{

     const {  hotelId,
      checkInDate,
      checkOutDate,
      roomType,
      numberOfRooms,
      guests,
      specialRequests} = req.body;

      const result = await checkRoomAvailability ({hotelId, checkInDate, checkOutDate, roomType, numberOfRooms});

      if(!result.success){

        return res.status(400).json({success:false,message:result.message});
      }

      const { roomTypeData, totalNights} = result;

      const newBooking = new Booking({

        user:"685a51604df158309afbe600",
        hotel: hotelId,
        roomType,
        numberOfRooms,
        checkInDate,
        checkOutDate,
        status: 'pending',
        totalAmount: roomTypeData.price * numberOfRooms * totalNights,
        guests,
        specialRequests,

      })

      await newBooking.save();

      await newBooking.populate('user', 'name email');
      await newBooking.populate('hotel', 'name location');


      res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      newBooking
    });
      
    }catch(error){

      res.status(500).json({
      success: false,
      message: error.message
    });

    }
}

module.exports = { createBooking };