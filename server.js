require('dotenv').config();

const express = require('express');
const connectToDB = require('./database/db');
const authRoutes = require('./routes/auth-routes');
const homeRoutes = require('./routes/home-routes');
const adminRoutes = require('./routes/admin-routes');
const uploadImageRoutes = require('./routes/image-routes');

const Routes = require('./routes/home-routes');
const app = express();

const PORT = process.env.PORT||3000;

//connecting to database...
connectToDB();

//use middleware to parse the json body
app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/home',homeRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/image',uploadImageRoutes);


app.listen(PORT,()=>{
    console.log(`server is listening on port ${PORT}`);
})