const router = require("express").Router();
const User = require("../../db/db");
const authenticate = require("../../authentication/authenticate");

router.get("/", authenticate, function (req, res) {

    User.findOne({
        _id: req.userId
    }, function (err, user) {
        delete req.userId;
        //   .then(user => {
        if (!user) {
            console.log("User Not Found");
            return res.send("User Not Found");
        }
        else if (err) {
            console.log("error");
            return res.send("error");
        }
        else {
            res.send(user.notes);
        }
    });
    // console.log(("req.userId after deleting " + req.userId));
});
router.patch("/update", authenticate, function (req, res) {

    // console.log(req.userId);
    // console.log(req.body);
    User.findOne({
        _id: req.userId
    }, function (err, user) {
        //   .then(user => {
        if (!user) {
            console.log("User Not Found");
            return res.send("User Not Found");
        }
        else if (err) {
            console.log("error");
            return res.send("error");
        }
        else {
            // console.log(req.body);
            let flag = 0;
            for (let i = 0; i < user.notes.length; i++) {
                if (user.notes[i].id === req.body.id) {
                    user.notes[i] = req.body;
                    flag = 1;
                    break;
                }
            }
            if (flag === 0) {
                user.notes.push(req.body);
            }
            User.findOneAndUpdate({ _id: req.userId }, { notes: user.notes }, { new: true }, function (err, docs) {
                delete req.userId;
                if (err) {
                    // console.log(docs);
                    return res.send("error");
                }
                else {
                    // console.log("Note Added");
                    return res.send("Note Added");
                }
            });
        }
    });
});


router.delete("/delete", authenticate ,function (req, res) {
    // console.log("id to be deleted "+req.body.id);
    User.findOne({
        _id: req.userId
    }, function (err, user) {
        if (!user) {
            console.log("User Not Found");
            return res.send("User Not Found");
        }
        else if (err) {
            console.log("error");
            return res.send("error");
        }
        else {
            // console.log("Before deletion : "+user);
            for (let i = 0; i < user.notes.length; i++) {
                if (user.notes[i].id === req.body.id) {
                    user.notes.splice(i, 1);
                    break;
                }
            }
            User.findOneAndUpdate({ _id: req.userId }, { notes: user.notes }, { new: true }, function (err, docs) {
                delete req.userId;
                if (err) {
                    // console.log(docs);
                    return res.send("error");
                }
                else {
                    // console.log("Note Deleted");
                    return res.send("Note Deleted");
                }
            });
        }
    });
});

module.exports = router;
