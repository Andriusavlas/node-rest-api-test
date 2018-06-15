const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Importing specific routes
const productRoutes=require('./api/routes/products');
const orderRoutes=require('./api/routes/orders');
const userRoutes=require('./api/routes/user');

mongoose.connect('mongodb://admin:<password>@ds147390.mlab.com:47390/noderestshop');
mongoose.connection.once('open',()=>{
    console.log('connected to db');
}).on('error',(e)=>console.log(e));

// promise integravimas i mongoose - reikalingas, jei kazkur routinge naudojame promisus
mongoose.Promise=global.Promise;

app.use(morgan('dev'));
// dirname is needed when uploading to server
app.use(express.static(__dirname+'/public/uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Routes which should handle reqeusts
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

// CORS handling
app.use((req, res, next)=>{
    // Providing access to the API to any domain
    res.header('Access-Control-Allow-Origin','*');
    // Allowing all headers on the API
    res.header('Access-Control-Allow-Headers','*');
    if(req.method==='OPTIONS'){
        // What HTTP request methods we allow
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    };
    // This is a must so that other routes can work
    next();
});

// Error handling
app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500).json({message:error.message});
})

// Port is either given by the server or 9000
const port = process.env.PORT || 9000;

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});