import express from 'express';
import argon2 from 'argon2';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import verifyToken, { verifyAdmin } from '../middleware/auth.js';
import User from '../models/User.js';
const router = express.Router();

dotenv.config();

/**
 * @route api/v1/users/
 * @desc get users
 * @acces private
 */
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

/**
 * @route api/v1/users/login
 * @desc login users
 * @acces public
 */
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
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

/**
 * @route api/v1/users/register
 * @desc register users
 * @acces public
 */
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
        school,
        studentId,
        phoneNumber,
        email
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
            school,
            studentId,
            phoneNumber,
            email
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
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

export default router;
