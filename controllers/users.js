import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

export const authUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.username }).select(
      '-password'
    );
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy tài khoản của bạn!',
      });
    }
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu tên đăng nhập hoặc mật khẩu!',
    });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Sai tên đăng nhập hoặc mật khẩu!',
      });
    }
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      return res.status(400).json({
        success: false,
        message: 'Sai tên đăng nhập hoặc mật khẩu!',
      });
    }
    const accessToken = jwt.sign(
      { username, positions: user.positions },
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      accessToken,
      positions: user.positions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const register = async (req, res) => {
  const { username, password, gender, positions, facebook, ...rest } = req.body;

  if (!username || !password || !gender) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu tên đăng nhập hoặc mật khẩu hoặc giới tính!',
    });
  }

  try {
    // check username exists??
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Tên đăng nhập đã tồn tại!',
      });
    }

    // all good
    const hashedPassword = await argon2.hash(password);
    let newUser = {
      ...rest,
      username,
      password: hashedPassword,
      gender,
      positions,
      facebook: facebook
        ? facebook?.startsWith('https://')
          ? facebook
          : `https://${facebook}`
        : null,
    };
    newUser = new User(newUser);
    await newUser.save();

    // return token
    // const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.EXPIRES_TIME })
    const accessToken = jwt.sign(
      { username, positions },
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.json({
      success: true,
      message: 'Đăng ký thành công!',
      accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const registerMany = async (req, res) => {
  try {
    await User.insertMany(req.body);
    res.status(201).json({
      success: true,
      message: 'Thành công!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  const user = req.body;

  try {
    let updatedUser = {
      ...user,
      facebook: facebook
        ? facebook?.startsWith('https://')
          ? facebook
          : `https://${facebook}`
        : null,
    };

    updatedUser = await User.findOneAndUpdate(
      { username: req.username },
      updatedUser,
      {
        new: true,
      }
    ).select('-password');
    if (!updatedUser) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy tài khoản của bạn!',
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật thành công!',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({
      username: req.username,
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Sai tên đăng nhập hoặc mật khẩu!',
      });
    }
    const passwordValid = await argon2.verify(user.password, oldPassword);
    if (!passwordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu không chính xác!',
      });
    }

    const hashedPassword = await argon2.hash(newPassword);
    let updatedUser = {
      password: hashedPassword,
    };

    updatedUser = await User.findOneAndUpdate(
      { username: req.username },
      updatedUser,
      {
        new: true,
      }
    ).select('-password');
    if (!updatedUser) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy tài khoản của bạn!',
      });
    }

    res.json({
      success: true,
      message: 'Thay đổi mật khẩu thành công!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};