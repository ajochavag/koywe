 Se creo una mini web para probar los endpoints del server.

## (Requisito) Crea el archivo .env.local
Crear archivo .env.local en la raíz del proyecto Next.js y copia dentro lo siguiente: 

```bash
# archivo .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/
```
NEXT_PUBLIC_API_URL es obligatorio para exponer la variable al cliente (ya que estás usándola en código del cliente: use client).

## Instala dependencias y corre el cliente.

Primero asegurate de correr el server:

```bash
npm install
# &
npm run dev
```

Abrira [http://localhost:3000](http://localhost:3000) en tu navegador.

## Login

"/"
Contiene una interfaz sencilla y completa para probar la autenticación y creación de credenciales.

## Home

"/home"
Contiene una interfaz sencilla en donde se puede:
 - Crear cotización (al crear la cotización, como respuesta se obtiene `id`, `tasa` y `total`).
 - Consultar a través de id las cotizaciones realizadas (al buscar una cotización vas a obtener: `id`, `monto`, `from`, `to`, `tasa`, `total` y `expiración`).
