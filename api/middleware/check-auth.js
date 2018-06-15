const jwt=require('jsonwebtoken');

module.exports = (req, res, next)=>{
    try{
        // we verify the jwt token
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, 'secret');
        req.userData = decoded;
        next();
    }catch(err){
        return res.status(401).json({message:'Auth failed'});
    };
};