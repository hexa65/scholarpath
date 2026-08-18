const router = require('express').Router();
const { sendEmail } = require('../services/emailService');

// POST /api/contact
router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    // Send notification to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `[ScholarPath Contact] ${subject || 'New message'} — from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'Not specified'}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Send acknowledgement to user
    await sendEmail({
      to: email,
      subject: 'We received your message — ScholarPath',
      html: `
        <h2>Thanks for contacting us, ${name.split(' ')[0]}!</h2>
        <p>We've received your message and will get back to you within 24 hours on business days.</p>
        <p>Here's a copy of what you sent:</p>
        <blockquote style="border-left:3px solid #123E63;padding-left:16px;color:#555">${message}</blockquote>
        <p>— The ScholarPath Team</p>
      `,
    });

    res.json({ message: 'Message sent successfully' });
  } catch (err) { next(err); }
});

module.exports = router;
