const express = require('express');
const router = express.Router();
const { ConfigBasic, ConfigColors, ConfigLinks, GetConfigBasic } = require('../controllers/configBasic');
const { AddProduct, getAllProducts, deleteProduct, updateProduct } = require('../controllers/addProduct');
const { verifyUser, createUser, login, getUsers,removeUser } = require('../controllers/user');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images')); // Ruta donde se guardarán las imágenes en el servidor
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Nombre del archivo en el servidor
  }
});

/* GET home page. */
router.post('/addProduct', upload.fields([
  { name: 'photo1', maxCount: 1 },
  { name: 'photo2', maxCount: 1 },
  { name: 'photo3', maxCount: 1 },
  { name: 'photo4', maxCount: 1 }]), AddProduct);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/type', GetConfigBasic);

router.post('/login', login)

router.get('/product', getAllProducts)


module.exports = router;
