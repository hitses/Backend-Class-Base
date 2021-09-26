const { request, response } = require('express')
const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')

const validarJWT = async (req = request, res = response, next) => {
  try {
    const token = req.header('x-token')

    if (!token) return res.status(401).json({msg: 'El token no existe'})

    const {uid} = jwt.verify(token, process.env.SECRET_KEY)

    const usuario = await Usuario.findById(uid)
    // Verificar si el usuario tiene estado en true
    if (!usuario || !usuario.estado) return res.status(401).json({msg: 'Token no válido porque usuario no existe o estado en false'})
    req.usuario = usuario

    next()
  } catch (err) {
    console.error(err)
    res.status(401).json({msg: 'Token no válido'})
  }
}

module.exports = {
  validarJWT
}