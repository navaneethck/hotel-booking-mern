const mongoose = require('mongoose');

const hotelSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    images:[{
        type:String,
        required:true
    }],
    price:{
        type:Number,
        required:true,
        min:0
    },
    amenities:[{
        type:String,
        

    }],
    rooms:{
        type:Number,
        required:true,
        min:1
    },
      description: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    contact: {
        phone: String,
        email: String
    },
    availability: {
        type: Boolean,
        default: true
    },
    roomTypes: [
  {
    name: {
      type: String,
      enum: ['Standard', 'Deluxe', 'Suite'],
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    totalRooms: {
      type: Number,
      required: true,
      min: 1
    }
  }
]



},{timestamps:true})


hotelSchema.index({location:1,price:1});
hotelSchema.index({name:'text'});


module.exports=mongoose.model('Hotel',hotelSchema);

