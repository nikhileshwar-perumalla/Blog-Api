import slugify from 'slugify';
import Blog from '../../../../models/blog.js';

const makeSlug = (title) => slugify(title, { lower: true, strict: true, trim: true });

export const createBlog = async (req, res) => {
  try {
    const { title, content, tags, published = true } = req.body;
    if (!title || !content) return res.status(400).json({ code: 'ValidationError', message: 'title and content are required' });
    let slug = makeSlug(title);
    // ensure uniqueness by appending counter if needed
    let base = slug, i = 1;
    while (await Blog.exists({ slug })) slug = `${base}-${i++}`;
    const blog = await Blog.create({ title, slug, content, tags, author: req.user.id, published });
    return res.status(201).json({ blog });
  } catch (err) {
    return res.status(500).json({ code: 'ServerError', message: 'Failed to create blog', error: err.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, author, tag } = req.query;
    const filter = {};
    if (author) filter.author = author;
    if (tag) filter.tags = tag;
    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('author', 'username email')
      .lean();
    return res.status(200).json({ blogs });
  } catch (err) {
    return res.status(500).json({ code: 'ServerError', message: 'Failed to list blogs', error: err.message });
  }
};

export const getBlogsByUser = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.userId }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ blogs });
  } catch (err) {
    return res.status(500).json({ code: 'ServerError', message: 'Failed to get blogs', error: err.message });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate('author', 'username email').lean();
    if (!blog) return res.status(404).json({ code: 'NotFound', message: 'Blog not found' });
    return res.status(200).json({ blog });
  } catch (err) {
    return res.status(500).json({ code: 'ServerError', message: 'Failed to get blog', error: err.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ code: 'NotFound', message: 'Blog not found' });
    if (blog.author.toString() !== req.user.id) return res.status(403).json({ code: 'Forbidden', message: 'Not your blog' });

    const { title, content, tags, published } = req.body;
    if (title && title !== blog.title) {
      let slug = makeSlug(title);
      let base = slug, i = 1;
      while (await Blog.exists({ slug, _id: { $ne: blog._id } })) slug = `${base}-${i++}`;
      blog.slug = slug;
      blog.title = title;
    }
    if (content !== undefined) blog.content = content;
    if (tags !== undefined) blog.tags = tags;
    if (published !== undefined) blog.published = published;
    await blog.save();
    return res.status(200).json({ blog });
  } catch (err) {
    return res.status(500).json({ code: 'ServerError', message: 'Failed to update blog', error: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ code: 'NotFound', message: 'Blog not found' });
    if (blog.author.toString() !== req.user.id) return res.status(403).json({ code: 'Forbidden', message: 'Not your blog' });
    await blog.deleteOne();
    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({ code: 'ServerError', message: 'Failed to delete blog', error: err.message });
  }
};

export const likeBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, likes: { $ne: userId } },
      { $addToSet: { likes: userId }, $inc: { likeCount: 1 } },
      { new: true }
    ).lean();
    if (!blog) return res.status(400).json({ code: 'BadRequest', message: 'Already liked or blog not found' });
    return res.status(200).json({ blog });
  } catch (err) {
    return res.status(500).json({ code: 'ServerError', message: 'Failed to like blog', error: err.message });
  }
};

export const unlikeBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, likes: userId },
      { $pull: { likes: userId }, $inc: { likeCount: -1 } },
      { new: true }
    ).lean();
    if (!blog) return res.status(400).json({ code: 'BadRequest', message: 'Not liked yet or blog not found' });
    return res.status(200).json({ blog });
  } catch (err) {
    return res.status(500).json({ code: 'ServerError', message: 'Failed to unlike blog', error: err.message });
  }
};

export default { createBlog, getAllBlogs, getBlogsByUser, getBlogBySlug, updateBlog, deleteBlog, likeBlog, unlikeBlog };
