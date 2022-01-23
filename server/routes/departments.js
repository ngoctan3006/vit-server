import express from 'express';
import Department from '../models/Department.js';
import verifyToken from '../middleware/authMiddleware.js';
import {
    authorizeCreateDepartment,
    authorizeDeleteDepartment,
    authorizeUpdateDepartment
} from '../middleware/departmentMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const data = await Department.find();
        res.json({
            success: true,
            data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error
        });
    }
});

router.post('/', verifyToken, authorizeCreateDepartment, async (req, res) => {
    const { name, description, chief, vice, members, reference } = req.body;

    try {
        const newDepartment = new Department({
            name,
            description,
            chief,
            vice,
            members,
            reference
        });
        await newDepartment.save();
        res.status(201).send({ success: true, data: newDepartment });
    } catch (err) {
        res.status(400).send({
            success: false,
            err
        });
    }
});

router.put('/', verifyToken, authorizeUpdateDepartment, async (req, res) => {
    const oldDepartment = { _id: req.body._id };

    let newDepartment = {
        name: req.body.name,
        description: req.body.description,
        chief: req.body.chief,
        vice: req.body.vice,
        members: req.body.members,
        reference: req.body.reference
    };

    try {
        newDepartment = await Department.findOneAndUpdate(
            oldDepartment,
            newDepartment,
            { new: true }
        );
        if (!newDepartment) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }
        res.status(200).send({ success: true, data: newDepartment });
    } catch (error) {
        res.status(400).send({ success: false, error });
    }
});

router.put(
    '/add-members',
    verifyToken,
    authorizeUpdateDepartment,
    async (req, res) => {
        try {
            const newDepartment = await Group.findOneAndUpdate(
                { _id: req.body._id },
                { $addToSet: { members: req.body.userIds } },
                { new: true }
            );
            if (!newDepartment) {
                return res.status(404).json({
                    success: false,
                    message: 'Department not found'
                });
            }
            res.send({ success: true, data: newDepartment });
        } catch (err) {
            res.send({ success: false, err });
        }
    }
);

router.put(
    '/remove-members',
    verifyToken,
    authorizeUpdateDepartment,
    async (req, res) => {
        try {
            const newDepartment = await Group.findOneAndUpdate(
                { _id: req.body._id },
                { $pull: { members: { $in: req.body.userIds } } },
                { new: true }
            );
            if (!newDepartment) {
                return res.status(404).json({
                    success: false,
                    message: 'Department not found'
                });
            }
            res.send({ success: true, data: newDepartment });
        } catch (err) {
            res.send({ success: false, err });
        }
    }
);

router.delete(
    '/:id',
    verifyToken,
    authorizeDeleteDepartment,
    async (req, res) => {
        res.status(200).send({ success: true, data: req.params.id });
    }
);

export default router;
