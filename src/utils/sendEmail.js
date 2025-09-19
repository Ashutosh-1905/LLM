import nodemailer from "nodemailer";
import config from "../config/config.js";

const sendEmail = async function (email, subject, message) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpPort == 465, 
        auth: {
            user: config.smtpUsername,
            pass: config.smtpPassword,
        },
    });

    // send mail with defined transport object
    await transporter.sendMail({
        from: `LMS Skills <${config.smtpFromEmail}>`,
        to: email, // user email
        subject: subject, // Subject line
        html: message, // <-- Use html for better formatting
    });
};

export default sendEmail;