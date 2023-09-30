const {modelConfigColor, modelConfigBasic, modelConfigLink} = require('../models/ModelConfigBasic')
const modelConfig = require('../models/ModelConfig')
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const uploadImageToCloudinary = async (file, body) => {
    try {
      const public_id = body.fileName;
      const image_local_id = file.originalname;

      cloudinary.uploader.destroy(body.fileName, (error, resultadoEliminacion) => {
        if (error) {
          console.error('Error al eliminar la imagen antigua de Cloudinary:', error);
        } else {
          console.log('Imagen antigua eliminada exitosamente:', resultadoEliminacion);
        }
      });

      const resultado = await cloudinary.uploader.upload(file.path, { folder: 'products', public_id });

      const filePath = path.join(process.cwd(), 'public', 'images', image_local_id);

      fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error al eliminar el archivo:', err);
          } else {
            console.log('El archivo se ha eliminado con éxito.');
          }
      })
      // console.log({ secure_url: resultado.secure_url, public_id })
      return { secure_url: resultado.secure_url, public_id };
    } catch (error) {
      console.error('Error al subir o buscar la imagen en Cloudinary:', error);
      throw error;
    }
  }

const ConfigBasic = async (req, res) => {
    try{
        const { titulo, eslogan, tel, direccion, type } = req.body;

        if (!req.file) {
            const updatedObject = await modelConfigBasic.findOneAndUpdate(
                { type },
                { titulo, eslogan, tel, direccion },
                { new: true, upsert: true, setDefaultsOnInsert: true }
              );
            return res.status(201).json({ updatedObject, message: 'Se guardaron los cambios sin modificar la imagen existente' });
        }

        else{

            const imageResult = await uploadImageToCloudinary(req.file, req.body);
        
            const updatedObject = await modelConfigBasic.findOneAndUpdate(
              { type },
              { titulo, eslogan, tel, direccion, urlImg: imageResult.secure_url, fileName: imageResult.public_id },
              { new: true, upsert: true, setDefaultsOnInsert: true }
            );
            
            res.status(201).json({ updatedObject });
        }

    }
    catch (error) {
        console.error('Error al subir la imagen a Cloudinary:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}

const GetConfigBasic = async (req, res) => {
    try{

        const type = req.query.type
        // console.log(type)

        const getByType = await  modelConfig.findOne({type: type})

        // console.log(getByType)

        res.json(getByType)
        res.status(200);

    }
    catch (error) {
        console.log(error);
        res.send({ error: 'No se pudo obtener datos' });
    }
}

const ConfigColors = async (req, res) => {
    try {

        let {colorP, colorS, type} = req.body

        const objectType = req.body.type

        // console.log(req.body)

        const updatedObject = await modelConfigColor.findOneAndUpdate(
            { type: objectType }, // Busca por el ID
            {colorP, colorS, type}, // Valores a actualizar o crear
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(201).json(updatedObject);

        
    } catch (error) {
        console.log(error);
        res.send({ error: 'No se pudo guardar los cambios.' }).status(400);
    }
}

const ConfigLinks = async (req, res) => {
    try {

        // console.log("body-link",req.body)
        let {facebook, instagram, twiter, linkGoogle, type} = req.body

        const objectType = req.body.type


        const updatedObject = await modelConfigLink.findOneAndUpdate(
            { type: objectType }, // Busca por el ID
            {facebook, instagram, twiter, linkGoogle, type}, // Valores a actualizar o crear
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(201).json(updatedObject);

        
    } catch (error) {
        console.log(error);
        res.send({ error: 'No se pudo guardar los cambios.' }).status(400);
    }
}

module.exports={
    ConfigBasic,
    GetConfigBasic,
    ConfigColors,
    ConfigLinks,
    uploadImageToCloudinary
}