import express from 'express';
import argon2 from 'argon2';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import verifyToken, { verifyAdmin } from '../middleware/authMiddleware.js';

dotenv.config();

const router = express.Router();

router.get('/auth', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.username }).select(
            '-password'
        );
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Không tìm thấy tài khoản của bạn!'
            });
        }
        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            error
        });
    }
});

router.get('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.json({
            success: true,
            users
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error
        });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu tên đăng nhập hoặc mật khẩu!'
        });
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Sai tên đăng nhập hoặc mật khẩu!'
            });
        }
        const passwordValid = await argon2.verify(user.password, password);
        if (!passwordValid) {
            return res.status(400).json({
                success: false,
                message: 'Sai tên đăng nhập hoặc mật khẩu!'
            });
        }
        const accessToken = jwt.sign(
            { username, positions: user.positions },
            process.env.ACCESS_TOKEN_SECRET
        );

        return res.send({
            success: true,
            message: 'Đăng nhập thành công!',
            accessToken
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error
        });
    }
});

router.post('/register', async (req, res) => {
    const {
        username,
        password,
        positions,
        firstName,
        fullName,
        gender,
        birthday,
        homeTown,
        address,
        school,
        studentId,
        phoneNumber,
        email,
        mailSis,
        facebook
    } = req.body;

    if (!username || !password || !gender) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu tên đăng nhập hoặc mật khẩu hoặc giới tính!'
        });
    }

    try {
        // check username exists??
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'Tên đăng nhập đã tồn tại!'
            });
        }

        // all good
        const hashedPassword = await argon2.hash(password);
        const newUser = new User({
            username,
            password: hashedPassword,
            positions,
            firstName,
            fullName,
            gender,
            birthday,
            homeTown,
            address,
            school,
            studentId,
            phoneNumber,
            email,
            mailSis,
            facebook: facebook
                ? facebook?.startsWith('https://')
                    ? facebook
                    : `https://${facebook}`
                : null
        });
        await newUser.save();

        // return token
        // const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.EXPIRES_TIME })
        const accessToken = jwt.sign(
            { username, positions },
            process.env.ACCESS_TOKEN_SECRET
        );

        return res.send({
            success: true,
            message: 'Đăng ký thành công!',
            accessToken
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error
        });
    }
});

router.put('/', verifyToken, async (req, res) => {
    const {
        firstName,
        fullName,
        gender,
        birthday,
        homeTown,
        address,
        school,
        studentId,
        phoneNumber,
        email,
        mailSis,
        facebook
    } = req.body;
    try {
        let updatedUser = {
            firstName,
            fullName,
            gender,
            birthday,
            homeTown,
            address,
            school,
            studentId,
            phoneNumber,
            email,
            mailSis,
            facebook: facebook
                ? facebook?.startsWith('https://')
                    ? facebook
                    : `https://${facebook}`
                : null
        };

        updatedUser = await User.findOneAndUpdate(
            { username: req.username },
            updatedUser,
            { new: true }
        ).select('-password');
        if (!updatedUser) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy tài khoản của bạn!'
            });
        }

        res.json({
            success: true,
            message: 'Cập nhật thành công!',
            user: updatedUser
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error
        });
    }
});

router.put('/password', verifyToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findOne({
            username: req.username
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Sai tên đăng nhập hoặc mật khẩu!'
            });
        }
        const passwordValid = await argon2.verify(user.password, oldPassword);
        if (!passwordValid) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu không chính xác!'
            });
        }

        const hashedPassword = await argon2.hash(newPassword);
        let updatedUser = {
            password: hashedPassword
        };

        updatedUser = await User.findOneAndUpdate(
            { username: req.username },
            updatedUser,
            { new: true }
        ).select('-password');
        if (!updatedUser) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy tài khoản của bạn!'
            });
        }

        res.json({
            success: true,
            message: 'Thay đổi mật khẩu thành công!'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error
        });
    }
});

export default router;
