# Google Sheets

La [hoja Cuestionario Hospitalario IMSS Bienestar](https://docs.google.com/spreadsheets/d/1Gk99noDGNIW4xKD1ETsAECAyBPaaf2qVITaLhqAouwA/edit) ya está conectada con el [proyecto Apps Script](https://script.google.com/home/projects/1JpeD1u265DhbZbwmoa6Xf7lgybFfWng5bdG8pj9YFVvfiUHy5hHKTEid/edit), desplegado como aplicación web que se ejecuta como la cuenta propietaria y admite cualquier usuario.

Vite carga la URL de despliegue desde `.env.local`, un archivo ignorado por Git. Tras modificar `apps-script/Code.gs`, guarda y actualiza la implementación; reemplaza la URL `/exec` de ese archivo si Google genera una distinta.

Cada cuestionario completado genera una fila en `Envios` y una fila en la pestaña de cada sección activa (`Seccion_A`, `Seccion_B`, `Seccion_C`, `Seccion_D`, `Seccion_D_Coordinacion`, `Seccion_E`, `Seccion_E_Coordinacion` y `Seccion_F`). `Envios.folio` es la clave primaria; la columna `folio` en cada pestaña de sección funciona como clave foránea para relacionar las respuestas. Las columnas de respuesta usan los IDs de pregunta (`C1`, `C2`, etc.); el texto libre queda como texto normal en su celda. Las respuestas compuestas, como matrices o selecciones múltiples, se serializan en esa celda.

La edad se valida exacta en el navegador y en `Seccion_A` solo se guarda como rango (`Menos de 40`, `40 a 49`, `50 a 59`, `60 o más`). Los coordinadores se registran por entidad y región, sin CLUES hospitalaria; los directores sí conservan la CLUES.

La pestaña original `Hoja 1` se conserva como archivo del formato anterior. Los reintentos actualizan las filas existentes por folio para no duplicarlas.

Los cuestionarios se guardan primero en el navegador y pasan a Google Sheets cuando hay Internet y la base responde. El acceso “Cualquier usuario” deja público el endpoint de escritura; puede recibir envíos no deseados. No se almacenan nombres, correos ni otros datos personales en el cuestionario.