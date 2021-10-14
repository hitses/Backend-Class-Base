const express = require('express')
var cors = require('cors')
const fileUpload = require('express-fileupload')

const dbConection = require('../db/config')

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT

    this.path = {
      auth: '/api/auth',
      buscar: '/api/buscar',
      categorias: '/api/categorias',
      productos: '/api/productos',
      usuarios: '/api/usuarios',
      uploads: '/api/uploads'
    }
    
    // Conexión a DB
    this.conectarDB()

    // Middlewares
    this.middlewares()

    // Routes
    this.routes()
  }

  async conectarDB() {
    await dbConection()
  }

  middlewares() {
    // CORS
    this.app.use(cors())

    // Lectura y parseo del body
    this.app.use(express.json())

    // Directory Public
    this.app.use(express.static('public'))

    // Carga de archivos
    this.app.use(fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/',
      createParentPath: true
    }))
  }

  routes() {
    this.app.use(this.path.auth, require('../routes/auth.routes'))
    this.app.use(this.path.buscar, require('../routes/buscar.routes'))
    this.app.use(this.path.categorias, require('../routes/categorias.routes'))
    this.app.use(this.path.productos, require('../routes/productos.routes'))
    this.app.use(this.path.usuarios, require('../routes/user.routes'))
    this.app.use(this.path.uploads, require('../routes/uploads.routes'))
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor funcionando en el puerto ${this.port}`)
    })
  }
}

module.exports = Server