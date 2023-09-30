const mongoose = require('mongoose');

const schemaUser = new mongoose.Schema({
  token: String ,
  user: String,
  pass: String,
  role: String,
});

const modelUser =  mongoose.model('User', schemaUser); 

module.exports = modelUser