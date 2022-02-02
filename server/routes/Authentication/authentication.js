const router = require("express").Router();
const jwt = require('jsonwebtoken');
const User = require("../../db/db");
const authenticate = require("../../authentication/authenticate");

router.get("/", authenticate ,function (req, res) {
    User.findOne({
        _id: req.userId
    }, function (err, user) {
        delete req.userId;
        if (!user) {
            console.log("User Not Found");
            return res.send("User Not Found");
        }
        else if (err) {
            console.log("err");
            return res.send("err");
        }
        else {
            // console.log("User Authenticated");
            res.send("User Authenticated");
        }
    });

});

module.exports = router;
