const {Router} = require('express')
const { check } = require('express-validator')

const { validarCampos, validarJWT, tieneRole } = require('../middlewares')

const { existeCategoriaPorId, existeNombreCategoria } = require('../helpers/db-validators')
const { categoriasGet, categoriaGet, crearCategoria, categoriaPut, categoriaDelete } = require('../controllers/categorias.controller')

const router = Router()

router.get('/', categoriasGet)

router.get('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeCategoriaPorId),
  validarCampos
], categoriaGet)

router.post('/', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  validarCampos
], crearCategoria)

router.put('/:id', [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeCategoriaPorId),
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('nombre').custom(existeNombreCategoria),
  validarCampos
], categoriaPut)

router.delete('/:id', [
  validarJWT,
  tieneRole('ADMIN_ROLE'),
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeCategoriaPorId),
  validarCampos
], categoriaDelete)

module.exports = router