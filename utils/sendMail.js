const nodemailer = require('nodemailer');
const config = require('../config');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    port: 465,
    auth: {
      user: config.EMAIL_ADDRESS,
      pass: config.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
});

module.exports = (from, to, subject, msg) => {
    const mailOptions = {
      from,
      to,
      subject,
      text: msg,
      html: msg, 
    };
    try {
        transporter.sendMail(mailOptions);
        console.log("====sent======");
    } catch(err) {
        console.log('Error from sending mail >>> ', err);
    }
};
