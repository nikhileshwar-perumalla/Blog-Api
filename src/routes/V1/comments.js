import { Router } from 'express';
import authenticate from '../../../middlewares/authenticate.js';
import { body, param } from 'express-validator';
import validationError from '../../../middlewares/validationError.js';
import { createComment, getCommentsByBlog, deleteComment } from '../../controllers/V1/Comments/comments.js';

const router = Router({ mergeParams: true });

router.get('/', getCommentsByBlog);
router.post('/', authenticate, body('content').trim().notEmpty(), validationError, createComment);
router.delete('/:id', authenticate, param('id').isMongoId(), validationError, deleteComment);

export default router;
