require("dotenv").config();
const express = require("express");
const homeRoute = require("./routes/home");
const registerRoute = require("./routes/Login-Register/register");
const loginRoute = require("./routes/Login-Register/login");
const authenticationRoute = require("./routes/Authentication/authentication");
const deauthenticationRoute = require("./routes/Authentication/deauthentication");
const notesRoute = require("./routes/Notes/notes");
const userDetailsRoute = require("./routes/User/userDetails");
const app = express();

app.use(express.json());

app.use(express.static(__dirname+"/build"));
app.use("/", homeRoute);
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/authentication", authenticationRoute);
app.use("/deauthentication", deauthenticationRoute);
app.use("/notes", notesRoute);
app.use("/userDetails", userDetailsRoute);

app.listen(process.env.PORT, function () {
    console.log("Server running on " + process.env.PORT);
});