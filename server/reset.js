require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      await mongoose.connection.collection('portfolios').drop();
      console.log('Successfully DROPPED portfolios collection');
    } catch(e) {
      console.log('Collection might not exist, proceeding...', e.message);
      await mongoose.connection.collection('portfolios').deleteMany({});
    }
    process.exit(0);
  });
