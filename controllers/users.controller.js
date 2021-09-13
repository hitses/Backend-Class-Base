const {response} = require('express')

const usuariosGet = (req, res = response) => {
  const {q, nombre = 'no name', apikey} = req.query

  res.json({
    msg: 'Get API - Controller',
    q,
    nombre,
    apikey
  })
}

const usuariosPost = (req, res = response) => {
  const {nombre, edad} = req.body

  res.json({
    msg: 'Post API - Controller',
    body: {
      nombre,
      edad
    }
  })
}

const usuariosPut = (req, res = response) => {
  const {id} = req.params

  res.json({
    msg: 'Put API - Controller',
    id
  })
}

const usuariosDelete = (req, res = response) => {
  res.json({
    msg: 'Delete API - Controller'
  })
}

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete
}