const transporter = require("../config/transporter");

const sendmail = async () => {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const mailOptions = {
        from: "codeliterature1@gmail.com",
        to: "sr14201721@gmail.com",
        subject: "opt is this",
        text: `otp is this ${otp}`
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    })
}

module.exports = sendmail;