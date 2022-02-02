const hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');

// initialize nodemailer
var transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: process.env.SENDING_MAIL_ADDRESS,
            pass: process.env.MAIL_PASSWORD
        },
    }
);

// point to the template folder
const handlebarOptions = {
    viewEngine: {
        partialsDir: (__dirname),
        defaultLayout: false,
    },
    viewPath: (__dirname),
};

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions))

function mail(to,subject,filename,content) {
    const mailOptions = {
        from: `"Wynk | Pratyush Goel" ${process.env.SENDING_MAIL_ADDRESS}`, // sender address
        to: to, // list of receivers
        subject: subject,
        template: filename, // the name of the template file i.e email.handlebars
        context: content
    };
    // trigger the sending of the E-mail
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        // console.log('Message sent: ' + info.response);
    });

}

module.exports = mail;