const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');


const indexRouter = require('./routes/index');
const purchaseOrdersRouter = require("./routes/purchaseorders");
const ingredientsRouter = require("./routes/ingredients");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect("mongodb://localhost/jennies");

app.use('/', indexRouter);
app.use('/purchaseOrders', purchaseOrdersRouter);
app.use('/ingredients',    ingredientsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.listen(3001,'localhost',()=> console.log('app listening on 3001'));
