const schemaAddProduct = require('../models/ModelAddProduct')
const { uploadImageToCloudinary } = require('../controllers/configBasic');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const { send } = require('process');

async function updatePhotosCloudinary(idProduct, photosFront) {
    let arrayPhotosCloudinary = [];
    const findObject = await schemaAddProduct.find({ idProduct });
    // console.log(findObject);
  
    try {
      // Eliminar fotos antiguas de Cloudinary
      const deletePromises = findObject.map(async (product) => {
        const deletePhotoPromises = product.photos.map(async (element) => {
          const public_id = element.public_id;
          // Realiza la operación de eliminación en Cloudinary
          await cloudinary.uploader.destroy(`products/${public_id}`);
          console.log('Imagen antigua eliminada exitosamente:', public_id);
        });
        await Promise.all(deletePhotoPromises);
      });
      await Promise.all(deletePromises);
  
      // Subir fotos nuevas a Cloudinary
      const uploadPromises = [];
      for (const key in photosFront) {
        const photoArray = photosFront[key];
        for (const photo of photoArray) {
          const originalname = photo.originalname;
          const idPublicName = photo.originalname + findObject.idProduct;
          const photoPath = photo.path;
  
          const resultado = await cloudinary.uploader.upload(photoPath, {
            folder: 'products',
            public_id: idPublicName,
          });
  
          arrayPhotosCloudinary.push({ secure_url: resultado.secure_url, public_id: idPublicName });
  
          const filePath = path.join(process.cwd(), 'public', 'images', originalname);
  
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Error al eliminar el archivo:', err);
            } else {
              console.log('El archivo se ha eliminado con éxito.');
            }
          });
  
          uploadPromises.push(arrayPhotosCloudinary);
        }
      }
      await Promise.all(uploadPromises);
  
      return arrayPhotosCloudinary;
    } catch (error) {
      console.error('Error en la función updatePhotosCloudinary:', error);
      throw error;
    }
  }

const AddProduct = async (req, res) => {
    try {
        let {idProduct, modelo, age, km, combustible, motor, esUnSlide} = req.body;
        let arrayPhotosCloudinary = [];
        let count = 0
        let photosFront = req.files;
        console.log(photos)
        console.log(photosFront.photo1[0].originalname)

        for (const key in photosFront) {
              const photoArray = photosFront[key];
              for (const photo of photoArray) {
                const originalname = photo.originalname;
                const idPublicName = photo.originalname + idProduct
                const photoPath = photo.path;
                
                const resultado = await cloudinary.uploader.upload(photoPath, { folder: 'products', public_id: idPublicName });
                
                arrayPhotosCloudinary.push({ secure_url: resultado.secure_url, public_id: idPublicName });
                
                const filePath = path.join(process.cwd(), 'public', 'images', originalname);

                fs.unlink(filePath, (err) => {
                  if (err) {
                      console.error('Error al eliminar el archivo:', err);
                    } else {
                      console.log('El archivo se ha eliminado con éxito.');
                    }
                })

                console.log(`Key: ${key}, Originalname: ${originalname}, Path: ${path}`);
              }
          }

          console.log(arrayPhotosCloudinary)
        const updatedObject = await schemaAddProduct.findOneAndUpdate(
            { idProduct },
            {idProduct, modelo, age, km, combustible, motor, esUnSlide, photos: arrayPhotosCloudinary}, // Valores a actualizar o crear
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(201).json(updatedObject);

    } catch (error) {
        console.log(error);
        res.send({ error: 'No se pudo guardar los cambios.' }).status(400);
        
    }
}

const updateProduct = async (req, res) => {
    try {
        let {idProduct, modelo, age, km, combustible, motor, esUnSlide} = req.body;
        let arrayPhotosCloudinary = [];
        
        let photosFront = req.files;

        let stateFile = photosFront && Object.keys(photosFront).length > 0

        if( !stateFile ){

            const findObject = await schemaAddProduct.find({idProduct})

            arrayPhotosCloudinary = findObject.photos

        } else {
            arrayPhotosCloudinary = await updatePhotosCloudinary(idProduct, photosFront)
        }

        const updatedObject = await schemaAddProduct.findOneAndUpdate(
            { idProduct },
            {idProduct, modelo, age, km, combustible, motor, esUnSlide, photos: arrayPhotosCloudinary}, // Valores a actualizar o crear
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(201).json(updatedObject);

    } catch (error) {
        console.log(error);
        res.send({ error: 'No se pudo guardar los cambios.' }).status(400);
        
    }
}



const getAllProducts = async (req,res) => {
    try {
        
        const updatedObject = await schemaAddProduct.find()

        console.log(updatedObject)

        res.status(201).json(updatedObject);

    } catch (error) {
        console.log(error);
        res.send({ error: 'No se pudo traer los datos.' }).status(400);
    }
}

const deleteProduct = async (req, res) => {

    try {
        const idProduct = req.params.idProduct
        const findObject = await schemaAddProduct.findOne({idProduct})

        findObject.photos.forEach( async (element) => {
            // console.log(element.public_id)
            await cloudinary.uploader.destroy( `products/${element.public_id}` , (error, resultadoEliminacion) => {
                if (error) {
                console.error('Error al eliminar la imagen antigua de Cloudinary:', error);
                } else {
                console.log('Imagen antigua eliminada exitosamente:', resultadoEliminacion, element.public_id);
                }
            })
        })
        await schemaAddProduct.findOneAndRemove( {idProduct})
        res.status(200).send({message: 'Se elimino con exite el producto', Modelo: findObject.modelo})
    } catch (error) {
        console.log(error);
        res.send({ error: 'No se pudo eliminar el producto.' }).status(400);
        
    }

}

module.exports={ AddProduct, getAllProducts, deleteProduct, updateProduct }