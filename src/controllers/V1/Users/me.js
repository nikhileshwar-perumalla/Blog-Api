import User from '../../../../models/user.js';

export const getMe = async (req, res) => {
  try {
    const me = await User.findById(req.user.id).lean();
    if (!me) return res.status(404).json({ code: 'NotFound', message: 'User not found' });
    const { password, ...safe } = me;
    return res.status(200).json({ user: safe });
  } catch (err) {
    return res.status(500).json({ code: 'ServerError', message: 'Failed to get user', error: err.message });
  }
};

export const updateMe = async (req, res) => {
  try {
    const allowed = ['username', 'firstname', 'lastname', 'sociallinks'];
    const update = {};
    for (const key of allowed) if (req.body[key] !== undefined) update[key] = req.body[key];
    const me = await User.findByIdAndUpdate(req.user.id, update, { new: true }).lean();
    if (!me) return res.status(404).json({ code: 'NotFound', message: 'User not found' });
    const { password, ...safe } = me;
    return res.status(200).json({ user: safe });
  } catch (err) {
    return res.status(500).json({ code: 'ServerError', message: 'Failed to update user', error: err.message });
  }
};

export const deleteMe = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({ code: 'ServerError', message: 'Failed to delete user', error: err.message });
  }
};

export default { getMe, updateMe, deleteMe };
