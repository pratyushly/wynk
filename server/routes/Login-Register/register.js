const router = require("express").Router();
const bcrypt = require("bcrypt");
const saltRounds = 12;
const jwt = require('jsonwebtoken');
const User = require("../../db/db");
const registrationAllowed = require("../../authentication/registrationValidation");
const mail = require("../../email/email");
const securePassword = require("../../authentication/securePassword");

router.get("/",function(req,res){
    res.redirect("/");
});

router.post("/",registrationAllowed ,function (req, res) {
    const token = req.headers['x-verification-code'];
    if (token !== "null") {
        jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
            if (err) {
                console.log(err);
                return res.send({message:"error",token:null});
            }
            else {
                if (decoded.verificationCode === req.body.activationCode) {
                    bcrypt.hash(securePassword(req.body.password), saltRounds, (error, hash) => {
                        User.create({
                            email: req.body.username,
                            contactDetail: req.body.contactDetail,
                            password: hash
                        })
                            .then(function (user) {
                                const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
                                    expiresIn: "7d"
                                });
                                mail(req.body.contactDetail,"Welcome","welcome",{username:req.body.username})
                                res.send({ message: "Registration Successfull", token: token });
                            })
                            .catch(error => { res.send({ message: "User already exists", token: null }); });
                    });
                }
                else{
                    return res.send({message:"Invalid Code",token:null});
                }
            }
        });
    }
    else {
        res.send("Token doesn't exists");
    }
});

router.post("/newRequest", registrationAllowed,function (req, res) {
    const code = String(Date.now()).substring(7, 13);
    const token = jwt.sign({ verificationCode: code }, process.env.JWT_KEY, {
        expiresIn: "1d"
    });
    mail(req.body.contactDetail,"Verification Code","verificationCode",{username:req.body.username,code:code});
    res.send({ message: "Token Created", token });
});

module.exports = router;
