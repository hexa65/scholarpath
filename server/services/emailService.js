const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

exports.sendEmail = async ({ to, subject, html, text }) => {
  try {
    await transporter.sendMail({ from: `"ScholarPath" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`, to, subject, html, text });
  } catch (err) {
    console.error('Email send error:', err.message);
    // Don't throw — log and continue
  }
};

exports.sendDeadlineReminder = async (user, scholarship) => {
  const daysLeft = Math.ceil((new Date(scholarship.deadline) - new Date()) / 86400000);
  await exports.sendEmail({
    to: user.email,
    subject: `⏰ ${daysLeft} days left: ${scholarship.title}`,
    html: `<h2>Deadline Reminder</h2><p>Hi ${user.name},</p><p>The scholarship <strong>${scholarship.title}</strong> closes in <strong>${daysLeft} days</strong>.</p><a href="${process.env.CLIENT_URL}/scholarships/${scholarship._id}">View & Apply →</a>`,
  });
};
