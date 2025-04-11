# Server

## (Requisito) Crea el archivo .env
Crear archivo .env en la raíz del proyecto NEST.js y copia dentro lo siguiente:

#### Notas:
- Si el puerto 8000 ya lo tienes en uso, cambialo por un puerto libre, recuerda configurar el mismo puerto en la ruta de frontend.

- Tienes que asegurarte de usar POSTGRES + PRISMA.
- `DATABASE_URL` es la URL de TU base de datos, deberias modificar la parte de la linea **("user:password" = "postgres:admin")** por las credenciales que usas. 
- **@localhost:5432** es la configuración por default de postgres para la DB local.
- **/koywe_db** es el nombre de la base de datos que debes crear (Puedes hacerlo desde PgAdmin si lo deseas). 

&nbsp;


```bash
# archivo .env

# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="postgresql://postgres:admin@localhost:5432/koywe_db"


# PORT
PORT_SERVER=8000

# FRONT, la URL es la que usa Next.js por defecto, si tienes alguna configuración personalizada asegura de que sea la misma que el front.
# La FRONT_URL, Está siendo utilizada dentro del CORS como sistema de seguridad para el origen de solicitudes.
FRONT_URL=http://localhost:3000

# API
CRYPTOMKT_API_URL=https://api.exchange.cryptomkt.com/api/3


#JWT
JWT_SECRET=bCGN6h4sFjqbsfjXfnqos3YdKzGf7JjT/oDc9qE53ZqAeRPLQfBbqZ1S9Z0n8d3jW1/WSKmL7OZ7N+0YX9R0JbC
JWT_EXPIRES_IN=1h


```
&nbsp;

## Iniciando
Asegurate de instalar las dependencias, y asegurarte de que no tengas errores de compatibilidad.
&nbsp;

```bash
cd server
npm install

// SOLO en caso de que estes teniendo complicaciones con las dependencias por otra dependencias de tu ecosistema local intenta:

// Para evitar las incompatibilidad.
npm install --legacy-peer-deps 
# o
// Obliga a instalarlos de igual manera, pero ten encuenta que podrias tener complicaciones ya que fuerzas la instalación por más de que no sean compatibles. (No recomedable)
npm install --force
```
&nbsp;
## Inicia prisma
Inicia el cliente de la DB para poder continuar. (Es importante que tengas el archivo .env dentro de la raiz del server)
Nota:
 - Si en algun momento tienes problemas con que prisma no exporta PrismaClient:
 - Elimina la carpeta de node_modules y package-lock.json
 - Cierra el editor de código.
 - Vuelva a seguir los pasos para iniciar Prisma.

&nbsp;

```bash
cd server
cd prisma

# Ejecuta el comando para generar el cliente de Prisma
npx prisma generate
# Te devolvera un mensaje de éxito.
```

## Inicia el server
Una vez que hayas hecho todos los pasos, ejecuta el comando para inciar el server, deberia aparecerte un mensaje que inicio.
&nbsp;

```bash
cd server
npm run start:dev
# Abrira el watch de Node.
```
&nbsp;

## ¿Por qué PostgreSQL?
Porque pense la API a grande escala y no me quede solo con la parte de "challenge". Por lo tanto, para una API de tipo exchange es mejor utilizar una estructura relacional como **PostgreSQL** que permite definir relaciones claras entre entidades (usuarios, transacciones, etc.).


## ¿Por qué Prisma?
Se eligió **Prisma** como ORM (Object Relational Mapping) por su facilidad de uso y sy integración con **TypeScript**.

&nbsp;

# Arquitectura Modular basada en Dominios (Feature-Based Modular Architecture)
## ⚡¿Por qué utiliza a Modular basada en Dominios?

*Mi pensamiento de enfoque es el mismo...
Porque pense la API a grande escala y no me quede solo con la parte de "challenge".*

---
Este patrón:
Nos permite separar claramente la lógica de negocio (BLL) del acceso a datos (DAL), y además lo hace por funcionalidad, lo cual es mucho más limpio y mantenible.

✅ Agrupa toda la lógica relacionada a una funcionalidad específica en un solo lugar (controlador, servicios, DTOs, modelos, etc.).

✅ Permite escalar de forma limpia (agregar nuevas features = nuevos módulos).

✅ Es más fácil de testear, mantener y delegar a diferentes miembros del equipo.


*Ejemplo de estructura:*

````
conversion/
├── conversion.controller.ts 
├── conversion.services.ts     
├── conversion.bll.ts         
├── conversion.provider.ts       
├── conversion.services.ts    
├── dto/
│   └── convert.dto.ts
├── models/
│   └── currency.model.ts
├── test/
│   └── integracion
│   └── unitarios
````
## Ventajas de uso:
✅ Alta cohesión y bajo acoplamiento: cada capa hace sólo lo que debe.

✅ Fácil testeo unitario: podés testear la BLL sin depender de la DAL o controller.

✅ Fácil mantenimiento: si cambia una API externa, solo se modifica el dal.ts.

✅ Reutilización: el bll se puede usar desde otras capas o servicios si es necesario.


