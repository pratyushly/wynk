const router = require("express").Router();

router.get("/",function (req, res) {
    res.send("hello there from server");
});
    
module.exports = router;
