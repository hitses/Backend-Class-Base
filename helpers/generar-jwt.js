const jwt = require('jsonwebtoken')

const generarJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = {uid}

    jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '24h'
    }, (err, token) => {
      if(err) {
        console.error(err)
        reject('No se ha podido generar el token.')
      } else {
        resolve(token)
      }
    })
  })
}

module.exports = {
  generarJWT
}