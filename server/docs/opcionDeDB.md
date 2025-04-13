# 🐘POSTGRE + 🔷PRISMA

[Volver al README principal](../README.md)

## Crea la Base de datos.
Crea la base de datos en Postgres debe llamarse `koywe_db`, como la información del [README.md](../README.md)


&nbsp;
Notas:
 - Puedes utilizar PgAdmin para poder crearla fácilmente.
- `DATABASE_URL` es la URL de TU base de datos, deberias modificar la parte de la linea **("user:password" = "postgres:admin")** por las credenciales que usas. 
- **@localhost:5432** es la configuración por default de postgres para la DB local.
- **/koywe_db** es el nombre de la base de datos que debes crear (Puedes hacerlo desde PgAdmin si lo deseas). 

&nbsp;

## Inicia prisma

**Crea** las tablas para que coincidan con el schema `schema.prisma`.
Luego inicia el cliente de la DB para poder continuar. (Es importante que tengas el archivo .env dentro de la raiz del server)

&nbsp;
Nota:
 - Si en algun momento tienes problemas con que prisma no exporta PrismaClient:
 - Elimina la carpeta de node_modules y package-lock.json
 - Cierra el editor de código.
 - Vuelva a seguir los pasos para iniciar Prisma.

&nbsp;

```bash
cd server
cd prisma

# Crear las tablas en tu base de datos, devolvera un mensaje cuando termine
npx prisma db push
# Ejecuta el comando para generar el cliente de Prisma
npx prisma generate
# Te devolvera un mensaje de éxito.
```

## ¿Por qué PostgreSQL?
Porque pense la API a grande escala y no me quede solo con la parte de "challenge". Por lo tanto, para una API de tipo exchange es mejor utilizar una estructura relacional como **PostgreSQL** que permite definir relaciones claras entre entidades (usuarios, transacciones, etc.).


## ¿Por qué Prisma?
Se eligió **Prisma** como ORM (Object Relational Mapping) por su facilidad de uso y sy integración con **TypeScript**.

&nbsp;

[Volver al README principal](../README.md)
