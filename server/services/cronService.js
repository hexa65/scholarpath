const cron = require('node-cron');
const { Scholarship, Application, Notification } = require('../models');
const User = require('../models/User');
const { sendDeadlineReminder } = require('./emailService');

// Runs every day at 8am
const startDeadlineCron = () => cron.schedule('0 8 * * *', async () => {
  console.log('[CRON] Running deadline check...');
  try {
    const thresholds = [30, 14, 7, 3]; // days before deadline to notify
    const now = new Date();

    for (const days of thresholds) {
      const target = new Date(now.getTime() + days * 86400000);
      const dateStr = target.toISOString().split('T')[0];

      const scholarships = await Scholarship.find({
        deadline: { $gte: new Date(dateStr + 'T00:00:00'), $lt: new Date(dateStr + 'T23:59:59') },
        status: 'active',
      });

      for (const s of scholarships) {
        // Get students who bookmarked this scholarship
        const users = await User.find({ bookmarks: s._id });
        for (const user of users) {
          await Notification.create({ recipient: user._id, type: 'deadline', message: `⏰ ${days} days left to apply for "${s.title}"`, link: `/scholarships/${s._id}` });
          if (days <= 7) await sendDeadlineReminder(user, s);
        }
      }
    }
  } catch (err) { console.error('[CRON] Error:', err); }
});

module.exports = { startDeadlineCron };
