import Blog from '../../../../models/blog.js';
import Comment from '../../../../models/comment.js';
import User from '../../../../models/user.js';

export const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ code: 'ValidationError', message: 'content is required' });
    const blog = await Blog.findOne({ slug: req.params.slug }).lean();
    if (!blog) return res.status(404).json({ code: 'NotFound', message: 'Blog not found' });
    const comment = await Comment.create({ blog: blog._id, author: req.user.id, content });
    return res.status(201).json({ comment });
  } catch (err) {
    return res.status(500).json({ code: 'ServerError', message: 'Failed to create comment', error: err.message });
  }
};

export const getCommentsByBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).lean();
    if (!blog) return res.status(404).json({ code: 'NotFound', message: 'Blog not found' });
    const comments = await Comment.find({ blog: blog._id }).sort({ createdAt: -1 }).populate('author', 'username').lean();
    return res.status(200).json({ comments });
  } catch (err) {
    return res.status(500).json({ code: 'ServerError', message: 'Failed to get comments', error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ code: 'NotFound', message: 'Comment not found' });
    let isAdmin = false;
    if (req.user?.id) {
      const me = await User.findById(req.user.id).select('role').lean();
      isAdmin = me?.role === 'admin';
    }
    if (comment.author.toString() !== req.user.id && !isAdmin) {
      return res.status(403).json({ code: 'Forbidden', message: 'Not allowed to delete this comment' });
    }
    await comment.deleteOne();
    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({ code: 'ServerError', message: 'Failed to delete comment', error: err.message });
  }
};

export default { createComment, getCommentsByBlog, deleteComment };
