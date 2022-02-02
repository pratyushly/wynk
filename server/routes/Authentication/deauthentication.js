const router = require("express").Router();
const jwt = require('jsonwebtoken');

router.post("/",function(req,res){
    if(req.body.token){
        jwt.verify(req.body.token,process.env.JWT_KEY,function(err,decoded){
            if(err){
                console.log(err);
                return res.send({message:"error",token:null});
            }
            else{
                // console.log(decoded);
                res.send({message:"User DeAuthenticated",token:null});
            }
        });
    }
    else{
        return res.send({message:"error",token:null});
    }
});

module.exports = router;
