const express = require('express');
const { GetConfigBasic } = require('../controllers/configBasic');
const { getAllProducts } = require('../controllers/addProduct');
const router = express.Router();

const {login} = require('../controllers/user')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/type', GetConfigBasic);

router.post('/login', login)

router.get('/product', getAllProducts)


module.exports = router;
