const mongoose = require('mongoose');

// ── Scholarship ─────────────────────────────────────────
const scholarshipSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orgName:      { type: String, required: true },
  description:  { type: String, required: true },
  deadline:     { type: Date, required: true },
  level:        { type: String, enum: ['Undergraduate','Masters','PhD','Postdoctoral','Any'], required: true },
  field:        { type: String, required: true },
  country:      { type: String, required: true },
  fundingType:  { type: String, enum: ['Fully Funded','Partial','Stipend Only'], required: true },
  amount:       { type: String, required: true },
  eligibility:  [String],
  benefits:     [String],
  requiredDocs: [String],
  logo:         String,
  banner:       String,
  status:       { type: String, enum: ['draft','active','closed'], default: 'active' },
  views:        { type: Number, default: 0 },
  bookmarks:    { type: Number, default: 0 },
  tags:         [String],
}, { timestamps: true });

scholarshipSchema.index({ title: 'text', description: 'text', orgName: 'text' });

// ── Application ─────────────────────────────────────────
const applicationSchema = new mongoose.Schema({
  student:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scholarship:  { type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship', required: true },
  status:       { type: String, enum: ['pending','under_review','accepted','rejected'], default: 'pending' },
  documents:    [{ type: String, label: String }],
  statement:    String,
  notes:        String,
  reviewedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt:   Date,
}, { timestamps: true });

// ── Notification ────────────────────────────────────────
const notificationSchema = new mongoose.Schema({
  recipient:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:       { type: String, enum: ['application_update','deadline','recommendation','community','system'] },
  message:    { type: String, required: true },
  link:       String,
  read:       { type: Boolean, default: false },
  meta:       mongoose.Schema.Types.Mixed,
}, { timestamps: true });

// ── Community Question ───────────────────────────────────
const answerSchema = new mongoose.Schema({
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:   { type: String, required: true },
  upvotes:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isAccepted:{ type: Boolean, default: false },
}, { timestamps: true });

const questionSchema = new mongoose.Schema({
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:    { type: String, required: true },
  content:  { type: String, required: true },
  tags:     [String],
  answers:  [answerSchema],
  upvotes:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views:    { type: Number, default: 0 },
  pinned:   { type: Boolean, default: false },
  reported: { type: Boolean, default: false },
}, { timestamps: true });

// ── Report ───────────────────────────────────────────────
const reportSchema = new mongoose.Schema({
  reportedBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contentType:      { type: String, enum: ['question','answer','scholarship','user'] },
  contentReference: { type: mongoose.Schema.Types.ObjectId, required: true },
  reason:           { type: String, required: true },
  status:           { type: String, enum: ['pending','reviewed','dismissed'], default: 'pending' },
}, { timestamps: true });

module.exports = {
  Scholarship:  mongoose.model('Scholarship', scholarshipSchema),
  Application:  mongoose.model('Application', applicationSchema),
  Notification: mongoose.model('Notification', notificationSchema),
  Question:     mongoose.model('Question', questionSchema),
  Report:       mongoose.model('Report', reportSchema),
};
