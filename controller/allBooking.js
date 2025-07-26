
const Booking = require('../models/bookingModel');

const getAllBookings = async (req,res)=>{
    try{
        const {page=1,limit=10,status,hotelId,startDate,endDate}=req.query;
        const skip=(page-1)*limit;

        const query={}
        if(status) query.status = status;
        if(hotelId) query.hotel = hotelId;
        if(startDate&&endDate){
            query.checkInDate ={
                $gte:new Date(startDate),
                $lte:new Date(endDate)
            }
        }

        const allBookings = await Booking.find(query)
        .populate('user', 'name email')
        .populate('hotel', 'name location')
        .sort({createdAt:-1})
        .skip(skip)
        .limit(parseInt(limit))

        const totalBookings = await Booking.countDocuments(query);

        const stats = await Booking.aggregate([{
            $match:query
        },{
            $group:{
                _id:null,
                totalRevenue:{$sum:'$totalAmount'},
                totalBookings:{$sum:1},
                pendingBookings:{
                    $sum:{$cond:[{eq:['$status','pending']},1,0]}
                },
                confirmedBookings:{
                    $sum:{$cond:[{eq:['$status','success']},1,0]}
                },
                cancelledBookings:{
                    $sum:{$cond:[{eq:['$status','cancelled']},1,0]}
                }
            }
        }])

        res.json({
            success:true,
            allBookings,
            pagination:{
                currentPage:parseInt(page),
                totalPage:Math.ceil(totalBookings/limit),
                totalBookings,
                nextPage:page < Math.ceil(totalBookings / limit),
                prevPage:page>1
            },
             stats: stats[0] || {
                totalRevenue: 0,
                totalBookings: 0,
                pendingBookings: 0,
                confirmedBookings: 0,
                cancelledBookings: 0
            }
        })

    }catch(error){
      res.status(500).json({ 
      success: false, 
      message: error.message 
    });
    }
}

module.exports = {getAllBookings};