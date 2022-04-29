import express from 'express';
import verifyToken, { verifyAdmin } from '../middleware/auth.js';
import {
    authUser,
    changePassword,
    getAllUsers,
    login,
    register,
    registerMany,
    updateUser
} from '../controllers/users.js';

const router = express.Router();

router.get('/auth', verifyToken, authUser);
router.get('/', verifyToken, verifyAdmin, getAllUsers);
router.post('/login', login);
router.post('/register', register);
router.post('/register-many', registerMany);
router.put('/', verifyToken, updateUser);
router.put('/password', verifyToken, changePassword);

export default router;
