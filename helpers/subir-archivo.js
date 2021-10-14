const path = require('path')
const {v4: uuid} = require('uuid')

const subirArchivo = (file, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {
  return new Promise((resolve, reject) => {
    const {archivo} = file
    const nombreCortado = archivo.name.split('.')
    const extension = nombreCortado[nombreCortado.length -1]
  
    // Validar la extensión
    if (!extensionesValidas.includes(extension)) return reject(`La extensión ${extension} ha sido denegada. Las extensiones permitidas son ${extensionesValidas}`)
  
    const nombreTemp = uuid() + '.' + extension
    const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp)
  
    archivo.mv(uploadPath, (err) => {
      if (err) {
        return reject(err)
      }

      resolve(nombreTemp)
    })
  })
}

module.exports = {
  subirArchivo
}