const Order=require('../models/orderModel');
const Product=require('../models/productModel');

exports.orders_get_all=async (req,res)=>{
    try{
        const orders=await Order.find().select('product quantity _id').populate('product', 'name');
        console.log(orders);
        res.status(200).json({
            count:orders.length,
            orders:orders.map(order=>{
                return {
                    _id:order._id,
                    product:order.product,
                    quantity:order.quantity,
                    req:{
                        type:'GET',
                        url:'http://localhost:9000/orders/'+ order._id
                    }
                }
            })
        });
    }catch(err){
        console.log(err);
        res.status(500).json({error:err});
    };
};

exports.orders_create_new=async (req,res)=>{
    try{
        // iesko ar yra toks produktas, jei tas produktas yra null tai grazina 404 errora
        const product=await Product.findOne({_id:req.body.productId});
        if(!product) return res.status(404).json({message:'No such product found'});
        const order = new Order({
            quantity:req.body.quantity,
            product:req.body.productId
        });
        await order.save();
        console.log(order);
        res.status(201).json({
            message:'Order created!',
            createdOrder:{
                _id:order._id,
                product:order.product,
                quantity:order.quantity
            },
            req:{
                type:'GET',
                url:'http://localhost:9000/orders/'+order._id
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({error:err});
    };
};

exports.orders_get_order=async (req,res)=>{
    try{
        // grazina null jei neranda tokio
        const order=await Order.findOne({_id:req.params.orderId}).populate('product');
        // ziurim ar ne null, jei null tai gauname 404 errora
        if(!order) return res.status(404).json({message:'Order not found'});
        res.status(200).json({
            order:order,
            req:{
                type:'GET',
                url:'http://localhost:9000/orders'
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({errror:err});
    };
};

exports.orders_delete_order=async (req,res)=>{
    try{
        await Order.remove({_id:req.params.orderId});
        res.status(200).json({message:'Order has been removed'});
    }catch(err){
        console.log(err);
        res.status(500).json({error:err});
    };
};