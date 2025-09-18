import nodemailer from "nodemailer";

const sendEmail = async function (email, subject, message) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT == 465, // <-- Set secure based on port
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    // send mail with defined transport object
    await transporter.sendMail({
        from: `LMS Skills <${process.env.SMTP_FROM_EMAIL}>`, // sender address
        to: email, // user email
        subject: subject, // Subject line
        html: message, // <-- Use html for better formatting
    });
};

export default sendEmail;