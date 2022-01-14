import express from 'express';
import argon2 from 'argon2';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import verifyToken, { verifyAdmin } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

dotenv.config();

router.get('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.json({
            success: true,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error
        });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Missing username or password'
        });
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'username or password is incorrect'
            });
        }
        const passwordValid = await argon2.verify(user.password, password);
        if (!passwordValid) {
            return res.status(400).json({
                success: false,
                message: 'username or password is incorrect'
            });
        }
        const accessToken = jwt.sign(
            { username, positions: user.positions },
            process.env.ACCESS_TOKEN_SECRET
        );

        return res.send({
            success: true,
            message: 'login successfully',
            accessToken
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
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
        facebook
    } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Missing username or password'
        });
    }

    try {
        // check username exists??
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'username is already in use'
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
            facebook
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
            message: 'resgister successfully',
            accessToken
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error
        });
    }
});

router.put('/update/:id', verifyToken, async (req, res) => {
    const {
        firstName,
        fullName,
        gender,
        birthday,
        homeTown,
        address,
        school,
        phoneNumber,
        email,
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
            phoneNumber,
            email,
            facebook
        };

        updatedUser = await User.findOneAndUpdate(
            { username: req.username, _id: req.params.id },
            updatedUser,
            { new: true }
        );
        if (!updatedUser) {
            return res.status(401).json({
                success: false,
                message: 'user not authorized'
            });
        }

        res.json({
            success: true,
            message: 'update successfully!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error
        });
    }
});

router.put('/changepasword/:id', verifyToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findOne({
            username: req.username
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'username or password is incorrect'
            });
        }
        const passwordValid = await argon2.verify(user.password, oldPassword);
        if (!passwordValid) {
            return res.status(400).json({
                success: false,
                message: 'password is incorrect'
            });
        }

        const hashedPassword = await argon2.hash(newPassword);
        let updatedUser = {
            password: hashedPassword
        };

        updatedUser = await User.findOneAndUpdate(
            { username: req.username, _id: req.params.id },
            updatedUser,
            { new: true }
        );
        if (!updatedUser) {
            return res.status(401).json({
                success: false,
                message: 'user not authorized'
            });
        }

        res.json({
            success: true,
            message: 'change password successfully!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error
        });
    }
});

export default router;
