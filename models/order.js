const mongoose = require('mongoose');



const OrderSchema =  new mongoose.Schema({
    
    userId : {
        type : String,
        required : true,
       
    },
    TotalAmount : {
        type : Number,
        required : true,
        

    },
    AddressShiping: {
        type:String,
        required:true
    },

    

    Status : {
        type : Number,
        default : 1 

    },

    date: {
        type : Date,
        default : Date.now
    },

    orderNo: {
        type : Number    
    },

    itemdetails : [
        {
            itemId: {
                type: String,
                required:true
            },
            name: {
                type:String,
                required:true
            },

            
            qty: {

                type:Number,
                required:true

            },

            unitPrice: {

                type:Number,
                required:true

            },

            ImageURL: {

                type:String,
                required:true

            }
        }
    ]



})


module.exports = mongoose.model('orders',OrderSchema)