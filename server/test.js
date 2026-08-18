require('dotenv').config();
const mongoose = require('mongoose');

console.log('Trying to connect to:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('SUCCESS — MongoDB connected!');
    process.exit(0);
  })
  .catch(err => {
    console.log('FAILED:', err.message);
    process.exit(1);
  });