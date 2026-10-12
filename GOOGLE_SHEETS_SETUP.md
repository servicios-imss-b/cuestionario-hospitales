# Google Sheets

La [hoja Cuestionario Hospitalario IMSS Bienestar](https://docs.google.com/spreadsheets/d/1Gk99noDGNIW4xKD1ETsAECAyBPaaf2qVITaLhqAouwA/edit) ya está conectada con el [proyecto Apps Script](https://script.google.com/home/projects/1JpeD1u265DhbZbwmoa6Xf7lgybFfWng5bdG8pj9YFVvfiUHy5hHKTEid/edit), desplegado como aplicación web que se ejecuta como la cuenta propietaria y admite cualquier usuario.

Vite carga la URL de despliegue desde `.env.local`, un archivo ignorado por Git. Tras modificar `apps-script/Code.gs`, guarda y actualiza la implementación; reemplaza la URL `/exec` de ese archivo si Google genera una distinta.

Cada folio crea o actualiza una fila en `Envios` y una fila en la pestaña de cada sección activa (`Seccion_A` a `Seccion_I`). Los cambios se sincronizan después de cada respuesta; `estado` indica `Borrador` o `Completado`. `Envios.folio` es la clave primaria; la columna `folio` en cada pestaña de sección funciona como clave foránea para relacionar las respuestas. Las columnas de respuesta usan los IDs de pregunta (`C1`, `C2`, etc.), excepto la edad, que usa el encabezado explícito `edad_anios_exacta`. El texto libre queda como texto normal en su celda. Las respuestas compuestas, como matrices o selecciones múltiples, se serializan en esa celda.

La edad se captura y almacena como el número entero exacto ingresado (entre 25 y 80); no se convierte a “mayor que”, “menor que” ni a una categoría dentro de la hoja. Al sincronizar el esquema, la columna existente `A3` en `Seccion_A` se renombra a `edad_anios_exacta` sin borrar sus valores. Para presentaciones e informes, se reporta solo por rangos y no se cruza la edad con hospital ni sexo; limita el acceso a la hoja que contiene la edad exacta. Los coordinadores se registran por entidad y región, sin CLUES hospitalaria; los directores sí conservan la CLUES.

La pestaña original `Hoja 1` y las antiguas pestañas regionales se conservan como archivo del formato anterior. Los reintentos actualizan las filas existentes por folio para no duplicarlas.

Los cuestionarios se guardan primero en el navegador y pasan a Google Sheets cuando hay Internet y la base responde. El acceso “Cualquier usuario” deja público el endpoint de escritura; puede recibir envíos no deseados. No se almacenan nombres, correos ni otros datos personales en el cuestionario.