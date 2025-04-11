# 🤖 Uso de Inteligencia Artificial en el Proyecto

Durante el desarrollo de este proyecto, utilicé el servicio de ChatGPT (OpenAI) y GitHub Copilot Chat.
Especialmente fué utilizada para desarrollar los test y garantizar un correcto funcionamiento, además de crear un código robusto y mantenibe.

[Volver al README principal](../README.md)

&nbsp;

## 1. 🧪 Generación y Validación de Tests (Unitarios e Integración)

Generé tests unitarios e integración siguiendo principios de TDD (Test Driven Development) y AAA (Arrange Action Assert).

Asegurar la correcta cobertura de funcionalidades críticas mediante test cases validados.

Proveer sugerencias de testeo extremo y validación de errores (e.g., datos inválidos, flujo negativo, etc.).

💡 Ventaja: Esto permitió asegurar una alta cobertura de código desde el inicio y reducir significativamente el margen de errores humanos en la validación lógica.

&nbsp;

## 2. 🛡️ Pipe de Sanitización de Entradas (SanitizePipe)
Librerias:
- [npm i sanitize-html](https://www.npmjs.com/package/sanitize-html)
- [npm i @types/sanitize-html](https://www.npmjs.com/package/@types/sanitize-html)

&nbsp;

Se diseñó e implementó con ayuda de IA un Pipe global de sanitización para prevenir ataques XSS (Cross-Site Scripting). Esta clase inspecciona de forma recursiva los inputs provenientes de body, query o params, limpiando etiquetas HTML potencialmente maliciosas.

Características del Pipe:

- Soporta inputs tipo string o object (con recursividad para objetos anidados).

- Es agnóstico al origen del dato (se puede aplicar globalmente o por ruta).

- Mejora la seguridad sin afectar la estructura ni el contenido válido.

**¿Por qué es importante?**

El uso de este pipe asegura que cualquier dato recibido desde clientes o consumidores de la API no pueda explotar vulnerabilidades comunes como la inyección de scripts, protegiendo así tanto el servidor como a los usuarios finales.

&nbsp;

## 3. 🧩 Tipado Dinámico con Prisma y AI
Se aprovechó para el diseño del servicio y tipado, ya que las instrucciones de la documentación y algunas de las dependencias hacian causar errores de compatibilidad.

[Documentacion NEST.js + Prisma:](https://docs.nestjs.com/recipes/prisma)

Ejemplo: UserService usando tipos inferidos dinámicamente
ts
Copiar
Editar
export type Users = Awaited<ReturnType<typeof prisma.user.findFirst>>;
¿Por qué es útil este enfoque?
Tipos fuertemente tipados y sincronizados con la base de datos sin necesidad de duplicar interfaces manualmente.

Reducción de errores en tiempo de compilación, especialmente útil en proyectos que escalan rápidamente.

Mayor mantenibilidad del código al estar alineado con los modelos reales de Prisma.

Este patrón facilita el desarrollo robusto y seguro al tener validación de tipo automática, lo cual ayuda a detectar errores antes de que lleguen al runtime.

&nbsp;

## ✅ Conclusión

El uso de la IA fue principalmente para desarrollar los test bajo el patrón AAA.

Crear el código de la pipe asegurando su función.

Optimización, aceleración y seguridad en el desarrollo.

&nbsp;

[Volver al README principal](../README.md)

