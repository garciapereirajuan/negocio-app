exports.API_VERSION = 'v1'
exports.IP_SERVER = 'localhost'
exports.PORT_DB = 27017
exports.PORT_SERVER = process.env.PORT || 3838
exports.PASSWORD = process.env.PASSWORD_DB

//Config var aws-sdk

exports.REGION = process.env.REGION_AWS
exports.BUCKET_NAME_AWS = process.env.BUCKET_NAME_AWS

//el sdk-aws autentica tu identidad con las variables
//de entorno: AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY
//de manera automática. 

//Pero en vercel algunas variables de entorno sólo
//pueden usarse en plan de pago, como estas dos.

//Asique de esta forma escondo las claves con otro nombre
//pero me autentico manualmente

//Por otra parte, vercel me devolvía error 'AccessDeneid' cuando
//quería subir una imagen, aparentemente la autenticación automática
//anda mal en vercel

//Por lo tanto ahora me autentico manualmente para que funcione
//la carga de la imagen y gracias a eso también puedo esconder
//los valores de las claves en variables que no sean reservadas

exports.ACCESS_KEY_ID_AWS = process.env.ACCESS_KEY_ID_AWS
exports.SECRET_ACCESS_KEY_AWS = process.env.SECRET_ACCESS_KEY_AWS
