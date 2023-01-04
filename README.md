# IMPORTANTE

Te podés encontrar con ***código repetido***, ***código sin uso***, y ***código por refactorizar***.

En general mi código es ***más limpio***, como se puede ver en otros repos.

Esta aplicación la hice con ***poco tiempo***.

Originalmente las fotos de los productos se suben a un ***Bucket en AWS S3***.

Pero se terminó la ***prueba gratis*** de Amazon y tuve que dejar las fotos estáticas.

El código que hace referencia a Amazon del lado del cliente está ***comentado*** y ***reemplazado***.

El código que está en el servidor **no** hizo falta reemplazarlo ya que simplemente ***no se ejecuta***.

# negocio-app
Una aplicación que le permite al usuario crear productos para que su cliente los agregue a un carrito y envíe su pedido por mensaje de WhatsApp.

### cd client

> npm install

> npm run dev

### cd server

> npm install

* **Crear archivo** .env con clave *PASSWORD_DB* de base de datos de MongoDB.

* **Cambiar URL** en index.js en el método mongoose.connect() para enlazar la base.  

> npm run dev

## Licencia

> MIT
