import { Router } from 'express';
import authenticate from '../../../middlewares/authenticate.js';
import { body, param, query } from 'express-validator';
import validationError from '../../../middlewares/validationError.js';
import { createBlog, getAllBlogs, getBlogsByUser, getBlogBySlug, updateBlog, deleteBlog, likeBlog, unlikeBlog } from '../../controllers/V1/Blogs/blogs.js';
import commentsRouter from './comments.js';

const router = Router();

router.get('/',
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validationError,
  getAllBlogs
);

router.get('/user/:userId', param('userId').isMongoId(), validationError, getBlogsByUser);
router.get('/:slug', getBlogBySlug);

router.post('/',
  authenticate,
  body('title').trim().notEmpty().isLength({ max: 200 }),
  body('content').notEmpty(),
  body('tags').optional().isArray(),
  validationError,
  createBlog
);

router.patch('/:slug', authenticate, updateBlog);
router.delete('/:slug', authenticate, deleteBlog);

router.post('/:slug/like', authenticate, likeBlog);
router.post('/:slug/unlike', authenticate, unlikeBlog);

// Nested comments
router.use('/:slug/comments', commentsRouter);

export default router;
