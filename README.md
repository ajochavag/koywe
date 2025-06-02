# Koywe Challenge API

Aplicacion construida con NestJS para el desafío de Koywe. Permite generar y obtener cotizaciones de forma segura utilizando autenticación.

## 🚀 Tecnologías

- [NestJS](https://nestjs.com/)
- JWT para autenticación
- Mongoose (MongoDB)
- Axios para consumo de APIs externas (CryptoMarket)

---

## ⚙️ Instrucciones

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/ajochavag/koywe.git
   cd koywe-challenge
   ```

2. **Instalar dependencias**
   ```bash
      npm install
   ```

3. **Crear archivo .env** 
    ```env
        PORT=3000
        MONGO_URL= URL_MONGO
        JWT_SECRET= SECRETO_JWLT
        EXCHANGE_CRYPTO_MKT_BASE_URL=https://api.exchange.cryptomkt.com
    ```

---

## 🛠️ Ejecutar la aplicación en modo desarrollo.

```bash
npm run start:dev
```

---

## 💰 Autenticación

La autenticación se realiza con JWT. Tras registrarte o iniciar sesión, obtienes un token que debes enviar en el header:

```
Authorization: Bearer <token>
```

Si no lo envías o es inválido, recibirás un `401 Unauthorized`.

- 🔑 Endpoints disponibles:
  - `POST /auth/register` → Registra un nuevo usuario.
  - `POST /auth/login` → Devuelve un token válido al autenticar.

- ❌ Manejo de Errores

  - `401 Unauthorized`: Si no envías el token, es inválido o expiró.
---

## ✅ Testing

### Unitarios
```bash
npm run test
```

---

## 📅 Estructura

```
src/
├── app/
│   ├── controllers/
│   ├── dto/
│   ├── modules/
├── context/
│   ├── auth/
│   ├── quote/
│   └── shared/
```

---

## Documentación

La documentación se encuentra disponible en la siguiente url:

[http://localhost:3000/api](http://localhost:3000/api)

Nota: el puerto puede cambiar dependiendo de la variable de entorno PORT.
