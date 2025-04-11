/**
 * Este archivo configura y arranca la aplicación NestJS, implementando medidas de seguridad, control de tráfico y documentación de la API.
 *
 * 1. **cors**: Middleware que habilita el soporte de Cross-Origin Resource Sharing (CORS), permitiendo que el servidor reciba solicitudes de diferentes dominios.
 * 2. **helmet**: Middleware que establece cabeceras HTTP de seguridad para proteger la aplicación contra ataques como XSS (Cross-Site Scripting) y clickjacking.
 * 3. **SwaggerModule** y **DocumentBuilder**: Utilizados para generar y configurar la documentación interactiva de la API, facilitando a los desarrolladores la comprensión de las rutas y el funcionamiento de la API.
 *
 * Pipes:
 *  **sanitize-html**
 *
 * El propósito principal de este archivo es establecer configuraciones de seguridad y control de tráfico antes de arrancar la aplicación y generar la documentación de la API para su uso por parte de otros desarrolladores.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SanitizePipe } from './common/pipes/sanitize.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cors({
      origin: process.env.FRONT_URL,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );
  app.use(helmet());
  //En caso de un html:
  app.useGlobalPipes(new SanitizePipe());

  const config = new DocumentBuilder()
    .setTitle('KOYWE CHALLENGE')
    .setDescription(
      'La API se encarga de generar cotizaciones en el mercado de cryptomonedas, permitiendo un input de tipo de divisa y monto de la misma para hacer un swap hacia otra divisa disponible',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT_SERVER ?? 8000,
    () => { console.log (`
╔═════════════════════════════════════════════════╗

       🟢 SERVIDOR ONLINE EN EL PUERTO: ${process.env.PORT_SERVER}
       📅 Fecha: ${new Date().toLocaleString()}
       
       ☕ Que tengas un lindo día...

╚═════════════════════════════════════════════════╝
      `)}
  );
}

bootstrap();
