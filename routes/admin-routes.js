const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');

router = express.Router();

// 2 layer protection for the admin because:
// authMiddleware is used to authorize the normal user
// adminMiddleware is used to authorize the admin user
router.get('/welcome',authMiddleware,adminMiddleware,(req,res)=>{
    res.json({
        message:'Welcome to the admin page!',
    })
})

module.exports = router