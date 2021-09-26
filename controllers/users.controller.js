const {response} = require('express')
const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuario')
const { emailExiste } = require('../helpers/db-validators')

const usuariosGet = async (req, res = response) => {
  const {limite = 5, desde = 0} = req.query

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments({estado: true}),
    Usuario.find({estado: true}).skip(Number(desde)).limit(Number(limite))
  ])

  res.json({
    total,
    usuarios
  })
}

const usuariosPost = async (req, res = response) => {
  const {nombre, correo, password, rol} = req.body
  const usuario = new Usuario({nombre, correo, password, rol})

  // Encriptar la contraseña
  const salt = bcrypt.genSaltSync()
  usuario.password = bcrypt.hashSync(password, salt)

  // Guardar usuario en BD
  await usuario.save()

  res.json({
    msg: 'User registered correctly',
    usuario
  })
}

const usuariosPut = async (req, res = response) => {
  const {id} = req.params
  const {_id, password, google, correo, ...resto} = req.body

  // TODO validar id en BD

  if (password) {
    const salt = bcrypt.genSaltSync()
    resto.password = bcrypt.hashSync(password, salt)
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true })

  res.json(usuario)
}

const usuariosDelete = async (req, res = response) => {
  const {id} = req.params

  // Cambiar estado del usuario
  const usuario = await Usuario.findByIdAndUpdate(id, {estado: false}, {new: true})
  const usuarioAutenticado = req.usuario

  res.status(200).json({usuario, usuarioAutenticado})
}

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete
}