const Booking = require('../models/bookingModel');
const Hotel = require('../models/hotelModel');
const {checkingPolicy} = require('../utils/bookingPolicyUtils');

const cancelBooking = async (req,res)=>{
    try{
        const {bookingId} = req.params;
        const {reason} = req.body;

        const booking = await Booking.findById(bookingId);

        if(!booking){
            return res.status(404).json({
                success:false,
                message:"Booking not found"
            });
        }
       //cancelBooking fixing id  for testing
          req.user = { id: "685a51604df158309afbe600", role: "user" };

        if(booking.user.toString() !== req.user.id && req.user.role !== 'admin'){
            
            return res.status(403).json({
                success:false,
                message:'Not authorized to cancel this Booking'
            })
        }

        if(booking.status === 'canceled'){
             return res.status(400).json({ 
                success: false, 
                message: 'Booking is already cancelled' 
            });
        }

        if (booking.status === 'completed') {
        return res.status(400).json({ 
            success: false, 
            message: 'Cannot cancel completed booking' 
        });
        }

        const hotel=  await Hotel.findById(booking.hotel);
        const policyCheck = checkingPolicy(booking,hotel.bookingPolicy);
        
        if(!policyCheck.canCancel){
             return res.status(400).json({
                success: false,
                message: 'Cannot cancel this booking as per policy',
                refundPercentage: 0
            });        
        }

        booking.status = 'cancelled';
        booking.cancellationReason = reason;
        booking.cancelledAt = new Date();
        booking.cancelledBy = req.user.id;
        await booking.save();

         res.json({
            success: true,
            message: 'Booking cancelled successfully',
            refundPercentage: policyCheck.refundPercentage,
            booking
            });

    }catch(error){
        res.status(500).json({ success: false, message: error.message });

    }
}

module.exports = {cancelBooking};