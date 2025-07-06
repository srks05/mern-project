const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users"); 
const nodemailer = require('nodemailer');

const secretKey = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0';


async function sendOtpEmail(to, otp) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'testuser247online@gmail.com',
            pass: 'djwwaliglckmeuvu',
        },
    });

    let info = await transporter.sendMail({
        from: 'testuser247online@gmail.com',
        to,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
        html: `<b>Your OTP code is: ${otp}</b>`,
    });
    return info;
}

async function sendEmail({ to, subject, text, html }) {
    console.log("Sending email to ",to+subject+text+html)
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'testuser247online@gmail.com',
      pass: 'djwwaliglckmeuvu',
    },
  });
  let info = await transporter.sendMail({
    from: 'testuser247online@gmail.com',
    to,
    subject,
    text,
    html,
  });
  return info;
}

const register = async (req, res) => {
    const { username, email, password, role } = req.body;
    console.log(req.body)
    const existingUser = await Users.findOne({ $or: [{ email }] });
    if (existingUser) {
        return res.status(400).json({ message: 'email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new Users({
        username,
        email,
        password:hashedPassword,
        role,
    });

    try {
        const savedUser = await newUser.save();
        const otp = Math.floor(10000 + Math.random() * 90000);
        console.log("otp is ",otp)
        try {
            await sendOtpEmail(email, otp);
        } catch (emailErr) {
            console.error('Failed to send OTP email:', emailErr);
            return res.status(500).json({ message: 'Failed to send OTP email' });
        }

        const token = jwt.sign({ id: savedUser._id, role: savedUser.role }, secretKey, { expiresIn: '1h' });

      
        savedUser.token = token;

        res.json({ ...savedUser.toObject(), otp });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) return res.status(401).json({ message: 'Invalid password' });

        
        const otp = Math.floor(10000 + Math.random() * 90000);
        console.log("otp is ",otp)
        try {
            await sendOtpEmail(email, otp);
        } catch (emailErr) {
            console.error('Failed to send OTP email:', emailErr);
            return res.status(500).json({ message: 'Failed to send OTP email' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: '1h' });
        user.token = token;

        
        res.json({ ...user.toObject(), otp });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
const changePassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;
 
        const user = await Users.findById(userId);
        console.log( user )
        if (!user) return res.status(404).json({ message: "User not found" });
        user.password =  bcrypt.hashSync(newPassword, 10);
        await user.save();

        res.json({ message: "Password changed successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = {
    register,
    login,
    sendEmail,
    changePassword,
    getAllUsers
};