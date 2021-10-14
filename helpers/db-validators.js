const { Categoria, Role, Usuario, Producto } = require('../models')

const esRolValido = async rol => {
  const existeRol = await Role.findOne({role: rol})
  if (!existeRol) throw new Error(`El rol ${rol} no está registrado en la base de datos`)
}

const emailExiste = async (correo) => {
  if (await Usuario.findOne({correo})) throw new Error(`'El correo ${correo} ya está registrado'`)
}

const existeUsuarioPorId = async (id) => {
  if (await !Usuario.findById(id)) throw new Error(`'El usuario con ID ${id} no existe'`)
}

const existeCategoriaPorId = async (id) => {
  if (await !Categoria.findById(id)) throw new Error(`'La categoría con ID ${id} ya existe'`)
}

const existeNombreCategoria = async (nombre) => {
  if (await Categoria.findOne({nombre})) throw new Error(`'La categoría con el nombre ${nombre} ya existe.'`)
}

const existeProductoPorId = async (id) => {
  if (await !Producto.findById(id)) throw new Error(`'El producto con ID ${id} ya existe'`)
}

const existeNombreProducto = async (nombre) => {
  if (await Producto.findOne({nombre})) throw new Error(`'El producto con el nombre ${nombre} ya existe.'`)
}

const coleccionesPermitidas = async (coleccion, colecciones) => {
  if(!colecciones.includes(coleccion)) throw new Error(`La colección ${coleccion} no está permitida. Las colecciones permitidas son: ${colecciones}`)
  
  return true
}

module.exports = {
  esRolValido,
  emailExiste,
  existeUsuarioPorId,
  existeCategoriaPorId,
  existeNombreCategoria,
  existeProductoPorId,
  existeNombreProducto,
  coleccionesPermitidas
}