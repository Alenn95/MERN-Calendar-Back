const mongoose = require('mongoose');

const dbConnection = async () => {

    try {

        mongoose.connect(process.env.DB_CNN);

        console.log('DB Online')



    } catch (error) {
        console.log(error)
        throw new error('Error al inicializar DB')
    }
}


module.exports = {
    dbConnection

}




/*, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        }*/