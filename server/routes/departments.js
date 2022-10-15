import express from 'express';
import {
  addMembers,
  createDepartment,
  deleteDepartment,
  removeMembers,
  updateDepartment,
  viewAllDepartments,
} from '../controllers/departments.js';
import verifyToken from '../middleware/auth.js';
import {
  authorizeCreateDepartment,
  authorizeDeleteDepartment,
  authorizeUpdateDepartment,
} from '../middleware/department.js';

const router = express.Router();

router.get('/', verifyToken, viewAllDepartments);
router.post('/', verifyToken, authorizeCreateDepartment, createDepartment);
router.put('/:id', verifyToken, authorizeUpdateDepartment, updateDepartment);
router.put(
  '/:id/add-members/',
  verifyToken,
  authorizeUpdateDepartment,
  addMembers
);
router.put(
  '/:id/remove-members/',
  verifyToken,
  authorizeUpdateDepartment,
  removeMembers
);
router.delete('/:id', verifyToken, authorizeDeleteDepartment, deleteDepartment);

export default router;
