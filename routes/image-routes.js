const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const uploadMiddleware = require('../middleware/upload-middleware');
//now use upload controller
const {uploadImageController,fetchImagesController, deleteImageController} = require('../controllers/imageControllers');

const router = express.Router();

//upload the image
//we use 2 middleware protection because only admin can upload images or files
router.post('/upload',authMiddleware,adminMiddleware,uploadMiddleware.single('image') , uploadImageController);

// to get all the images
//we only use one middleware because any logged user can see it 
router.get('/get',authMiddleware,fetchImagesController); 

//delete image route
router.delete('/:id',authMiddleware,adminMiddleware,deleteImageController);


module.exports = router