 Se creo una mini web para probar los endpoints del server.
 [info sobre IA](docs/integracionIA.md)

## (Requisito) Crea el archivo .env.local
Crear archivo .env.local en la raíz del proyecto Next.js y copia dentro lo siguiente: 
Nota: Si el puerto 8000 ya lo tienes en uso, cambialo por un puerto libre, recuerda que el puerto debe ser el mismo que el de tu backend!

**Asegurate de que tu archivo se llame `.env.local` de lo contrario tendras errores**

```bash
# archivo .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000

#JWT, esta variable debe ser la misma que se encuentra en el backend. En caso de ser diferentes tendras errores con el middleware.
JWT_SECRET=bCGN6h4sFjqbsfjXfnqos3YdKzGf7JjT/oDc9qE53ZqAeRPLQfBbqZ1S9Z0n8d3jW1/WSKmL7OZ7N+0YX9R0JbC
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

 &nbsp;

## 👥 Autor

- [Agus Albarracín](https://github.com/Agus-Albarracin) - Full Stack developer
