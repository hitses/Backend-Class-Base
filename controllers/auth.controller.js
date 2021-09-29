const response = require('express')
const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')

const login = async (req, res = response) => {
  try {
    const {correo, password} = req.body

    const usuario = await Usuario.findOne({correo})

    // Verificar email existe
    if (!usuario) return res.status(400).json({msg: 'Correo no existe'})
    
    // Usuario activo?
    if (!usuario.estado) return res.status(400).json({msg: 'Estado inactivo'})
    
    // Verificar pass
    const validPassword = bcrypt.compareSync(password, usuario.password)
    if (!validPassword) return res.status(400).json({msg: 'Password incorrecto'})

    // Generar JWT
    const token = await generarJWT(usuario.id)

    res.json({
      usuario,
      token
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Hable con el administrador.'
    })
  }
}

const googleSignIn = async(req, res = response) => {
  try {
    const {id_token} = req.body

    const {correo, nombre, img} = await googleVerify(id_token)

    let usuario = await Usuario.findOne({correo})
    if (!usuario) {
      const data = {
        nombre,
        correo,
        password: ':P',
        img,
        google: true,
        rol: 'USER_ROLE'
      }

      usuario = new Usuario(data)
      await usuario.save()
    }

    if (!usuario.estado) return res.status(401).json({msg: 'Usuario bloqueado. Hable con el administrador.'})

    // Generar JWT
    const token = await generarJWT(usuario.id)
  
    res.json({usuario, token})
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Hable con el administrador.'
    })
  }
}

module.exports = {
  login,
  googleSignIn
}