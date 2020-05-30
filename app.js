
const mongoose = require('mongoose');
const app = require('./server.js');

const port = process.env.PORT || 5000;
const dburl = process.env.DBURL || 'mongodb://127.0.0.1/jennies';

// eslint-disable-next-line func-names
(async function () {
  try {
    // eslint-disable-next-line no-console
    console.log(`Connecting to ${dburl}`);
    await mongoose.connect(dburl,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
    // eslint-disable-next-line no-console
    console.log(`Connected to ${dburl}`);
    // eslint-disable-next-line no-console
    app.listen(port, () => console.log(`SimplErp listening on ${port}`));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Could not Connect to mongodb at ${dburl} Exiting server...`);
    process.exit(1);
  }
}());
