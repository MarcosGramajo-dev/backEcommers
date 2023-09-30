const express = require('express');
const router = express.Router();
const { ConfigBasic, ConfigColors, ConfigLinks } = require('../controllers/configBasic');
const { AddProduct, getAllProducts, deleteProduct, updateProduct } = require('../controllers/addProduct');
const { verifyUser, createUser, login, getUsers,removeUser } = require('../controllers/user');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;

          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images')); // Ruta donde se guardarán las imágenes en el servidor
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Nombre del archivo en el servidor
  }
});
const upload = multer({ storage });

router.get('/', (req, res) => {
  try {

    res.send(200).json({message: "Verificacion correcta"})
    
  } catch (error) {
    res.send(404).json({error: "Verificacion incorrecta"})
  }
});
router.post('/config', upload.single('logo'), ConfigBasic);
router.post('/config/colors', upload.single('logo'), ConfigColors);

router.post('/config/links', upload.single('logo'), ConfigLinks);

router.post('/addProduct', upload.fields([
  { name: 'photo1', maxCount: 1 },
  { name: 'photo2', maxCount: 1 },
  { name: 'photo3', maxCount: 1 },
  { name: 'photo4', maxCount: 1 }]), AddProduct);

router.post('/updateProduct', upload.fields([
  { name: 'photo1', maxCount: 1 },
  { name: 'photo2', maxCount: 1 },
  { name: 'photo3', maxCount: 1 },
  { name: 'photo4', maxCount: 1 }]), updateProduct);

  
  
  
router.get('/table', getAllProducts);

router.get('/deleteProduct/:idProduct', deleteProduct);

router.post('/create/user', upload.single('logo'), createUser)



router.get('/users', getUsers)

router.get('/user/delete/:id', removeUser)


  
module.exports = router;
