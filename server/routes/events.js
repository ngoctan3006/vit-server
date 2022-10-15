import express from 'express';
import {
  addParticipants,
  createEvent,
  deleteEvent,
  enrollMembers,
  removeEnrolledMembers,
  removeParticipants,
  updateEvent,
  viewAllEvents,
} from '../controllers/events.js';
import verifyToken from '../middleware/auth.js';
import {
  authorizeViewEvent,
  authorizeCreateEvent,
  authorizeUpdateEvent,
  authorizeDeleteEvent,
} from '../middleware/event.js';

const router = express.Router();

router.get('/', verifyToken, authorizeViewEvent, viewAllEvents);
router.post('/', verifyToken, authorizeCreateEvent, createEvent);
router.put('/:id', verifyToken, authorizeUpdateEvent, updateEvent);
router.put(
  '/:id/enroll-members',
  verifyToken,
  authorizeUpdateEvent,
  enrollMembers
);
router.put(
  '/:id/add-participants',
  verifyToken,
  authorizeUpdateEvent,
  addParticipants
);
router.put(
  '/:id/remove-enrolled-members',
  verifyToken,
  authorizeUpdateEvent,
  removeEnrolledMembers
);
router.put(
  '/:id/remove-participants',
  verifyToken,
  authorizeUpdateEvent,
  removeParticipants
);
router.delete('/:id', verifyToken, authorizeDeleteEvent, deleteEvent);

export default router;
