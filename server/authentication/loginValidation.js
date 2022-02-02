const jwt = require('jsonwebtoken');
const User = require("../db/db");

function entryAllowed(req, res, next) {
    if (req.body.username) {
        User.findOne({
            email: req.body.username
        }, function (err, user) {
            if (!user) {
                // console.log("User Not Found");
                return res.send({ message: "User Not Found", token: null })
            }
            else if (err) {
                console.log("error");
                return res.send({ message: "error", token: null });
            }
            else {
                req.userPassword = user.password;
                req.userId = user._id;
                next();
            }
        });
    }
    else if (req.body.contactDetail) {
        User.findOne({
            contactDetail: req.body.contactDetail
        }, function (err, user) {
            if (!user) {
                // console.log("User Not Found");
                return res.send({ message: "User Not Found", token: null })
            }
            else if (err) {
                console.log("error");
                return res.send({ message: "error", token: null });
            }
            else {
                req.username = user.email;
                req.userId = user._id;
                next();
            }
        });
    }
    else {
        console.log("error");
        return res.send({ message: "error", token: null });
    }
}

module.exports = entryAllowed;