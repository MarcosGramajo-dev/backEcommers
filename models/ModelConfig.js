const mongoose = require('mongoose');

const schemaConfig = new mongoose.Schema({
  type: { type: String, required: true },
});

const modelConfig =  mongoose.model('configurations', schemaConfig); 

module.exports =  modelConfig