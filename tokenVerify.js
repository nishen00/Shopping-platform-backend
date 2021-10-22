const jwt = require('jsonwebtoken');


module.exports = function (req,res,next) {
   
    const token = req.body.Token;
    if(!token) return res.json({message:"access denide"})

    try{

        const verify = jwt.verify(token,process.env.TOKEN_SECRET);
        req.user = verify;
        next();

    }catch(err){

        res.status(400).json({message:'invalid token'})

    }

}

