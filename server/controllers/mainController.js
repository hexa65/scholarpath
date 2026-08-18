const { Application, Notification, Question, Scholarship } = require('../models');
const User = require('../models/User');

// ── APPLICATIONS ─────────────────────────────────────────

exports.apply = async (req, res, next) => {
  try {
    const exists = await Application.findOne({ student: req.user.id, scholarship: req.params.id });
    if (exists) return res.status(400).json({ message: 'Already applied' });

    const s = await Scholarship.findById(req.params.id);
    if (!s) return res.status(404).json({ message: 'Scholarship not found' });
    if (new Date(s.deadline) < new Date()) return res.status(400).json({ message: 'Deadline has passed' });

    const app = await Application.create({ student: req.user.id, scholarship: req.params.id, ...req.body });

    // Notify the org
    await Notification.create({ recipient: s.organization, type: 'application_update', message: `New application for "${s.title}"`, link: `/org/applications/${app._id}` });
    req.app.get('io')?.to(`user:${s.organization}`).emit('notification', { message: `New application for "${s.title}"` });

    res.status(201).json(app);
  } catch (err) { next(err); }
};

exports.myApplications = async (req, res, next) => {
  try {
    const apps = await Application.find({ student: req.user.id }).populate('scholarship');
    res.json(apps);
  } catch (err) { next(err); }
};

exports.getScholarshipApplicants = async (req, res, next) => {
  try {
    const s = await Scholarship.findOne({ _id: req.params.id, organization: req.user.id });
    if (!s) return res.status(403).json({ message: 'Unauthorized' });
    const apps = await Application.find({ scholarship: req.params.id }).populate('student', 'name email profile');
    res.json(apps);
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const app = await Application.findById(req.params.id).populate('scholarship');
    if (!app) return res.status(404).json({ message: 'Not found' });
    if (String(app.scholarship.organization) !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    app.status = req.body.status;
    app.reviewedBy = req.user.id;
    app.reviewedAt = new Date();
    await app.save();

    const statusLabels = { accepted: 'Congratulations! Your application was accepted 🎉', rejected: 'Your application was not selected', under_review: 'Your application is now under review' };
    await Notification.create({ recipient: app.student, type: 'application_update', message: statusLabels[app.status] || `Application status updated: ${app.status}`, link: `/dashboard/applications` });
    req.app.get('io')?.to(`user:${app.student}`).emit('notification', { message: statusLabels[app.status] });

    res.json(app);
  } catch (err) { next(err); }
};

// ── NOTIFICATIONS ─────────────────────────────────────────

exports.getNotifications = async (req, res, next) => {
  try {
    const notifs = await Notification.find({ recipient: req.user.id }).sort('-createdAt').limit(50);
    res.json(notifs);
  } catch (err) { next(err); }
};

exports.markRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user.id, read: false }, { read: true });
    res.json({ message: 'All marked as read' });
  } catch (err) { next(err); }
};

// ── COMMUNITY ─────────────────────────────────────────────

exports.getQuestions = async (req, res, next) => {
  try {
    const { tag, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (tag) query.tags = tag;
    if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { content: { $regex: search, $options: 'i' } }];
    const questions = await Question.find(query).sort('-createdAt').skip((page-1)*limit).limit(Number(limit)).populate('author', 'name role');
    res.json(questions);
  } catch (err) { next(err); }
};

exports.createQuestion = async (req, res, next) => {
  try {
    const q = await Question.create({ ...req.body, author: req.user.id });
    res.status(201).json(q);
  } catch (err) { next(err); }
};

exports.addAnswer = async (req, res, next) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ message: 'Question not found' });
    q.answers.push({ author: req.user.id, content: req.body.content });
    await q.save();
    res.json(q);
  } catch (err) { next(err); }
};

exports.upvote = async (req, res, next) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ message: 'Not found' });
    const idx = q.upvotes.indexOf(req.user.id);
    if (idx > -1) q.upvotes.splice(idx, 1);
    else q.upvotes.push(req.user.id);
    await q.save();
    res.json({ upvotes: q.upvotes.length });
  } catch (err) { next(err); }
};

// ── ANALYTICS ─────────────────────────────────────────────

exports.orgAnalytics = async (req, res, next) => {
  try {
    const scholarships = await Scholarship.find({ organization: req.user.id });
    const ids = scholarships.map(s => s._id);
    const totalApps = await Application.countDocuments({ scholarship: { $in: ids } });
    const accepted  = await Application.countDocuments({ scholarship: { $in: ids }, status: 'accepted' });
    const pending   = await Application.countDocuments({ scholarship: { $in: ids }, status: 'pending' });
    const views     = scholarships.reduce((sum, s) => sum + s.views, 0);
    const bookmarks = scholarships.reduce((sum, s) => sum + s.bookmarks, 0);
    res.json({ scholarships: scholarships.length, totalApps, accepted, pending, views, bookmarks });
  } catch (err) { next(err); }
};

exports.adminAnalytics = async (req, res, next) => {
  try {
    const [users, scholarships, applications, questions] = await Promise.all([
      User.countDocuments(), Scholarship.countDocuments(), Application.countDocuments(), Question.countDocuments(),
    ]);
    res.json({ users, scholarships, applications, questions });
  } catch (err) { next(err); }
};
