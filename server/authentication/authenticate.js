const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    // console.log(req.headers['x-access-token']);
    // console.log(req.headers);
    // console.log(req.body);
    if (req.headers['x-access-token'] !== "null") {
        const token = req.headers['x-access-token'];
        // console.log(token);
        if (token !== 'null') {
            jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
                if (err) {
                    console.log(err);
                    return res.send("error");
                }
                else {
                    // console.log("sendinig notes");
                    // console.log("Inside notes route " + JSON.stringify(decoded));
                    // console.log("req.userid before setting " + req.userId);
                    req.userId = decoded.id;
                    // console.log("req.userid after setting " + req.userId);
                    next();
                }
            });
        }
        else {
            // console.log("Token Value is null");
            return res.send("Token Value is null");
        }
    }
    else
        res.send("Token do not exist");
}

module.exports = authenticate;