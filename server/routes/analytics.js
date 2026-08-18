const router = require('express').Router();
const c = require('../controllers/mainController');
const { protect, role } = require('../middleware/auth');

router.get('/org',   protect, role('organization'), c.orgAnalytics);
router.get('/admin', protect, role('admin'),        c.adminAnalytics);

module.exports = router;
