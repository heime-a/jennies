/* eslint-disable no-console */

'use strict;';

require('dotenv').config();
require('leaked-handles');

// eslint-disable-next-line no-unused-vars
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

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
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

module.exports = app;