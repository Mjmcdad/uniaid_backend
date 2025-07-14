const nodemailer = require("nodemailer");

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like Yahoo, Outlook, etc.
  auth: {
    user: process.env.EMAIL_USERNAME, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

module.exports = transporter;
