const response = require('express')
const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar-jwt')

const login = async (req, res = response) => {
  try {
    const {correo, password} = req.body

    const usuario = await Usuario.findOne({correo})

    // TODO Verificar email existe
    if (!usuario) return res.status(400).json({msg: 'Correo no existe'})
    
    // TODO usuario activo?
    if (!usuario.estado) return res.status(400).json({msg: 'Estado inactivo'})
    
    // TODO verificar pass
    const validPassword = bcrypt.compareSync(password, usuario.password)
    if (!validPassword) return res.status(400).json({msg: 'Password incorrecto'})

    // TODO generar JWT
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

module.exports = {
  login
}