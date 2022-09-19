const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario')
const { generateJWT } = require('../helpers/jwt');


const createUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese correo'
            });
        }

        console.log(Usuario);

        usuario = new Usuario(req.body);

        //Encriptar contraseña

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        //Generar JWT

        const token = await generateJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {

        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Porfavor hable con el administrador'
        });
    }
}




const loginUser = async (req, res = response) => {




    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese correo'
            });
        }

        //confirmar los password

        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecta'
            });
        }

        //Generar nuestro JWT

        const token = await generateJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })



    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}


const renewToken = async (req, res = response) => {

    const { uid, name } = req;


    const token = await generateJWT(uid, name);


    res.json({
        ok: true,
        msg: 'renew',
        token
    });

}

module.exports = {
    createUser,
    loginUser,
    renewToken,
}