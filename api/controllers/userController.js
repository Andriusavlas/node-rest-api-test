const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const User = require('../models/userModel')

exports.user_signup=(req, res, next)=>{
    try{
        // first argument is the received password and the second one is salting rounds - 10 is considered safe, 
        // last one is error handling
        bcrypt.hash(req.body.password, 10, (err, hash)=>{
            if(err){
                return res.status(500).json({error:err});
            }else{
                const user = new User({
                    email:req.body.email,
                    password:hash
                });
                // handlina duplicate errora
                user.save((err)=>{
                    if(err){
                        res.status(500).json({error:err});
                    }else{
                        res.status(201).json({message:'User created!'});
                    };
                });
            };
        });   
    }catch(err){
        console.log(err);
        res.status(500).json({error:err});
    };
};

exports.user_login=async (req, res, next)=>{
    try{
        const user = await User.findOne({email:req.body.email});
        if(user.length < 1 ){
            return res.status(401).json({message:'Authentication failed.'});
        };
        bcrypt.compare(req.body.password, user.password, (err, result)=>{
            if(err) return res.status(401).json({message:'Authentication failed.'});
            if(result){
                const token =jwt.sign(
                    {
                        email:user.email,userId:user._id
                    },
                    'secret',
                    {
                        expiresIn:'1h'
                    }
                );
                return res.status(200).json({message:'Auth successfull.', token:token});
            };
            return res.status(401).json({message:'Authentication failed.'});
        });
    }catch(err){
        res.status(500).json({error:err});
    };
};

exports.user_delete=async (req, res, next)=>{
    try{
        await User.remove({_id:req.params.userId});
        res.status(200).json({message:'User deleted successfully!'});
    }catch(err){
        res.status(500).json({error:err});
    };
};