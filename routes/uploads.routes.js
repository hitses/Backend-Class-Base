const {Router} = require('express')
const { check } = require('express-validator')

const { validarCampos, validarArchivoSubir } = require('../middlewares')

const { cargarArchivo, imageUpdate, mostrarImagen } = require('../controllers/uploads')
const { coleccionesPermitidas } = require('../helpers/db-validators')

const router = Router()

router.post('/', validarArchivoSubir, cargarArchivo)
router.put('/:coleccion/:id', [
  validarArchivoSubir,
  check('id', 'El ID debe ser de Mongo').isMongoId(),
  check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
  validarCampos
], imageUpdate)
router.get('/:coleccion/:id', [
  check('id', 'El ID debe ser de Mongo').isMongoId(),
  check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
  validarCampos
], mostrarImagen)

module.exports = router