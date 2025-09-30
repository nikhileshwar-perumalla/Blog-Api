import User from '../../../../models/user.js';

export const listUsers = async (_req, res) => {
  try {
    const users = await User.find({}).select('-password').lean();
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({ code: 'ServerError', message: 'Failed to list users', error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    if (!user) return res.status(404).json({ code: 'NotFound', message: 'User not found' });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ code: 'ServerError', message: 'Failed to get user', error: err.message });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({ code: 'ServerError', message: 'Failed to delete user', error: err.message });
  }
};

export default { listUsers, getUserById, deleteUserById };
