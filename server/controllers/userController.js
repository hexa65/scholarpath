const User = require('../models/User');
const { Application, Scholarship, Notification } = require('../models');

// GET /api/users/profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('bookmarks');
    res.json(user.toSafeJSON());
  } catch (err) { next(err); }
};

// PUT /api/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'avatar', 'profile', 'orgProfile'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true, runValidators: true });
    res.json(user.toSafeJSON());
  } catch (err) { next(err); }
};

// PUT /api/users/password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.comparePassword(currentPassword)))
      return res.status(400).json({ message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) { next(err); }
};

// GET /api/users/bookmarks
exports.getBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({ path: 'bookmarks', match: { status: 'active' } });
    res.json(user.bookmarks);
  } catch (err) { next(err); }
};

// GET /api/users/dashboard-stats
exports.dashboardStats = async (req, res, next) => {
  try {
    const [user, applications] = await Promise.all([
      User.findById(req.user.id),
      Application.find({ student: req.user.id }).populate('scholarship', 'title deadline'),
    ]);

    const saved = user.bookmarks.length;
    const total = applications.length;
    const accepted = applications.filter(a => a.status === 'accepted').length;
    const pending  = applications.filter(a => a.status === 'pending').length;
    const review   = applications.filter(a => a.status === 'under_review').length;

    const upcoming = applications
      .filter(a => a.scholarship?.deadline && new Date(a.scholarship.deadline) > new Date())
      .sort((a, b) => new Date(a.scholarship.deadline) - new Date(b.scholarship.deadline))
      .slice(0, 5);

    // Profile completion %
    const p = user.profile || {};
    const fields = ['country', 'bio', 'gpa', 'level', 'fieldOfStudy', 'skills', 'destination'];
    const filled = fields.filter(f => p[f] && (Array.isArray(p[f]) ? p[f].length : true)).length;
    const profileCompletion = Math.round((filled / fields.length) * 100);

    res.json({ saved, total, accepted, pending, review, upcoming, profileCompletion });
  } catch (err) { next(err); }
};
