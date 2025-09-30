import User from '../models/user.js';

// Usage: authorize('admin') or authorize('admin','moderator')
const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ code: 'AuthError', message: 'Unauthorized' });
      }
      const user = await User.findById(userId).lean();
      if (!user) {
        return res.status(401).json({ code: 'AuthError', message: 'User not found' });
      }
      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({ code: 'Forbidden', message: 'Insufficient permissions' });
      }
      return next();
    } catch (err) {
      return res.status(500).json({ code: 'ServerError', message: 'Authorization error', error: err.message });
    }
  };
};

export default authorize;
