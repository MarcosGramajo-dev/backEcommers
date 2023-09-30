const mongoose = require('mongoose');

const schemaAddProduct = new mongoose.Schema({
    modelo: String,
    age: Number,
    km: Number,
    combustible: String,
    motor: String,
    idProduct: String,
    esUnSlide: Boolean,
    photos: [],
});

const modelConfig =  mongoose.model('AddProduct', schemaAddProduct); 

module.exports =  modelConfig