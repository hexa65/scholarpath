// ────────────────────────────────────────────────────────
// models/User.js
// ────────────────────────────────────────────────────────
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  role:     { type: String, enum: ['student','organization','admin'], default: 'student' },
  isVerified:   { type: Boolean, default: false },
  verifyToken:  String,
  resetToken:   String,
  resetTokenExpiry: Date,
  avatar:   { type: String, default: '' },
  profile: {
    country:      String,
    bio:          String,
    gpa:          Number,
    level:        { type: String, enum: ['Undergraduate','Masters','PhD','Postdoctoral'] },
    fieldOfStudy: String,
    skills:       [String],
    destination:  String,
    linkedin:     String,
    website:      String,
  },
  // Organization-specific
  orgProfile: {
    description: String,
    website:     String,
    verified:    { type: Boolean, default: false },
    logo:        String,
  },
  bookmarks:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship' }],
  documents:  [{ filename: String, path: String, type: String, uploadedAt: Date }],
  lastLogin:  Date,
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function(plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.toSafeJSON = function() {
  const obj = this.toObject();
  delete obj.password; delete obj.verifyToken; delete obj.resetToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
