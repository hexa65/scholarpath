const { Router } = require('express');
const { protect, role } = require('../middleware/auth');
const s = require('../controllers/scholarshipController');
const m = require('../controllers/mainController');
const multer = require('multer');
const path = require('path');

// ── File Upload Config ──────────────────────────────────
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, 'uploads/'),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s/g,'-')}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = ['.pdf','.doc','.docx','.jpg','.jpeg','.png'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Invalid file type'));
  },
});

// ── Scholarships ─────────────────────────────────────────
const schRouter = Router();
schRouter.get('/',             s.getAll);
schRouter.post('/match',       protect, s.match);
schRouter.get('/org/mine',     protect, role('organization'), s.getMine);
schRouter.get('/:id',          s.getOne);
schRouter.post('/',            protect, role('organization','admin'), s.create);
schRouter.put('/:id',          protect, role('organization','admin'), s.update);
schRouter.delete('/:id',       protect, role('organization','admin'), s.remove);
schRouter.post('/:id/bookmark',protect, s.toggleBookmark);
schRouter.get('/:id/applicants',protect,role('organization','admin'), m.getScholarshipApplicants);

// ── Applications ─────────────────────────────────────────
const appRouter = Router();
appRouter.post('/:id/apply',  protect, m.apply);
appRouter.get('/mine',        protect, m.myApplications);
appRouter.patch('/:id/status',protect, role('organization','admin'), m.updateStatus);

// ── Notifications ─────────────────────────────────────────
const notifRouter = Router();
notifRouter.get('/',           protect, m.getNotifications);
notifRouter.post('/read',      protect, m.markRead);

// ── Community ─────────────────────────────────────────────
const communityRouter = Router();
communityRouter.get('/',       m.getQuestions);
communityRouter.post('/',      protect, m.createQuestion);
communityRouter.post('/:id/answer',  protect, m.addAnswer);
communityRouter.post('/:id/upvote', protect, m.upvote);

// ── Uploads ───────────────────────────────────────────────
const uploadRouter = Router();
uploadRouter.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ filename: req.file.filename, path: `/uploads/${req.file.filename}` });
});

// ── Analytics ─────────────────────────────────────────────
const analyticsRouter = Router();
analyticsRouter.get('/org',   protect, role('organization'), m.orgAnalytics);
analyticsRouter.get('/admin', protect, role('admin'),        m.adminAnalytics);

// ── Users ─────────────────────────────────────────────────
const User = require('../models/User');
const userRouter = Router();
userRouter.put('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { $set: { profile: req.body } }, { new: true });
    res.json(user.toSafeJSON());
  } catch(e) { next(e); }
});

// ── Admin ─────────────────────────────────────────────────
const { Scholarship, Application, Question, Report } = require('../models');
const adminRouter = Router();
adminRouter.use(protect, role('admin'));
adminRouter.get('/users', async (_, res, next) => {
  try { res.json(await User.find().select('-password')); } catch(e) { next(e); }
});
adminRouter.patch('/users/:id/role', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    res.json(user.toSafeJSON());
  } catch(e) { next(e); }
});
adminRouter.get('/scholarships', async (_, res, next) => {
  try { res.json(await Scholarship.find().populate('organization','name')); } catch(e) { next(e); }
});
adminRouter.patch('/scholarships/:id/status', async (req, res, next) => {
  try {
    const s = await Scholarship.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(s);
  } catch(e) { next(e); }
});
adminRouter.get('/reports', async (_, res, next) => {
  try { res.json(await Report.find().populate('reportedBy','name')); } catch(e) { next(e); }
});
adminRouter.patch('/orgs/:id/verify', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { 'orgProfile.verified': true }, { new: true });
    res.json(user.toSafeJSON());
  } catch(e) { next(e); }
});

module.exports = { schRouter, appRouter, notifRouter, communityRouter, uploadRouter, analyticsRouter, userRouter, adminRouter };
