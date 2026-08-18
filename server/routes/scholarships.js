const router = require('express').Router();
const c = require('../controllers/scholarshipController');
const { protect, role } = require('../middleware/auth');

router.get('/',                    c.getAll);
router.post('/match',     protect, c.match);
router.get('/org/mine',   protect, role('organization','admin'), c.getMine);
router.get('/:id',                 c.getOne);
router.post('/',          protect, role('organization','admin'), c.create);
router.put('/:id',        protect, role('organization','admin'), c.update);
router.delete('/:id',     protect, role('organization','admin'), c.remove);
router.post('/:id/bookmark', protect, c.toggleBookmark);
router.get('/:id/applicants', protect, role('organization','admin'), c.getApplicants);

module.exports = router;
