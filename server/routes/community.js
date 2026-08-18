const router = require('express').Router();
const c = require('../controllers/mainController');
const { protect } = require('../middleware/auth');

router.get('/',               c.getQuestions);
router.post('/',     protect, c.createQuestion);
router.post('/:id/answer', protect, c.addAnswer);
router.post('/:id/upvote', protect, c.upvote);

module.exports = router;
