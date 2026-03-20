require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    // Delete all documents in the portfolio collection to clear sample data
    await mongoose.connection.collection('portfolios').deleteMany({});
    console.log('Successfully wiped sample data from DB');
    process.exit(0);
  })
  .catch(err => {
    console.error('Wipe failed:', err);
    process.exit(1);
  });
