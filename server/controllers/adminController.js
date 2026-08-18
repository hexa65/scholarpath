const User = require('../models/User');
const { Scholarship, Application, Question, Report, Notification } = require('../models');

// GET /api/admin/stats
exports.platformStats = async (req, res, next) => {
  try {
    const [users, orgs, scholarships, applications, questions, reports] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'organization' }),
      Scholarship.countDocuments(),
      Application.countDocuments(),
      Question.countDocuments(),
      Report.countDocuments({ status: 'pending' }),
    ]);

    const recentUsers = await User.find().sort('-createdAt').limit(5).select('name email role createdAt');
    const topScholarships = await Scholarship.find().sort('-views').limit(5).select('title orgName views bookmarks');

    // Applications per status
    const statusBreakdown = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({ users, orgs, scholarships, applications, questions, pendingReports: reports, recentUsers, topScholarships, statusBreakdown });
  } catch (err) { next(err); }
};

// GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort('-createdAt').skip((page-1)*limit).limit(Number(limit)),
      User.countDocuments(query),
    ]);
    res.json({ users, total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// PATCH /api/admin/users/:id/role
exports.updateRole = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id)
      return res.status(400).json({ message: 'Cannot change your own role' });
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id)
      return res.status(400).json({ message: 'Cannot delete yourself' });
    await User.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ student: req.params.id });
    res.json({ message: 'User deleted' });
  } catch (err) { next(err); }
};

// GET /api/admin/scholarships
exports.getScholarships = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const [scholarships, total] = await Promise.all([
      Scholarship.find(query).populate('organization', 'name email').sort('-createdAt').skip((page-1)*limit).limit(Number(limit)),
      Scholarship.countDocuments(query),
    ]);
    res.json({ scholarships, total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// PATCH /api/admin/scholarships/:id/status
exports.moderateScholarship = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    const s = await Scholarship.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!s) return res.status(404).json({ message: 'Not found' });

    // Notify org
    const msg = status === 'closed'
      ? `Your scholarship "${s.title}" has been suspended by admin${reason ? ': ' + reason : ''}.`
      : `Your scholarship "${s.title}" status updated to: ${status}`;
    await Notification.create({ recipient: s.organization, type: 'system', message: msg });

    res.json(s);
  } catch (err) { next(err); }
};

// GET /api/admin/applications
exports.getApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const apps = await Application.find(query)
      .populate('student', 'name email')
      .populate('scholarship', 'title orgName deadline')
      .sort('-createdAt').skip((page-1)*limit).limit(Number(limit));
    const total = await Application.countDocuments(query);
    res.json({ applications: apps, total, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// GET /api/admin/reports
exports.getReports = async (req, res, next) => {
  try {
    const reports = await Report.find().populate('reportedBy', 'name email').sort('-createdAt');
    res.json(reports);
  } catch (err) { next(err); }
};

// PATCH /api/admin/reports/:id
exports.resolveReport = async (req, res, next) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) { next(err); }
};

// PATCH /api/admin/orgs/:id/verify
exports.verifyOrg = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'organization' },
      { 'orgProfile.verified': true },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'Organization not found' });

    await Notification.create({ recipient: user._id, type: 'system', message: '🎉 Your organization has been verified on ScholarPath!' });
    res.json(user);
  } catch (err) { next(err); }
};

// GET /api/admin/activity
exports.activityLog = async (req, res, next) => {
  try {
    const [recentApps, recentUsers, recentScholarships] = await Promise.all([
      Application.find().sort('-createdAt').limit(10).populate('student','name').populate('scholarship','title'),
      User.find().sort('-createdAt').limit(10).select('name email role createdAt'),
      Scholarship.find().sort('-createdAt').limit(10).select('title orgName status createdAt'),
    ]);
    res.json({ recentApps, recentUsers, recentScholarships });
  } catch (err) { next(err); }
};
