import express from 'express';
import {
  addMembers,
  createGroup,
  removeGroup,
  removeMembers,
  updateGroup,
  viewAllGroups,
} from '../controllers/groups.js';
import verifyToken from '../middleware/auth.js';
import {
  authorizeCreateGroup,
  authorizeUpdateGroup,
  authorizeDeleteGroup,
} from '../middleware/group.js';

const router = express.Router();

router.get('/', verifyToken, viewAllGroups);
router.post('/', verifyToken, authorizeCreateGroup, createGroup);
router.put('/:id', verifyToken, authorizeUpdateGroup, updateGroup);
router.put('/:id/add-members', verifyToken, authorizeUpdateGroup, addMembers);
router.put(
  '/:id/remove-members',
  verifyToken,
  authorizeUpdateGroup,
  removeMembers
);
router.delete('/:id', verifyToken, authorizeDeleteGroup, removeGroup);

export default router;
