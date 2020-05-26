const app = require('./server.js')
const port = process.env.PORT || 5000;
const dburl = process.env.DBURL || 'mongodb://127.0.0.1/jennies';
const mongoose = require('mongoose');

// eslint-disable-next-line func-names
(async function () {
  try {
    console.log(`Connecting to ${dburl}`);
    await mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`Connected to ${dburl}`);
    app.listen(port, () => console.log(`SimplErp listening on ${port}`));
  }
  catch (err) {
    console.error(`Could not Connect to mongodb at ${dburl} Exiting server...`);
    process.exit(1);
  }
}());
