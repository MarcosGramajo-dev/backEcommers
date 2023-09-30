var mongoose = require('mongoose');
var dotenv = require('dotenv');
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, {
    autoIndex: true,
    dbName: 'Agencia'
  })
  .then(() => console.log('Conectado a la base de datos'))
  .catch((error) => console.log(error));