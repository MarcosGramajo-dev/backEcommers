const mongoose = require('mongoose');
const modelConfig = require('./ModelConfig');

const schemaConfigColor = new mongoose.Schema({
  type: { type: String, required: true },
  colorP: String,
  colorS: String,
});

const schemaConfigLink = new mongoose.Schema({
  type: { type: String, required: true },
  facebook: String,
  instagram: String,
  twiter: String,
  linkGoogle: String,
});

const schemaConfigBasic = new mongoose.Schema({
  type: { type: String, required: true },
  titulo: String,
  eslogan: String,
  direccion: String,
  tel: Number,
  fileName: String,
  urlImg: String,
});

const modelConfigColor = modelConfig.discriminator('configurationsColors', schemaConfigColor);
const modelConfigBasic =  modelConfig.discriminator('configurationsBasic', schemaConfigBasic); 
const modelConfigLink =  modelConfig.discriminator('configurationsLink', schemaConfigLink); 

module.exports = {modelConfigColor, modelConfigBasic, modelConfigLink}