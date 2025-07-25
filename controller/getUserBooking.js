const Booking= require('../models/bookingModel');

const getUserBooking = async(req,res)=>{
    try{

        const{ page=1,limit=10,status}=req.query;
        const skip= (page-1)*limit;

        const query = {user:req.query.userId};
        

        if(status){
            query.status= new RegExp(`^${status}$`, 'i');;
        }

        const bookings = await Booking.find(query)
        .populate('hotel','name location images')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

        const totalBookings = await Booking.countDocuments(query);


        res.json({
            success:true,
            bookings,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalBookings / limit),
                totalBookings,
                hasNextPage: page < Math.ceil(totalBookings / limit),
                hasPrevPage: page > 1
           }  
        })
    }catch(error){
        res.status(500).json({
            success: false, 
            message: error.message 
        })
    }
}

module.exports={getUserBooking}