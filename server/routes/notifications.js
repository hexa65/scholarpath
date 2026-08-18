const router = require('express').Router();
const c = require('../controllers/mainController');
const { protect } = require('../middleware/auth');

router.get('/',          protect, c.getNotifications);
router.post('/read',     protect, c.markRead);

module.exports = router;
