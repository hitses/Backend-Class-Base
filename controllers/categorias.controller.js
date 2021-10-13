const { response } = require('express')

const { Categoria } = require('../models')

const categoriasGet = async (req, res = response) => {
  try {
    const {limite = 5, desde = 0} = req.query

    const [total, categorias] = await Promise.all([
      Categoria.countDocuments({estado: true}),
      Categoria.find({estado: true}).skip(Number(desde)).limit(Number(limite)).populate('usuario', 'nombre')
    ])

    res.json({
      total,
      categorias
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Hable con el administrador.'
    })
  }
}

// ID de la categoría ¡GALLETAS! 6154504129dd987c19f341af
const categoriaGet = async (req, res = response) => {
  try {
    const {id} = req.params

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre')
    if (!categoria.estado) return res.status(400).json({msg: 'No existe la categoría'})
    if (!categoria) return res.status(400).json({msg: 'No existe la categoría'})

    res.json({
      categoria
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Hable con el administrador.'
    })
  }
}

const crearCategoria = async (req, res = response) => {
  try {
    const nombre = req.body.nombre.toUpperCase()

    const categoriaDB = await Categoria.findOne({nombre})
    if (categoriaDB) return res.status(400).json({msg: `La categoría ${categoriaDB.nombre} ya existe.`})

    const data = {
      nombre,
      usuario: req.usuario._id
    }

    const categoria = await new Categoria(data)
    await categoria.save()

    res.status(201).json(categoria)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Hable con el administrador.'
    })
  }
}

// Actualizar categoría nombre populate 6154504129dd987c19f341af
// ID de la categoría ¡GALLETAS! 6154504129dd987c19f341af
const categoriaPut = async (req, res = response) => {
  try {
    const {id} = req.params
    const {nombre, ...data} = req.body

    const newCategory = nombre.toUpperCase()

    const categoria = await Categoria.findByIdAndUpdate(id, {nombre: newCategory}, { new: true }).populate('usuario', 'nombre')

    res.status(200).json(categoria)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Hable con el administrador.'
    })
  }
}

// Borrar categoría 6154504129dd987c19f341af
// ID de la categoría ¡GALLETAS! 6154504129dd987c19f341af
const categoriaDelete = async (req, res = response) => {
  try {
    const {id} = req.params

    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, { new: true }).populate('usuario', 'nombre')

    res.status(200).json(categoria)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      msg: 'Hable con el administrador.'
    })
  }
}

module.exports = {
  categoriasGet,
  categoriaGet,
  crearCategoria,
  categoriaPut,
  categoriaDelete
}