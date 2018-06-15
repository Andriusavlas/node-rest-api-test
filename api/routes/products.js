const express=require('express');
const router=express.Router();
const multer=require('multer');

const checkAuth=require('../middleware/check-auth');

const productsController=require('../controllers/productsController');

// from the official documentation
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+file.originalname);
    }
});

const fileFilter=(req,file,cb)=>{
    if(file.mimetype === 'img/jpeg' || file.mimetype === 'img/png'){
        // stores the file
        cb(null, false);
    }else{
        // rejects the file
        cb(null, true);
    };
};

const upload = multer({
    storage:storage,
    limits:{
        fileSize:1024*1024*5
    },
    fileFilter:fileFilter
});

router.get('/', productsController.products_get_all);

router.post('/',checkAuth, upload.single('productImage'), productsController.products_create_new);

router.get('/:productId', productsController.products_get_product);

router.patch('/:productId', checkAuth, productsController.products_update_product);

router.delete('/:productId', checkAuth, productsController.products_delete_product);

module.exports = router;