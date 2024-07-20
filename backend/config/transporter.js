const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        user: "codeliterature1@gmail.com",
        // pass: "wearetheCodeLiteratureMyFriend@1",
        pass: "bsje okls gehl owjj"
    },
});

module.exports = transporter;