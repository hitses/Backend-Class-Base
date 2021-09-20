const mongoose = require('mongoose')

const dbConection = async() => {
  try {
    await mongoose.connect(process.env.MONGO_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log('Base de datos online')
  } catch (err) {
    console.error(err)
    throw new Error('Error al conectarse a la base de datos')
  }
}

module.exports = dbConection