const schemaUser = require('../models/ModelUser')
const express = require('express');
const jwt = require('jsonwebtoken');

const verifyUser = async (req, res, next) => {

    let token = req.headers['authorization'];
    // console.log('request==>', req)
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    } else {
        token = token.split(" ")[1];
    }
    console.log('token ====>', token)
    // Verificar el token JWT
    jwt.verify(token, 'password123', (err, user) => {
        
        if (err) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if(user.role != 'admin'){
            return res.status(403).json({ message: 'Access denied not admin' });
        }
        console.log('user==>', user)

        next();
    });
}

const createUser = async (req, res, next) => {
    try {

        // console.log("body-link",req.body)
        // console.log(req.body)
        let {user, pass, role} = req.body

        const findUser = await schemaUser.findOne({user})

        // console.log(findUser)

        if (findUser === null){
            const updatedObject = await schemaUser.findOneAndUpdate(
                { user }, // Busca por el ID
                {user, pass, role}, // Valores a actualizar o crear
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
    
            res.status(201).json(updatedObject);
        } else {
            res.status(304).send({error: 'Ya existe el usuario'})
        }
        
    } catch (error) {
        console.log(error);
        res.send({ error: 'No se pudo guardar los cambios.' }).status(400);
    }
}

const login = async (req, res, next) => {
    try {

        const options = {
            expiresIn: '1h',
        };

        const {user, pass} = req.body

        console.log(user)
        console.log(pass)

        schemaUser.findOne({ user }).then((result) => {
            console.log(result)
            if (result) {
                // Comparar contraseñas aquí
                if (result.pass === pass) {
                    const payload = {
                        _id: result._id,
                        username: result.user,
                        pass: result.pass,
                        role: result.role
                    };

                    const token = jwt.sign(payload, 'password123', options);

                    res.status(200).send({ token });
                } else {
                    res.status(401).send({ error: 'Contraseña incorrecta' });
                }
            } else {
                res.status(404).send({ error: 'No existe el usuario' });
            }
        });
    }
    catch (error){
        console.log(error);
        res.send({ error: 'No se pudo iniciar sesion' }).status(400);
    }
}

const getUsers = async (req, res, next) => {
    try {

        const getAllUsers = await schemaUser.find()

        console.log(getAllUsers)

        res.status(201).json(getAllUsers);

    } catch (error){
        console.log(error);
        res.send({ error: 'No se encontro usuarios' }).status(404);
    }
}

const removeUser = async (req, res) => {
    try {
        console.log( req.params.id)

        schemaUser.findByIdAndRemove({_id: req.params.id}).then(()=> {
            res.status(201).send({message: 'Se borro con exito'});
        })

    } catch (error){
        console.log(error);
        res.send({ error: 'No se encontro usuarios' }).status(404);
    }
}

module.exports = {
    verifyUser,
    createUser,
    login,
    getUsers,
    removeUser
}