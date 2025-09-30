import { Router } from 'express';
import authenticate from '../../../middlewares/authenticate.js';
import authorize from '../../../middlewares/authorize.js';
import { getMe, updateMe, deleteMe } from '../../controllers/V1/Users/me.js';
import { listUsers, getUserById, deleteUserById } from '../../controllers/V1/Users/admin.js';

const router = Router();

// Current user
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateMe);
router.delete('/me', authenticate, deleteMe);

// Admin
router.get('/', authenticate, authorize('admin'), listUsers);
router.get('/:id', authenticate, authorize('admin'), getUserById);
router.delete('/:id', authenticate, authorize('admin'), deleteUserById);

export default router;
