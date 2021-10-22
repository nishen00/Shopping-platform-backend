const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    
    name : {
        type : String,
        required : true
    },
    catID : {
        type : String,
        required : true

    },
    itemId: {
        type:Number,
        required:true
    },
    imageURL : {
        type:String,
        default:""
    },
    uPrice: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required:true
    },
    status: {
        type: Boolean,
        required:true,
        default:true
    },
    discount: {
        type:Number,
        default:0
    },
    videoLink: {
        type: String,
        default:""
    }

})


module.exports = mongoose.model('item',ItemSchema)