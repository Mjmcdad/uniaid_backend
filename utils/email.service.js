const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Your OTP for password reset is:</p>
          <div style="background: #f4f4f4; padding: 10px; border-radius: 5px; font-size: 24px; letter-spacing: 2px; text-align: center; margin: 20px 0;">
            <strong>${otp}</strong>
          </div>
          <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

module.exports = { sendOTPEmail };
