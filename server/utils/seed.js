require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const { Scholarship } = require('../models');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected');

  // Create admin
  let admin = await User.findOne({ email: 'admin@scholarpath.com' });
  if (!admin) {
    admin = await User.create({ name: 'Admin', email: 'admin@scholarpath.com', password: 'Admin@1234', role: 'admin', isVerified: true });
    console.log('Admin created: admin@scholarpath.com / Admin@1234');
  }

  // Create sample org
  let org = await User.findOne({ email: 'org@commonwealthscholarship.com' });
  if (!org) {
    org = await User.create({ name: 'Commonwealth Scholarship Commission', email: 'org@commonwealthscholarship.com', password: 'Org@1234', role: 'organization', isVerified: true, orgProfile: { verified: true, description: 'The Commonwealth Scholarship Commission (CSC) provides scholarships for students from Commonwealth countries.' } });
    console.log('Org created');
  }

  // Scholarships
  const count = await Scholarship.countDocuments();
  if (count === 0) {
    await Scholarship.insertMany([
      { title: 'Commonwealth Masters Scholarship', organization: org._id, orgName: org.name, description: 'Full scholarships for postgraduate students from Commonwealth countries to study in the UK.', deadline: new Date(Date.now() + 45 * 86400000), level: 'Masters', field: 'Any', country: 'UK', fundingType: 'Fully Funded', amount: '£28,000/yr', eligibility: ['Commonwealth citizen', 'Bachelors degree 2:1 or above', 'Unable to access scholarship in home country'], benefits: ['Full tuition', 'Living allowance', 'Return flights'], requiredDocs: ['Transcripts', 'References', 'Personal statement'], tags: ['commonwealth', 'UK', 'masters'] },
      { title: 'Gates Cambridge Scholarship', organization: org._id, orgName: 'Gates Foundation', description: 'Prestigious full-cost awards for outstanding applicants from outside the UK.', deadline: new Date(Date.now() + 12 * 86400000), level: 'PhD', field: 'Any', country: 'UK', fundingType: 'Fully Funded', amount: '£50,000/yr', eligibility: ['Non-UK citizen', 'Strong academic record'], benefits: ['Full tuition', 'Living allowance', 'Flights', 'Research funding'], requiredDocs: ['CV', 'Research proposal', 'Three references'], tags: ['gates', 'cambridge', 'PhD'] },
      { title: 'Chevening Scholarship', organization: org._id, orgName: 'UK Foreign Office', description: 'Chevening scholarships fund one year taught Masters degree at any UK university.', deadline: new Date(Date.now() + 28 * 86400000), level: 'Masters', field: 'Any', country: 'UK', fundingType: 'Fully Funded', amount: '£25,000/yr', eligibility: ['Eligible country citizen', '2 years work experience', 'Bachelors degree'], benefits: ['Tuition', 'Monthly stipend', 'Travel grants', 'Networking events'], requiredDocs: ['Transcripts', 'Work experience proof', 'IELTS'], tags: ['chevening', 'UK', 'leadership'] },
      { title: 'DAAD Scholarship Germany', organization: org._id, orgName: 'DAAD', description: 'DAAD scholarships for international students in engineering and sciences at German universities.', deadline: new Date(Date.now() + 35 * 86400000), level: 'Masters', field: 'Engineering', country: 'Germany', fundingType: 'Fully Funded', amount: '€1,000/mo', eligibility: ['Bachelor in relevant field', 'Above-average grades'], benefits: ['Monthly stipend', 'Research allowance', 'Health insurance'], requiredDocs: ['Transcripts', 'Language certificate', 'Motivation letter'], tags: ['DAAD', 'Germany', 'engineering'] },
    ]);
    console.log('Sample scholarships seeded');
  }

  console.log('Seed complete!');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
