const { Scholarship, Application, Notification } = require('../models');
const User = require('../models/User');

// GET /api/scholarships
exports.getAll = async (req, res, next) => {
  try {
    const { keyword, field, level, country, fundingType, page = 1, limit = 12, sort = 'createdAt' } = req.query;
    const query = { status: 'active' };

    if (keyword) query.$text = { $search: keyword };
    if (field && field !== 'Any') query.field = { $regex: field, $options: 'i' };
    if (level && level !== 'Any') query.level = level;
    if (country) query.country = { $regex: country, $options: 'i' };
    if (fundingType) query.fundingType = fundingType;

    const sortMap = { deadline: 'deadline', views: '-views', createdAt: '-createdAt' };
    const sortField = sortMap[sort] || '-createdAt';

    const total = await Scholarship.countDocuments(query);
    const scholarships = await Scholarship.find(query)
      .sort(sortField).skip((page - 1) * limit).limit(Number(limit))
      .populate('organization', 'name orgProfile.logo');

    res.json({ scholarships, total, pages: Math.ceil(total / limit), current: Number(page) });
  } catch (err) { next(err); }
};

// GET /api/scholarships/:id
exports.getOne = async (req, res, next) => {
  try {
    const s = await Scholarship.findById(req.params.id).populate('organization', 'name orgProfile');
    if (!s) return res.status(404).json({ message: 'Scholarship not found' });
    await Scholarship.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json(s);
  } catch (err) { next(err); }
};

// POST /api/scholarships (org only)
exports.create = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const s = await Scholarship.create({ ...req.body, organization: req.user.id, orgName: user.name });
    res.status(201).json(s);
  } catch (err) { next(err); }
};

// PUT /api/scholarships/:id
exports.update = async (req, res, next) => {
  try {
    const s = await Scholarship.findOne({ _id: req.params.id, organization: req.user.id });
    if (!s) return res.status(404).json({ message: 'Not found or unauthorized' });
    Object.assign(s, req.body);
    await s.save();
    res.json(s);
  } catch (err) { next(err); }
};

// DELETE /api/scholarships/:id
exports.remove = async (req, res, next) => {
  try {
    const s = await Scholarship.findOneAndDelete({ _id: req.params.id, organization: req.user.id });
    if (!s) return res.status(404).json({ message: 'Not found or unauthorized' });
    res.json({ message: 'Scholarship deleted' });
  } catch (err) { next(err); }
};

// POST /api/scholarships/match — Eligibility Matching Algorithm
exports.match = async (req, res, next) => {
  try {
    const { country, gpa, level, field, destination, fundingType, skills } = req.body;
    const scholarships = await Scholarship.find({ status: 'active' });

    const scored = scholarships.map(s => {
      let score = 0;
      const reasons = [];

      // Level match (30 pts)
      if (s.level === 'Any' || s.level === level) { score += 30; reasons.push('level match'); }
      else score += 5;

      // Field match (25 pts)
      const fieldMatch = s.field === 'Any' || s.field.toLowerCase().includes(field.toLowerCase()) || field.toLowerCase().includes(s.field.toLowerCase());
      if (fieldMatch) { score += 25; reasons.push('field match'); }
      else score += 5;

      // Country/destination match (20 pts)
      if (!destination || destination === 'Any Country' || s.country.toLowerCase().includes(destination.toLowerCase())) {
        score += 20; reasons.push('destination match');
      } else score += 5;

      // Funding type (15 pts)
      if (!fundingType || fundingType === 'Any' || s.fundingType === fundingType) {
        score += 15; reasons.push('funding match');
      } else score += 5;

      // GPA boost (10 pts)
      if (gpa >= 3.5) { score += 10; reasons.push('strong GPA'); }
      else if (gpa >= 3.0) score += 5;

      // Normalise to 0–100
      const pct = Math.min(99, Math.round(score));
      return { scholarship: s, pct, reasons, confidence: pct >= 80 ? 'high' : pct >= 60 ? 'medium' : 'low' };
    });

    scored.sort((a, b) => b.pct - a.pct);
    res.json(scored.slice(0, 20));
  } catch (err) { next(err); }
};

// GET /api/scholarships/org/mine (org dashboard)
exports.getMine = async (req, res, next) => {
  try {
    const scholarships = await Scholarship.find({ organization: req.user.id });
    res.json(scholarships);
  } catch (err) { next(err); }
};

// GET /api/scholarships/:id/applicants
exports.getApplicants = async (req, res, next) => {
  try {
    const s = await Scholarship.findOne({ _id: req.params.id, organization: req.user.id });
    if (!s && req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
    const { Application } = require('../models');
    const apps = await Application.find({ scholarship: req.params.id })
      .populate('student', 'name email profile avatar');
    res.json(apps);
  } catch (err) { next(err); }
};

// POST /api/scholarships/:id/bookmark
exports.toggleBookmark = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const id = req.params.id;
    const idx = user.bookmarks.indexOf(id);
    if (idx > -1) { user.bookmarks.splice(idx, 1); await Scholarship.findByIdAndUpdate(id, { $inc: { bookmarks: -1 } }); }
    else { user.bookmarks.push(id); await Scholarship.findByIdAndUpdate(id, { $inc: { bookmarks: 1 } }); }
    await user.save();
    res.json({ bookmarks: user.bookmarks });
  } catch (err) { next(err); }
};
