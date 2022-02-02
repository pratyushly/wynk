const router = require("express").Router();
const bcrypt = require("bcrypt");
const saltRounds = 12;
const User = require("../../db/db");
const authenticate = require("../../authentication/authenticate");
const securePassword = require("../../authentication/securePassword");

router.get("/", authenticate, function (req, res) {

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
            res.send({ email: user.email });
        }
    });

});

router.patch("/update/username", authenticate, function (req, res) {
    User.findOne({ email: req.body.newUsername }, function (err, user) {
        if (!user) {
            User.findOneAndUpdate({ _id: req.userId }, { email: req.body.newUsername }, { new: true }, function (err, docs) {
                delete req.userId;
                if (err) {
                    console.log(docs);
                    return res.send("err");
                }
                else {
                    return res.send("Updated");
                }
            });
        }
        else if (err) {
            delete req.userId;
            console.log("error");
            return res.send("error");
        }
        else {
            delete req.userId;
            return res.send("Username already exists");
        }
    });
});

router.patch("/update/password", authenticate, function (req, res) {
    User.findOne({
        _id: req.userId
    }, function (err, user) {
        if (!user) {
            delete req.userId;
            console.log("User Not Found");
            return res.send("User Not Found");
        }
        else if (err) {
            delete req.userId;
            console.log("error");
            return res.send("error");
        }
        else {
            if (req.body.password === req.body.confirmPassword) {
                bcrypt.compare(securePassword(req.body.currentPassword), user.password, (err, result) => {
                    if (result) {
                        bcrypt.hash(securePassword(req.body.password), saltRounds, (err, hash) => {
                            User.findOneAndUpdate({ _id: req.userId }, { password: hash }, { new: true }, function (err, docs) {
                                delete req.userId;
                                if (err) {
                                    console.log(docs);
                                    return res.send("error");
                                }
                                else {
                                    return res.send("Updated");
                                }
                            });
                        });
                    }
                    else {
                        delete req.userId;
                        // console.log("Wrong Password");
                        return res.send("Wrong Password");
                    }
                });
            }
            else {
                delete req.userId;
                // console.log("Can't change password as passwords don't Mathch");
                return res.send("Password do not match");
            }
        }
    });
});

router.delete("/delete", authenticate, function (req, res) {
    User.deleteOne({ _id: req.userId }, function (err, doc) {
        delete req.userId;
        res.send("Account Deleted");
    });
});

module.exports = router;
