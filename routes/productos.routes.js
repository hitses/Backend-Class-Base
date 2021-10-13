const {Router} = require('express')
const { check } = require('express-validator')

const { validarCampos, validarJWT, tieneRole } = require('../middlewares')

const { existeProductoPorId, existeNombreProducto } = require('../helpers/db-validators')
const { productosGet, productoGet, crearProducto, productoPut, productoDelete } = require('../controllers/productos.controller')

const router = Router()

router.get('/', productosGet)

router.get('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeProductoPorId),
  validarCampos
], productoGet)

router.post('/', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('categoria', 'La categoría es obligatoria').not().isEmpty(),
  check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
  validarCampos
], crearProducto)

router.put('/:id', [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeProductoPorId),
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('nombre').custom(existeNombreProducto),
  validarCampos
], productoPut)

router.delete('/:id', [
  validarJWT,
  tieneRole('ADMIN_ROLE'),
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeProductoPorId),
  validarCampos
], productoDelete)

module.exports = router