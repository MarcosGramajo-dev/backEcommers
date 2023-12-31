var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var DB = require('./DB');
var dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const {verifyUser} = require('./controllers/user')
//import {v2 as cloudinary} from 'cloudinary';

dotenv.config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var configRouter = require('./routes/Config');

var app = express();

const corsOptions = {
  origin: '*', // Permitir solicitudes desde este origen
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
  credentials: true, // Permitir enviar cookies y encabezados de autenticación
};


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors(corsOptions));

app.use('/', indexRouter);
app.use('/auth',verifyUser, configRouter);

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
