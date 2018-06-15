const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        // a regular expression that should not allow to sign up with something that is not an email
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password:{
        type:String,
        required:true
    }
});

module.exports=mongoose.model('User', userSchema);