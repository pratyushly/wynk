const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin-pratyush:"+process.env.MONGO_PASSWORD+"@cluster0.kam7e.mongodb.net/Notion", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true //make this also true
});
// mongoose.connect("mongodb://127.0.0.1:27017/Notion", {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//     autoIndex: true //make this also true
// });
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    contactDetail: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    notes:{
        type:Array
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;