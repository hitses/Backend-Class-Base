const { response } = require("express")
const {ObjectId} = require('mongoose').Types

const {Usuario, Categoria, Producto} = require('../models')

const coleccionesPermitidas = [
  'categoria',
  'productos',
  'roles',
  'usuario',
]

const buscarCategorias = async (termino, res = response) => {
  const esMongoID = ObjectId.isValid(termino)
  const regExp = new RegExp(termino, 'i')

  const [total, categorias] = await Promise.all([
    esMongoID ?
    await Categoria.countDocuments(termino, {estado: true}) :
    await Categoria.countDocuments({nombre: regExp, estado: true}),
    esMongoID ?
    await Categoria.findById(termino, {estado: true}) :
    await Categoria.find({nombre: regExp, estado: true})
  ])

  res.status(200).json({
    results: (total, categorias) ? {total, categorias} : [`La categoría ${termino} no existe`]
  })
}

const buscarProductos = async (termino, res = response) => {
  const esMongoID = ObjectId.isValid(termino)
  const regExp = new RegExp(termino, 'i')

  const [total, productos] = await Promise.all([
    esMongoID ?
    await Producto.countDocuments(termino) :
    await Producto.countDocuments({nombre: regExp, estado: true}),
    esMongoID ?
    await Producto.findById(termino) :
    await Producto.find({nombre: regExp, estado: true})
  ])

  res.status(200).json({
    results: (total, productos) ? {total, productos} : [`El producto ${termino} no existe`]
  })
}

const buscarUsuarios = async (termino, res = response) => {
  const esMongoID = ObjectId.isValid(termino)
  const regExp = new RegExp(termino, 'i')

  const [total, usuarios] = await Promise.all([
    esMongoID ?
    await Usuario.countDocuments(termino, {estado: true}) :
    await Usuario.countDocuments({
      $or: [{nombre: regExp}, {correo: regExp}],
      $and: [{estado: true}]
    }),
    esMongoID ?
    await Usuario.findById(termino, {estado: true}) :
    await Usuario.find({
      $or: [{nombre: regExp}, {correo: regExp}],
      $and: [{estado: true}]
    })
  ])

  res.status(200).json({
    results: (total, usuarios) ? {total, usuarios} : [`El usuario ${termino} no existe`]
  })
}

const buscar = (req, res = response) => {
  const {coleccion, termino} = req.params

  if (!coleccionesPermitidas.includes(coleccion)) return res.status(400).json({msg: `La colección ${coleccion} no existe.`})

  switch (coleccion) {
    case 'categoria':
      buscarCategorias(termino, res)
      break;
    case 'productos':
      buscarProductos(termino, res)
      break;
    case 'usuario':
      buscarUsuarios(termino, res)
      break;
  
    default:
      res.status(500).json({msg: 'Se le olvidó hacer esta búsqueda.'})
      break;
  }
}

module.exports = {
  buscar
}