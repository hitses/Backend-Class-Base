const Role = require('../models/role')
const Usuario = require('../models/usuario')

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

module.exports = {
  esRolValido,
  emailExiste,
  existeUsuarioPorId
}