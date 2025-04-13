# 🧪 Ejecución de pruebas

Para poder ejecutar las pruebas utilizo Thunder desde la extensiones de VSCode.

Pero puedes utilizar los servicios de Postman o algún otro servicio que desees...

[Volver al README principal](../README.md)

&nbsp;

## 1. Obtención de JWT.

Para empezar necesitas el token de validación, se obtiene haciendo un POST a la ruta `auth/signup`.

Debes pasarle los parametros `username`, `email` y `password`, a través del body.

Ejemplo: 

```bash

# en el Body:
{
  "email": "agus22@gmail.com",
  "username": "agus22",
  "password": "asd123"
}

```
&nbsp;

Te devolverá un mensaje:

```bash
"message": "Se creo el usuario exitosamente".
``` 

&nbsp;


**Si ya te has registrado** debes utilizar la ruta `auth/signin`.

Debes pasarle los parametros `username` y `password` por body.

```bash

# en el Body:
{
  "username": "agus22",
  "password": "asd123"
}

```
&nbsp;


Te devolverá el token de acceso: **"access_token"** para las rutas privadas.

```bash

# Response
# Esto es solo un ejemplo:

{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NjlkNzJiZC1iNTMxLTQ4NDItOGE4Zi05NzM3YjM0YjJmN2YiLCJlbWFpbCI6ImFndXMyMkBnbWFpbC5jb20iLCJpYXQiOjE3NDQ1MjMzMDcsImV4cCI6MTc0NDUyNDIwN30.w7GNvl-c0CTe_owyVP4obLJGiddUnS3u58YwcfCDF-o"
}

```
&nbsp;


⚠️ Nota: Recuerda incluir el valor, **solo el valor** del token en el **Headear** o en la sección **Auth** de la herramienta que utilices para las pruebas, lo necesitaras para acceder a las rutas privadas.

Ejmplo:
```bash

# valor de la Response, sin las comillas:
# Esto es solo un ejemplo:

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NjlkNzJiZyJzdWIiOiI1NyJzdWIiOiI1NyJzdW

```
&nbsp;


&nbsp;

## 2. Cotizaciones.

Para obtener la cotización debes hacer una consulta de tipo POST a la ruta `/quote`.

Debes pasarle por body los parametros: `from`, `to` y `amount`.

Ejemplo:

```bash
{
  "from": "ARS",
  "to": "BTC",
  "amount": 1000
}

```
&nbsp;
Te devolverá los resultados.

Ejemplo:

```bash

# Ejemplo de la Response

{
  "id": "a098925e-4c4b-455c-8b35-a2eea94c0312",
  "from": "ARS",
  "to": "BTC",
  "amount": 1000,
  "rate": 8.87398764938809e-9,
  "convertedAmount": 0.0000089,
  "timestamp": "2025-04-13T05:52:17.146Z",
  "expiresAt": "2025-04-13T05:57:17.146Z"
}

```
&nbsp;

⚠️ Nota: Recuerda que para este paso debes estar autenticado, por lo tanto se requiere del token en el **Header** o **Auth** correspondiente al punto 1.

&nbsp;


## 3. Búsqueda por id.

debes hacer un consulta de tipo GET a la ruta `quote/:id`.

Debes pasarle como parametro en PARAMS el id que retorna la cotización de la que hablamos en el punto 2.

```bash
# Ejemplo de como ejecutar la consulta:

http://localhost:8000/quote/a098925e-4c4b-455c-8b35-a2eea94c0312

```

⚠️ Nota: Recuerda que para este paso debes estar autenticado, por lo tanto se requiere del token en el **Header** o **Auth** correspondiente al punto 1.

&nbsp;

## 3. Obtener monedas y divisas.

Debes hacer una consulta de tipo GET a la ruta `/currencies`.

Te devolverá una lista con las divisas disponibles de la api.

&nbsp;

[Volver al README principal](../README.md)
