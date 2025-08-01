const mongoose= require('mongoose');

const bookingSchema= new mongoose.Schema({

user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
},
hotel:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Hotel',
    required:true
},
checkInDate:{
    type:Date,
    required:true
  
},
checkOutDate:{
    type:Date,
    required:true
},
roomType: {
  type: String,
  enum: ['Standard', 'Deluxe', 'Suite'],
  required: true
},
  totalAmount: {
    type: Number,
    required: true
  },
  status:{
    type:String,
    enum:['pending','confirmed','cancelled','completed'],
    default:'pending'
  },
    guests: {
    adults: {
      type: Number,
      required: true,
      min: 1
    },
    },
    bookingReference: {
    type: String,
    unique: true
  },
    specialRequests: {
    type: String,
    maxLength: 500
  },
  cancelledAt: {
    type: Date
  },
  cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  cancellationReason:{
    type: String,
    maxLength: 500
  },
},{
    timestamps:true
  }
);

function generateBookingRef() {
  return 'BK' + Math.floor(100000 + Math.random() * 900000);
}

bookingSchema.pre('save', function(next){
    if(!this.bookingReference){
         this.bookingReference = generateBookingRef();
    }
    next();
})

module.exports = mongoose.model('Booking', bookingSchema);