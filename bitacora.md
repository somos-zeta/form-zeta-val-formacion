# Bitácora — sz-formularios-web

Memoria viva del proyecto. Entradas más recientes arriba.
La destila el cerebro con `/destilar`.

---

## 2026-09-02 — Certificados: fin del fallo silencioso y empresa no elegible

**Qué se hizo**
- Se dio acceso de escritura a Lzequin19 sobre `somos-zeta/form-zeta-val-formacion`
  (en repos de cuenta personal no hay selector de rol: el colaborador entra con
  permiso de escritura directo).
- Se bajó el Apps Script con `clasp` y se versionó en `apps-script/`. Hasta ahora
  el repo tenía solo el `index.html`: la mitad del sistema vivía solo en Google.
- **Fallo silencioso resuelto.** El `doPost` ya devolvía
  `{"status":"error","message":"Email no encontrado"}`, pero el formulario hacía el
  `fetch` con `mode: 'no-cors'`, que da una respuesta opaca: el `.then()` se cumplía
  siempre y la persona veía "¡Evaluación enviada!" aunque no se emitiera nada.
- **La empresa dejó de ser elegible.** Antes cualquiera podía elegir una de las 58
  organizaciones del desplegable y sacar un certificado a nombre de una empresa que
  no contrató la formación. Ahora sale de la planilla vía un `doGet` nuevo.
- Validación de correo con detección de dominios mal tipeados, aviso si falta el
  apellido, confirmación del correo antes de enviar y borrador local en
  `localStorage` con vencimiento a 7 días.
- Arreglos del Apps Script: el PDF no se archivaba (se creaba la copia, se convertía
  y se tiraba, dejando las carpetas por empresa vacías); un segundo envío emitía un
  certificado duplicado; `getActiveSheet()` en un webhook; falta de `LockService`;
  y aviso por mail a formación cuando alguien completa con un correo fuera de lista.
- Promovido a producción y verificado en vivo contra `somos-zeta.github.io`.

**Decisiones**
- El backend ignora la empresa que manda el formulario y usa la de la planilla. La
  del formulario solo se usa si la fila vino vacía. Antes la pisaba y podía crear
  carpetas sueltas en Drive.
- Un correo que no figura en la lista **frena en el paso 1** en vez de dejar
  completar 18 preguntas para fallar al final.
- Si el `doGet` no responde (sin conexión o backend sin desplegar) el formulario
  **no bloquea**: muestra un texto neutro y sigue, porque el backend usa igual la
  empresa de la planilla.
- Se eliminaron la lista de 58 empresas y las 14 funciones del buscador, que
  quedaron sin uso. El `index.html` bajó de 1326 a 1075 líneas.
- Se aceptó que el `doGet` permite preguntar si un correo está inscripto. Es el
  precio de resolver la empresa sin pedir contraseña; la alternativa evaluada y no
  implementada es un token único en el link de invitación.
- El `.clasp.json` va al `.gitignore` porque el repo es público.

**Pendientes / próximo paso**
- La primera evaluación real es la confirmación definitiva: no se probó el envío
  con un correo de una persona real para no arriesgar un certificado duplicado.
- 27 de las 68 filas de la planilla son de un Google Form viejo de octubre 2025,
  pegadas en la misma hoja con las columnas corridas un lugar (arrancan con un
  timestamp). El script no las procesa. Falta limpieza a mano.
- Opción abierta: token único en el link de invitación. Cerraría la consulta por
  correo y eliminaría del todo el problema del correo mal tipeado.
- Verificar que `NOMBRE_HOJA` en el Apps Script coincida con la pestaña real; hoy
  cae al fallback de la primera hoja.

**Archivos / áreas tocadas:** `index.html`, `apps-script/Código.js` (nuevo),
`apps-script/README.md` (nuevo), `apps-script/appsscript.json` (nuevo),
`.gitignore` (nuevo), `bitacora.md` (nuevo). Commits `613a84d`, `7f79da0`,
`2d74c15`, `f5e8e1d`, mergeados a `main`.
