const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

let resetTokens = {}; // Temporary storage for password reset tokens
let otpStorage = {}; // Temporary storage for OTPs

// 📌 Register User
exports.register = async (req, res) => {
  try {
    const { username, email, password, role_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role_id,
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Login User

console.log("JWT Secret Key Used:", process.env.JWT_SECRET);

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(400).json({ error: 'Invalid Email or Password' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid Password' });

    const token = jwt.sign(
  { id: user.id, role: user.role_id },
  process.env.JWT_SECRET,  // Ensure this is correctly set
  { expiresIn: '1h' }
);


    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Send Password Reset Email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    resetTokens[email] = resetToken;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Use this token to reset your password: ${resetToken}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset token sent to email' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!resetTokens[email] || resetTokens[email] !== token) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { email } });

    delete resetTokens[email]; // Remove token after use
    res.status(200).json({ message: 'Password reset successful' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Send OTP via Email
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    otpStorage[email] = otp;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent to email' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!otpStorage[email] || otpStorage[email] !== parseInt(otp)) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    delete otpStorage[email]; // Remove OTP after successful verification
    res.status(200).json({ message: 'OTP verified successfully' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
