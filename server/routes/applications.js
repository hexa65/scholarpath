const router = require('express').Router();
const c = require('../controllers/mainController');
const { protect, role } = require('../middleware/auth');

router.post('/:id/apply',   protect, c.apply);
router.get('/mine',         protect, c.myApplications);
router.patch('/:id/status', protect, role('organization','admin'), c.updateStatus);

module.exports = router;
