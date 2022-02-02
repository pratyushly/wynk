const router = require("express").Router();
const bcrypt = require("bcrypt");
const saltRounds = 12;
const jwt = require('jsonwebtoken');
const User = require("../../db/db");
const loginAllowed = require("../../authentication/loginValidation");
const mail = require("../../email/email");
const securePassword = require("../../authentication/securePassword");

router.get("/",function(req,res){
    res.redirect("/");
});

router.post("/", loginAllowed, function (req, res) {
    bcrypt.compare(securePassword(req.body.password), req.userPassword, (error, result) => {
        delete req.userPassword;
        if (result) {
            const token = jwt.sign({ id: req.userId }, process.env.JWT_KEY, {
                expiresIn: "7d"
            });
            delete req.userId;
            // console.log("Login Successfull");
            res.send({ message: "Login Successfull", token: token });
        }
        else {
            delete req.userId;
            // console.log("Wrong Password");
            return res.send({ message: "Wrong Password", token: null });
        }
    })
});

router.post("/forgotPassword", loginAllowed, function (req, res) {

    const token = req.headers['x-verification-code'];
    delete req.userId;
    console.log(token);
    if (token && token !== "null") {
        delete req.username;
        jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
            if (err) {
                console.log("error");
                return res.send({ message: "error" });
            }
            else {
                if (decoded.verificationCode === req.body.activationCode)
                    return res.send({ message: "Token Matched" });
                else
                    return res.send({ message: "Invalid Token" });
            }
        });
    }
    else {
        const code = String(Date.now()).substring(7, 13);
        const token = jwt.sign({ verificationCode: code }, process.env.JWT_KEY, {
            expiresIn: "1d"
        });
        mail(req.body.contactDetail,"Reset Password","forgotPassword",{username:req.username,code:code});
        delete req.username;
        res.send({ message: "Token Created", token });
    }
});

router.post("/updatePassword", loginAllowed, function (req, res) {
    bcrypt.hash(securePassword(req.body.newPassword), saltRounds, (error, hash) => {
        User.findOneAndUpdate({ _id: req.userId }, { password: hash }, { new: true }, function (err, docs) {
            if (err) {
                delete req.userId;
                delete req.username;
                return res.send("error");
            }
            else {
                const token = jwt.sign({ id: req.userId }, process.env.JWT_KEY, {
                    expiresIn: "7d"
                });
                delete req.userId;
                delete req.username;
                res.send({ message: "Password Updated", token: token });
            }
        });
    });

});

module.exports = router;
