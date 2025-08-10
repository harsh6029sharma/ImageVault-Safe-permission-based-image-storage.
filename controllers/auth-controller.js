const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// register controller 
const registerUser = async (req, res) => {
    try {
        //first we have to extract the user information from our request body
        const { username, email, password, role } = req.body;

        //then check if the user already exist or not 
        const checkExistingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: 'User is already exists'
            })
        }

        //hash the password before storing in the database 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //now you create the user and save in the database
        const newlyCreatedUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        })

        await newlyCreatedUser.save();

        if (newlyCreatedUser) {
            res.status(201).json({
                success: true,
                message: 'User is registered successfully'
            })
        } else {
            res.status(400).json({
                success: false,
                message: 'user registered successfully'
            })
        }

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'some error occured! please try again'
        })
    }
}

// login controller 
const loginUser = async (req, res) => {
    try {
        const {username,password} = req.body;

        //find if the current user exist in our database or not
        const user = await User.findOne({username});
        //this user contains the users all information like id, password, email, username, role etc

        if(!user){
            return res.status(400).json({
                success:false,
                message:'User does not exists!'
            })
        }

        //check if the password match or not 
        const isPasswordMatch = await bcrypt.compare(password,user.password);

        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:'Invalid credentials!'
            })
        }

        // if the user gives all the correct credentials then we will create a token and then store that credentials in token
        //create a token
        // jwt.sign(payload, secretOrPrivateKey, [options, callback])
        const accessToken = jwt.sign({
            userId:user._id,
            username: user.username,
            role: user.role
        }, process.env.JWT_SECRET_KEY,{
            expiresIn:'15m'
        })

        res.status(200).json({
            success:true,
            message:'Logged in successfully',
            accessToken //passing accessToken to frontend to store in our cookie and create session
        })


    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'some error occured! please try again'
        })
    }
}

const changePassword = async(req,res)=>{
    try{
        const userId = req.userInfo.userId;

        //extract old and new password 
        const {oldPassword,newPassword} = req.body;

        //find the current logged in user
        const user = await User.findById(userId);
        
        if(!user){
            return res.status(400).json({
                success:false,
                message:'User not found'
            })
        }

        //check if the old password is correct or not 
        const isPasswordMatch = await bcrypt.compare(oldPassword,user.password);

        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:'Old password is not correct please try again'
            })
        }

        //hash the new password 
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword,salt);

        //update the user password
        user.password = newHashedPassword;
        await user.save();

        res.status(200).json({
            success:true,
            message:'Password changed successfully!'
        })



    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'some error occured! please try again'
        })
    }
}

module.exports={
    registerUser,
    loginUser,
    changePassword
}