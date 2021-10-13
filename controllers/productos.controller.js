const { response } = require('express')

const { Producto } = require('../models')

const productosGet = async (req, res = response) => {
  try {
    const {limite = 5, desde = 0} = req.query

    const [total, productos] = await Promise.all([
      Producto.countDocuments({estado: true}),
      Producto.find({estado: true}).skip(Number(desde)).limit(Number(limite)).populate('usuario', 'nombre').populate('categoria', 'nombre')
    ])

    res.json({
      total,
      productos
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Hable con el administrador.'
    })
  }
}

// ID del producto Galletitas de la abuela 615c4269d0682b3e13d4c8ef
const productoGet = async (req, res = response) => {
  try {
    const {id} = req.params

    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre')
    if (!producto.estado) return res.status(400).json({msg: 'No existe la categoría'})
    if (!producto) return res.status(400).json({msg: 'No existe la categoría'})

    res.json({
      producto
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Hable con el administrador.'
    })
  }
}

const crearProducto = async (req, res = response) => {
  try {
    const {nombre, precio, categoria, descripcion} = req.body

    const productoDB = await Producto.findOne({nombre})
    if (productoDB) return res.status(400).json({msg: `El producto ${productoDB.nombre} ya existe.`})

    const newProducto = {
      nombre: nombre.toUpperCase(),
      precio,
      categoria,
      descripcion,
      usuario: req.usuario._id
    }

    const producto = await new Producto(newProducto)
    await producto.save()

    res.status(201).json(producto)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Hable con el administrador.'
    })
  }
}

// Actualizar producto nombre populate 615c4269d0682b3e13d4c8ef
// ID del producto Galletitas de la abuela 615c4269d0682b3e13d4c8ef
const productoPut = async (req, res = response) => {
  try {
    const {id} = req.params
    const {usuario, categoria, ...data} = req.body

    const newProducto = data

    const producto = await Producto.findByIdAndUpdate(id, newProducto, { new: true }).populate('usuario', 'nombre').populate('categoria', 'nombre')

    res.status(200).json(producto)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Hable con el administrador.'
    })
  }
}

// Borrar producto 615c4269d0682b3e13d4c8ef
// ID del producto ¡GALLETAS! 6154504129dd987c19f341af
const productoDelete = async (req, res = response) => {
  try {
    const {id} = req.params

    const producto = await Producto.findByIdAndUpdate(id, {estado: false}, { new: true }).populate('usuario', 'nombre').populate('categoria', 'nombre')

    res.status(200).json(producto)

  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Hable con el administrador.'
    })
  }
}

module.exports = {
  productosGet,
  productoGet,
  crearProducto,
  productoPut,
  productoDelete
}