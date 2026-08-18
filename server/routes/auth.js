// routes/auth.js
const router = require('express').Router();
const c = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register',               c.register);
router.post('/login',                  c.login);
router.get('/verify/:token',           c.verifyEmail);
router.post('/forgot-password',        c.forgotPassword);
router.post('/reset-password/:token',  c.resetPassword);
router.get('/me',          protect,    c.getMe);

module.exports = router;
