const {Router} = require('express')
const router = Router()

const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete } = require('../controllers/users.controller')


router.get('/', usuariosGet)
router.post('/', usuariosPost)
router.put('/:id', usuariosPut)
router.delete('/', usuariosDelete)

module.exports = router