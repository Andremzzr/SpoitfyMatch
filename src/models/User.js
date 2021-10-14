const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    artists : {
        type: Array,
        default : []
    },
    image : {
        type: String,
        required : true
    },
    link: {
        type : String
    }
});
  

module.exports = mongoose.model('User', UserSchema);