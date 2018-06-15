const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const orderSchema = new Schema({
    product:{
        // creates a link between an order and a product
        type:mongoose.Schema.Types.ObjectId, ref:'Product', required:true
    },
    quantity:{
        type:Number,
        // if no quantity is passed, the default is set to one
        default:1
    }
});

module.exports=mongoose.model('Order', orderSchema);