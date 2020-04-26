/* eslint-disable no-console */

'use strict;';

require('dotenv').config();


const port = process.env.PORT || 5000;
const secret = process.env.SECRET || 'some secret passphrase here for local development';
const dburl = process.env.DBURL || 'mongodb://127.0.0.1/jennies';
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const indexRouter = require('./routes/index');
const purchaseOrdersRouter = require('./routes/purchaseorders');
const ingredientsRouter = require('./routes/ingredients');
const inventoryRouter = require('./routes/inventory');
const recipesRouter = require('./routes/recipes');
const workorderRouter = require('./routes/workorders');
const productinventoryRouter = require('./routes/productInventory');
const customerorderRouter = require('./routes/customerorders');
const authRouter = require('./routes/auth.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use(cookieParser());

mongoose.connect(dburl, { useNewUrlParser: true });
console.log(`Connecting to ${dburl}`);
app.use('/', indexRouter);
app.use('/purchaseOrders', purchaseOrdersRouter);
app.use('/ingredients', ingredientsRouter);
app.use('/inventory', inventoryRouter);
app.use('/recipes', recipesRouter);
app.use('/workorders', workorderRouter);
app.use('/productInventory', productinventoryRouter);
app.use('/customerOrders', customerorderRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});
app.listen(port, () => console.log(`SimplErp listening on ${port}`));
