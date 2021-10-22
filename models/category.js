const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    
    name : {
        type : String,
        required : true
    },
    catId : {
        type : String,
        required : true

    },
    description: {
        type: String,
        required:true
    }
    

})


module.exports = mongoose.model('category',CategorySchema)