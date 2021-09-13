const express = require('express')
var cors = require('cors')

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT
    this.usuariosRoutePath = '/api/usuarios'

    // Middlewares
    this.middlewares()

    // Routes
    this.routes()
  }

  middlewares() {
    // CORS
    this.app.use(cors())

    // Lectura y parseo del body
    this.app.use(express.json())

    // Directory Public
    this.app.use(express.static('public'))
  }

  routes() {
    this.app.use(this.usuariosRoutePath, require('../routes/user.routes'))
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor funcionando en el puerto ${this.port}`)
    })
  }
}

module.exports = Server