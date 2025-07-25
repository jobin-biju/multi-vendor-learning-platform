var mongoose = require("mongoose")
const paymentSchema=mongoose.Schema({
    orderId:{
        type:String

    },
      paymentId:{
        type:String,
        
    },
      amount:{
        type:Number
        
    },
      user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userRegister"
        
    },
    course_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"course"
    },
    status:{
        type:Number,
        default:0
    },
    venid:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'vendorRegister'
    },
    instructorid:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'instructorRegister'
    },
    date: {
        type: Date,
        default: Date.now   // <-- Add this field
    }
})

const paymentModel=mongoose.model("payment",paymentSchema)
module.exports={paymentModel}