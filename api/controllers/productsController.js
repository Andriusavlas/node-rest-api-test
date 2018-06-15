const Product = require('../models/productModel');
const fs = require('fs');

exports.products_get_all=async (req,res)=>{
    try{
        const products = await Product.find().select('name price _id productImage');
        const response={
            count:products.length,
            products:products.map(product=>{
                return {
                    name:product.name,
                    price:product.price,
                    _id:product._id,
                    productImage:product.productImage,
                    request:{
                        type:'GET',
                        url:'http://localhost:9000/products/'+product.id
                    }
                };
            })
        };
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:err});
    };
};

exports.products_create_new=async (req,res)=>{
    try{
        console.log(req.file);
        const product=new Product({
            name:req.body.name,
            price:req.body.price,
            productImage:req.file.path
        });
        await product.save();
        res.status(201).json({
            message: 'A new item has been created',
            createdProduct:{
                name:product.name,
                price:product.price,
                _id:product._id,
                productImage:product.productImage,
                request:{
                    type:'GET',
                    url:'http://localhost:9000/products/'+product.id
                }
            }
        })
    }catch(err){
        console.log(err);
        res.status(500).json({errror:err})
    };
};

exports.products_get_product=async (req,res)=>{
    try{
        const id = req.params.productId;
        const document = await Product.findOne({_id:id}).select('name price _id productImage');
        console.log(document);
        res.status(200).json(document);
    }catch(err){
        console.log(err);
        res.status(500).json({error:err});
    };
};

exports.products_update_product=async (req,res)=>{
    try{
        const id = req.params.productId;
        const updateOps={};
        for (const ops of req.body){
            updateOps[ops.propName]=ops.value;
        };
        await Product.update({_id:id},{$set:updateOps});
        res.status(200).json({
            message:'Item has been updated successfully',
            request:{
                type:'GET',
                url:'http://localhost:9000/products/' + id
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({error:err});
    };
};

exports.products_delete_product=async (req,res)=>{
    try{
        const product= await Product.findOne({_id:req.params.productId});
        console.log(product.productImage);
        await fs.unlink(product.productImage, (err)=>{
            if(err) throw err;
            console.log('File was deleted successfully');
        })
        await Product.remove({_id:req.params.productId});
        res.status(200).json({message:'Product deleted successfully'});
    }catch(err){
        console.log(err);
        res.status(500).json({error:err});
    };
};