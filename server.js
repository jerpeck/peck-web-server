const   express = require('express'),
        nodemailer = require('nodemailer'),
        cors = require('cors'),
        app = express();

require('dotenv').config();

app.use(express.json());
app.use(cors());

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        pass: process.env.WORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    }
});

transporter.verify((err, success) => {
    err
      ? console.log(err)
      : console.log(`=== Server is ready to take messages: ${success} ===`);
   });

app.post("/send", function (req, res) {
let mailOptions = {
    from: process.env.EMAIL,
    to: `${req.body.toAddress}`,
    subject: `${req.body.emailSubject}`,
    text: `${req.body.emailText}`,
};

transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
        res.json({
            status: "fail",
        });
    } else {
    console.log("Email sent successfully");
        res.json({ status: "Email sent" });
    }
});
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});