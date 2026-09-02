# Apps Script de certificados

El backend del formulario. Vive ligado a la planilla **BD_Formacion_Certificados**
(propietaria: `formacion@somos-zeta.com`) y por eso no aparece como archivo suelto
al buscar en Drive.

## Qué hace

1. **`enviarInvitaciones()`** — se corre a mano desde el menú *🚀 Somos Zeta* de la
   planilla. Le manda el link del formulario a cada fila que todavía no fue
   invitada y marca `estado = Invitado`.
2. **`doGet(e)`** — el formulario le pregunta, por correo, a qué inscripción
   corresponde la persona, y muestra la empresa y la formación **como dato fijo**.
   Así nadie puede atribuirse una empresa que no contrató la formación.
3. **`doPost(e)`** — recibe el formulario, busca la fila **por correo**, genera el
   certificado a partir de la plantilla de Slides, lo archiva en la carpeta de la
   empresa, lo manda por mail y vuelca las 15 respuestas en la planilla.

## Lo que hay que entender antes de tocarlo

La planilla **precarga una fila por persona invitada**, con nombre, correo,
empresa, formación, horas y fecha. El formulario no pregunta el curso ni la fecha:
salen de ahí. El cruce es por correo.

> Si la persona completa el formulario con un correo que no está en la planilla,
> **no hay certificado**. Por eso la invitación insiste con usar esa misma
> dirección, y por eso `doPost` avisa a `formacion@somos-zeta.com` cuando pasa.

`doGet` solo responde con coincidencia exacta de correo y solo devuelve nombre,
empresa y formación. Aun así, cualquiera que sepa una dirección puede preguntar si
está inscripta: es el precio de resolver la empresa sin pedir contraseña. Si eso
molesta, la alternativa es mandar un token único en el link de la invitación.

Las columnas están mapeadas en la constante `COL`. Si se reordena la planilla, se
cambia ahí y en ningún otro lado. Los nombres de los campos que manda el formulario
(`res.correo`, `res.nombre`, `res.exp_general`, …) tienen que seguir coincidiendo
con los del `index.html`.

## Trabajar con el código

`clasp` conecta esta carpeta con el proyecto de Google. No viaja por git, así que
en cada máquina hay que repetirlo:

```bash
npm i -g @google/clasp     # si no está
clasp login                # una vez por máquina
```

También hay que habilitar la Apps Script API una sola vez, en
<https://script.google.com/home/usersettings>.

El archivo `.clasp.json` está en el `.gitignore` porque el repo es público. Para
regenerarlo, dentro de esta carpeta:

```bash
clasp clone <SCRIPT_ID>    # el id sale de la URL en Extensiones > Apps Script
```

Después:

```bash
clasp pull                 # traer lo que esté en Google
clasp push                 # subir los cambios locales
```

## Publicar los cambios

`clasp push` sube el código, pero **el formulario sigue llamando a la versión
desplegada**, no a la última guardada. Para que un cambio tenga efecto hay que
crear una versión nueva de la implementación web:

1. En el editor de Apps Script: **Implementar → Gestionar implementaciones**.
2. Editar la implementación existente y elegir **Versión nueva**.
3. Guardar. La URL `/exec` no cambia, así que no hay que tocar el `index.html`.

Si en cambio se crea una implementación nueva desde cero, la URL cambia y hay que
actualizar `SCRIPT_URL` en el `index.html`.

## Configuración

`NOMBRE_HOJA` tiene que coincidir con el nombre de la pestaña de participantes. Si
no coincide se usa la primera pestaña del archivo, que es el comportamiento que
había antes; conviene igual dejarlo correcto.
