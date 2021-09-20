const {Router} = require('express')
const { check } = require('express-validator')

const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators')
const { validarCampos } = require('../middlewares/validar-campos')
const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete } = require('../controllers/users.controller')

const router = Router()

router.get('/', usuariosGet)
router.post('/', [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El password debe contener 6 caracteres').isLength({min: 6}),
  check('correo', 'El correo no tiene un formato válido').isEmail(),
  check('correo').custom(emailExiste),
  check('rol').custom(esRolValido),
  validarCampos
], usuariosPost)
router.put('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  check('rol').custom(esRolValido),
  validarCampos
], usuariosPut)
router.delete('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos
], usuariosDelete)

module.exports = router