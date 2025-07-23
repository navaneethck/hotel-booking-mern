// const Booking = require('../models/bookingModel');
// const Hotel=require('../models/hotelModel');

// const checkAvailability = async (req,res) =>{
//     try{
//         const { hotelId, checkInDate, checkOutDate, roomType, numberOfRooms } = req.query;

//         const checkIn = new Date(checkInDate);
//         const checkOut = new Date(checkOutDate);
//         const today = new Date();

//     if (checkIn < today) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Check-in date cannot be in the past' 
//       });
//     }
    
//     if (checkOut <= checkIn) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Check-out date must be after check-in date' 
//       });
//     }

//     const hotel= await Hotel.findById(hotelId);
//     console.log(hotel)
//         if (!hotel) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Hotel not found' 
//       });
//     }

//     const roomTypeData = hotel.roomTypes.find(rt=>rt.name.toLowerCase()===roomType.toLowerCase());
    
//     if(!roomTypeData){
//         return res.status(404).json({ 
//         success: false, 
//         message: 'Room type not found' 
//       });
//     }

//     //checking for dates overlapping
//     const overlappingBookings = await Booking.find({
//         hotel:hotelId,
//         roomType:roomType,
//         status: { $in: ['pending','confirmed']},
//         checkInDate:{$lt: checkOut},
//         checkOutDate: {$gt: checkIn}
//     })

//     const totalBookedRooms = overlappingBookings.reduce((sum,booking)=>{
//         return sum + booking.numberOfRooms;
//     },0);

//     const availRooms = roomTypeData.totalRooms - totalBookedRooms;
//     const isAvailable = availRooms >=numberOfRooms;
//     const totalNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
//     res.json({
//         success:true,
//         available: isAvailable,
//         availableRooms: availRooms,
//         requestedRooms: numberOfRooms,
//         roomType: roomType,
//         pricePerNight:roomTypeData.price,
//         totalNights: totalNights,
//         estimatedTotal: roomTypeData.price * numberOfRooms *totalNights
//     });

//     }catch(error){
//     res.status(500).json({ 
//       success: false, 
//       message: error.message 
//     });
//     }
// }

// module.exports = {
//     checkAvailability
// }

const Booking = require('../models/bookingModel');
const Hotel = require('../models/hotelModel');

// 👇 Reusable logic function
const checkRoomAvailability = async ({ hotelId, checkInDate, checkOutDate, roomType, numberOfRooms }) => {
  try {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();

    if (checkIn < today) return { success: false, message: 'Check-in date cannot be in the past' };
    if (checkOut <= checkIn) return { success: false, message: 'Check-out must be after check-in' };

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return { success: false, message: 'Hotel not found' };

    const roomTypeData = hotel.roomTypes.find(rt => rt.name.toLowerCase() === roomType.toLowerCase());
    if (!roomTypeData) return { success: false, message: 'Room type not found' };

    const overlappingBookings = await Booking.find({
      hotel: hotelId,
      roomType,
      status: { $in: ['pending', 'confirmed'] },
      checkInDate: { $lt: checkOut },
      checkOutDate: { $gt: checkIn }
    });

    const totalBookedRooms = overlappingBookings.reduce((sum, b) => sum + b.numberOfRooms, 0);
    const availRooms = roomTypeData.totalRooms - totalBookedRooms;
    const isAvailable = availRooms >= numberOfRooms;

    const totalNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (!isAvailable) return { success: false, message: 'Not enough rooms available' };

    return {
      success: true,
      roomTypeData,
      totalNights
    };

  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 👇 Actual route handler
const checkAvailability = async (req, res) => {
  const { hotelId, checkInDate, checkOutDate, roomType, numberOfRooms } = req.query;

  const result = await checkRoomAvailability({ hotelId, checkInDate, checkOutDate, roomType, numberOfRooms });

  if (!result.success) {
    return res.status(400).json({ success: false, message: result.message });
  }

  const { roomTypeData, totalNights } = result;

  return res.json({
    success: true,
    available: true,
    roomType,
    pricePerNight: roomTypeData.price,
    totalNights,
    estimatedTotal: roomTypeData.price * numberOfRooms * totalNights
  });
};

module.exports = { checkAvailability, checkRoomAvailability };
