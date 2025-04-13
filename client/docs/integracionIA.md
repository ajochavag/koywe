*El estilo de este readme fue hecho con OpenIA y ajustado manualmente para declarar su verdadera función*

# 🤖 Uso de Inteligencia Artificial en el Proyecto

[Volver al README principal](../README.md)


Durante el desarrollo de la interfaz de usuario (UI) de esta aplicación, se utilizó inteligencia artificial generativa (IA) como apoyo en las siguientes áreas:

&nbsp;

## 1. 🎨🖼️ Diseño de Interfaz de Usuario (UI) 

Asistencia con IA:

Se solicitó a la IA la generación de estructuras HTML y JTSX estilizadas con los estilos que adquirimos anteriormente de la página de Koywe inspeccionando la paleta de colores.

✅ Beneficios:

Reducción significativa del tiempo de maquetado.

Prototipado rápido sin necesidad de diseñador UI inicial.

&nbsp;

&nbsp;

## 2. 🧩✔️ Manejo de Estado y Validación 

Asistencia con IA:

Recomendaciones sobre el uso de react-hook-form para gestionar formularios de manera sencilla y escalable.

✅ Beneficios:

Código más limpio y fácil de mantener.

Validaciones frontales.

Mejora en el control de errores y respuestas.

&nbsp;

## 2. 🔒✔️ Middleware de Seguridad con `jose`

Se implementó para gestionar:
- La verificación asíncrona de tokens JWT.
- **protección de rutas** [jose - npm](https://www.npmjs.com/package/jose), combinandolo con la función middleware que ofrece Next como herramienta de Server Side Rendering.

✅ Beneficios:

- Me permitio evitar la mala práctica de usar useEffect en el cliente.
- Seguridad extra a las Cookies consultando desde nuestro back-end.
- Evitar lo que se conoce como *"navegación directa"* o *"acceso directo por URL"*.
  - No se puede saltear la autenticación.
  - Evitamos que: Next renderice 1 segundo la página antes de cargar el contenido del storage (lo que permite ver al usuario 1 segundo su contenido).

&nbsp;

## ✨ Conclusión

El uso de IA como copiloto de desarrollo permitió acelerar el diseño, implementar mejores prácticas, y mejorar tanto la estructura visual como funcional de la aplicación. Aunque el diseño inicial fue generado con IA, cada componente fue revisado, validado y ajustado manualmente.

&nbsp;

[Volver al README principal](../README.md)
