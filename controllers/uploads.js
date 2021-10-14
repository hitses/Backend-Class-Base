const path = require('path')
const fs = require('fs')
const { response } = require("express")

const {Usuario, Producto} = require('../models')
const { subirArchivo } = require("../helpers/subir-archivo")

const cargarArchivo = async (req, res = response) => {
  try {
    const nombre = await subirArchivo(req.files, undefined, 'imgs')

    res.status(200).json({nombre})
  } catch (err) {
    res.status(500).json(err)
  }
}

const imageUpdate = async (req, res = response) => {
  const {id, coleccion} = req.params

  let modelo

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)
      if(!modelo) return res.status(400).json({msg: `No existe el usuario con ID ${id}.`})
      break;
      case 'productos':
      modelo = await Producto.findById(id)
      if(!modelo) return res.status(400).json({msg: `No existe el producto con ID ${id}.`})
      break;
    default:
      return res.status(500).json({msg: 'Se ha pasado validar esto.'})
  }

  // Eliminar imágenes previas del servidor
  try {
    if(modelo.img) {
      const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
      if(fs.existsSync(pathImagen)) fs.unlinkSync(pathImagen)
    }
  } catch (err) {
    res.status(500).json(err)
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion)
  modelo.img = nombre

  await modelo.save()

  res.status(200).json(modelo)
}

const mostrarImagen = async (req, res = response) => {
  const {id, coleccion} = req.params

  let modelo

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)
      if(!modelo) return res.status(400).json({msg: `No existe el usuario con ID ${id}.`})
      break;
      case 'productos':
      modelo = await Producto.findById(id)
      if(!modelo) return res.status(400).json({msg: `No existe el producto con ID ${id}.`})
      break;
    default:
      return res.status(500).json({msg: 'Se ha pasado validar esto.'})
  }

  try {
    const pathImagen = modelo.img ?
      path.join(__dirname, '../uploads', coleccion, modelo.img) :
      path.join(__dirname, '../assets/no-image.jpg')
    
    return res.sendFile(pathImagen)
  } catch (err) {
    res.status(500).json(err)
  }
}

module.exports = {
  cargarArchivo,
  imageUpdate,
  mostrarImagen
}