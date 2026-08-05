# Fase D - Task 4: SetupScreen + route

## Estado
Implementado y funcional. Construcción y pruebas sin errores.

## Cambios
- Creado `src/ui/SetupScreen.tsx` con su CSS: permite configurar evento, clanes (crear, modificar nombre, logo, eliminar), importar CSV/JSON de preguntas y reiniciar partida.
- Modificado `src/App.tsx` para registrar la ruta `/setup`.
- Agregados enlaces de navegación a `/setup` desde `HostScreen` y `PublicScreen`.
- Clanes nuevos por defecto toman iniciales (`logoUrl: null`); IDs generados a partir de slug del nombre.
- Si hay menos de 2 clanes, se muestra un banner de error.
- Se puede limpiar el banco personalizado para volver a las preguntas embebidas.

## Siguientes Pasos
- Completar la fase D (testing E2E o despliegue, si aplica).