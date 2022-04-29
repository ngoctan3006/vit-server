import express from 'express';
import verifyToken from '../middleware/auth.js';
import {
    authorizeViewActivity,
    authorizeCreateActivity,
    authorizeUpdateActivity,
    authorizeDeleteActivity
} from '../middleware/activity.js';
import {
    addParticipants,
    createActivity,
    deleteActivity,
    enrollMembers,
    removeEnrolledMembers,
    removeParticipants,
    updateActivity,
    viewAllActivities
} from '../controllers/activities.js';

const router = express.Router();

router.get('/', verifyToken, authorizeViewActivity, viewAllActivities);
router.post('/', verifyToken, authorizeCreateActivity, createActivity);
router.put('/:id', verifyToken, authorizeUpdateActivity, updateActivity);
router.put('/:id/enroll-members', verifyToken, authorizeUpdateActivity, enrollMembers);
router.put('/:id/add-participants', verifyToken, authorizeUpdateActivity, addParticipants);
router.put(
    '/:id/remove-enrolled-members',
    verifyToken,
    authorizeUpdateActivity,
    removeEnrolledMembers
);
router.put('/:id/remove-participants', verifyToken, authorizeUpdateActivity, removeParticipants);
router.delete('/:id', verifyToken, authorizeDeleteActivity, deleteActivity);

export default router;
