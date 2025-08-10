// const mongoose = require('mongoose');

// const connectToDB = async() =>{
//     try{
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log('mongoDB is connected successfully!');
//     }catch(e){
//         console.log('mongoDB connection is failed');
//         process.exit(1);
//     }
// }

// module.exports = connectToDB;

const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
    }
};

module.exports = connectToDB;