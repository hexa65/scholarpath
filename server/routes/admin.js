const router = require('express').Router();
const c = require('../controllers/adminController');
const { protect, role } = require('../middleware/auth');

router.use(protect, role('admin'));

router.get('/stats',                    c.platformStats);
router.get('/users',                    c.getUsers);
router.patch('/users/:id/role',         c.updateRole);
router.delete('/users/:id',             c.deleteUser);
router.get('/scholarships',             c.getScholarships);
router.patch('/scholarships/:id/status',c.moderateScholarship);
router.get('/applications',             c.getApplications);
router.get('/reports',                  c.getReports);
router.patch('/reports/:id',            c.resolveReport);
router.patch('/orgs/:id/verify',        c.verifyOrg);
router.get('/activity',                 c.activityLog);

module.exports = router;
