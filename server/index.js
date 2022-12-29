const mongoose = require('mongoose')
const app = require('./app')
const { API_VERSION, IP_SERVER, PORT_DB, PORT_SERVER, PASSWORD } = require('./config')

exports.config = {
    api: {
        bodyParser: false
    }
}

mongoose.connect(
    `mongodb+srv://jgp95:${PASSWORD}@rotiseriapepitos.edibjp4.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: false, useUnifiedTopology: true },
    (err, res) => {
        if (err) {
            throw err
        } else {
            console.log('La conexión a la base de datos es correcta')

            app.listen(PORT_SERVER, () => {
                console.log('###############################')
                console.log('########### API REST ##########')
                console.log('###############################')
                console.log(`http://${IP_SERVER}:${PORT_SERVER}/api/${API_VERSION}`)
            })  
        }
    }
)
