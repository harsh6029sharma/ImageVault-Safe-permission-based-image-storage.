const Image = require('../models/Image');
const {uploadToCloudinary} = require('../helpers/cloudinaryHelper');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

//this function uploads image
const uploadImageController = async(req,res)=>{
    try{
        //check if file is missing in req object
        if(!req.file){
            res.status(400).json({
                success:false,
                message:'File is required!. please upload an image'
            })
        }
        //if the file is not missing then upload image to cloudinary
        //upload to cloudinary
        const {url,publicId} = await uploadToCloudinary(req.file.path);

        //Now store the image url and publicId to the Database->mongodb
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        })

        await newlyUploadedImage.save();
        //after saving image to the database now return 
        res.status(201).json({
            success:true,
            message:'Image uploaded successfully',
            newlyUploadedImage
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:'Something went wrong!'
        })
    }
}


//this function fetches the image stored in db and cloudinary
const fetchImagesController = async(req,res)=>{
    try{

        const page = parseInt(req.query.page)||1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page-1)*limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1:-1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder;
        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

        if(images){
            res.status(200).json({
                success:true,
                currentPage:page,
                totalPage:totalPages,
                totalImages:totalImages,
                data:images,
            })
        }
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:'Something went wrong!'
        })
    }
}


// this function deletes the image from cloudinary and database
const deleteImageController = async(req,res)=>{
    try{

        const getCurrentIdOfImageToBeDeleted = req.params.id;
        const userId = req.userInfo.userId;

        const image = await Image.findById(getCurrentIdOfImageToBeDeleted);

        if(!image){
            return res.status(404).json({
                success:false,
                message:'Image not found'
            })
        }

        //check if this image is uploaded by the current user who is trying to delete this image
        if(image.uploadedBy.toString() !== userId){
            return res.status(403).json({
                success:false,
                message:'you are not authorized to delete this image because you have not uploaded this image'
            })
        }

        //first delete this image from cloudinary storage 
        await cloudinary.uploader.destroy(image.publicId);

        //and then delete this image from mongodb database
        await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);
        
        res.status(200).json({
            success:true,
            message:'Image deleted successfully!'
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:'Something went wrong!'
        })
    }
}

module.exports = {
    uploadImageController,
    fetchImagesController,
    deleteImageController
}