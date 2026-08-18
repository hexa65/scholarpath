const router = require('express').Router();
const c = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile',         protect, c.getProfile);
router.put('/profile',         protect, c.updateProfile);
router.put('/password',        protect, c.changePassword);
router.get('/bookmarks',       protect, c.getBookmarks);
router.get('/dashboard-stats', protect, c.dashboardStats);

module.exports = router;
