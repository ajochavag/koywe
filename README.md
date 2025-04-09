# Server

## Arquitectura Modular basada en Dominios (Feature-Based Modular Architecture)
## ⚡¿Por qué migrar a Modular basada en Dominios?
Porque este patrón:
Nos permite separar claramente la lógica de negocio (BLL) del acceso a datos (DAL), y además lo hace por funcionalidad, lo cual es mucho más limpio y mantenible.

✅ Agrupa toda la lógica relacionada a una funcionalidad específica en un solo lugar (controlador, servicios, DTOs, modelos, etc.).

✅ Permite escalar de forma limpia (agregar nuevas features = nuevos módulos).

✅ Es más fácil de testear, mantener y delegar a diferentes miembros del equipo.


*Ejemplo de estructura:*

````
conversion/
├── conversion.controller.ts  # Lógica de entrada/salida (HTTP)
├── conversion.facade.ts      # Orquestador entre controller y lógica interna
├── conversion.bll.ts         # Business Logic Layer - lógica de negocio
├── conversion.dal.ts         # Data Access Layer - acceso a datos o API externa
├── conversion.provider.ts    # Configuración de servicios externos
├── dto/
│   └── convert.dto.ts
├── models/
│   └── currency.model.ts
````
## Ventajas de uso:
✅ Alta cohesión y bajo acoplamiento: cada capa hace sólo lo que debe.

✅ Fácil testeo unitario: podés testear la BLL sin depender de la DAL o controller.

✅ Fácil mantenimiento: si cambia una API externa, solo se modifica el dal.ts.

✅ Reutilización: el bll se puede usar desde otras capas o servicios si es necesario.
