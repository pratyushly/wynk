const jwt = require('jsonwebtoken');
const User = require("../db/db");

function entryAllowed(req, res, next) {
    User.findOne({
        email: req.body.username
    }, function (err, user) {
        if (!user) {
            User.findOne({
                contactDetail: req.body.contactDetail
            }, function (err, user) {
                if (!user) {
                    next();
                }
                else if (err) {
                    console.log("error");
                    return res.send({ message: "error", token: null });
                }
                else
                    return res.send({ message: "Contact detail already exists", token: null })
            });
        }
        else if (err) {
            console.log("error");
            return res.send({ message: "error", token: null });
        }
        else {
            return res.send({ message: "User already exists", token: null });
        }
    });
}

module.exports = entryAllowed;