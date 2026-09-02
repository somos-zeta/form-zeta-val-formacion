/**
 * SOMOS ZETA - SISTEMA DE CERTIFICADOS AUTOMATIZADOS
 * Jerarquía: Carpeta Raíz > Carpetas por Empresa > PDFs (AÑOMES_Nombre)
 */

// =====================================================================
// 1. CONFIGURACIÓN
// =====================================================================
const ID_PLANTILLA_CERTIFICADO = '1zP-MH9GoegeUT_txMJwdJaK2i9FIQ6jSxHKE6aXcn_o';
const ID_CARPETA_RAIZ = '1gMK2lJExZBVktzrf8sjQzUueSKzATQEM'; // Carpeta donde se crearán las de las empresas
const URL_FORMULARIO_WEB = 'https://somos-zeta.github.io/form-zeta-val-formacion/';
const MAIL_CONTACTO = 'formacion@somos-zeta.com';

// Nombre de la pestaña con la lista de participantes. Si no existe una con este
// nombre se usa la primera del archivo.
const NOMBRE_HOJA = 'Hoja 1';

// Columnas (1 = A). Si se reordena la planilla, se cambia acá y en ningún otro lado.
const COL = { nombre: 1, email: 2, empresa: 3, formacion: 4, horas: 5, fecha: 6, estado: 7, primeraRespuesta: 8 };
const ESTADO_INVITADO = 'Invitado';
const ESTADO_ENVIADO = 'Certificado Enviado';

/**
 * La hoja de participantes. En doPost no se puede usar getActiveSheet(): en un
 * webhook no hay "hoja activa" y puede devolver la pestaña equivocada.
 */
function getHojaParticipantes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(NOMBRE_HOJA) || ss.getSheets()[0];
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('🚀 Somos Zeta')
    .addItem('1. Enviar Invitaciones', 'enviarInvitaciones')
    .addToUi();
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function normalizarMail(v) {
  return String(v == null ? '' : v).toLowerCase().trim();
}

/**
 * Función para enviar el correo invitando a evaluar (Con diseño unificado Somos Zeta)
 */
function enviarInvitaciones() {
  const hoja = getHojaParticipantes();
  const datos = hoja.getDataRange().getValues();

  let enviados = 0;

  for (let i = 1; i < datos.length; i++) {
    let [nombre, email, empresa, formacion, horas, fecha, estado] = datos[i];

    // Solo enviamos si no se le mandó nada y si tiene un email cargado
    if (estado !== ESTADO_INVITADO && estado !== ESTADO_ENVIADO && email) {

      // Usamos el nombre si está cargado en el Excel, sino un saludo neutro
      let saludo = nombre ? `¡Hola <strong>${nombre}</strong>!` : `¡Hola!`;

      let htmlBody = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2d2b2c; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #2d2b2c; padding: 25px; text-align: center;">
            <img src="https://i.ibb.co/ccHsc2HC/Somos-Zeta-Exportar-Mesa-de-trabajo-1-copia.png" alt="Somos Zeta" style="max-height: 70px;">
          </div>
          <div style="padding: 35px 30px;">
            <p style="font-size: 18px; margin-top: 0;">${saludo}</p>
            <p style="font-size: 15px; line-height: 1.6;">Esperamos que hayas disfrutado la formación <strong>"${formacion}"</strong> y hayas podido sacarle el máximo provecho.</p>
            <p style="font-size: 15px; line-height: 1.6;">Para nosotros es clave tu opinión para seguir mejorando en <strong>Somos Zeta</strong>. Solo te tomará 2 minutos completarla para recibir tu certificado oficial:</p>

            <div style="text-align: center; margin: 35px 0;">
              <a href="${URL_FORMULARIO_WEB}" style="background-color: #7030a0; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Completar Evaluación</a>
            </div>

            <p style="font-size: 13px; color: #64748b; text-align: center; margin-bottom: 20px;">Importante: completá el formulario con <strong>esta misma dirección de correo</strong> (${email}), que es la que usamos para emitir tu certificado.</p>

            <p style="font-size: 12px; color: #64748b; text-align: center; margin-bottom: 30px;">Si el botón no funciona, copia este link en tu navegador:<br><a href="${URL_FORMULARIO_WEB}" style="color: #1c89af; word-break: break-all;">${URL_FORMULARIO_WEB}</a></p>

            <p style="font-size: 15px; line-height: 1.6; margin-bottom: 0;">Gracias por tu compromiso y predisposición.<br><strong>Leo y el equipo de Somos Zeta</strong></p>
          </div>
          <div style="background-color: #f8f9fc; padding: 30px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="font-weight: bold; font-size: 14px; margin-bottom: 20px; color: #7030a0;">SEGUINOS EN NUESTRAS REDES</p>
            <div style="margin-bottom: 25px;">
              <a href="https://www.somos-zeta.com" style="text-decoration: none; margin: 0 10px;">
                <img src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png" width="30" height="30" alt="Web">
              </a>
              <a href="https://www.instagram.com/somoszeta_da" style="text-decoration: none; margin: 0 10px;">
                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="30" height="30" alt="Instagram">
              </a>
              <a href="https://wa.me/5493496460513" style="text-decoration: none; margin: 0 10px;">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" width="30" height="30" alt="WhatsApp">
              </a>
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">© 2026 Somos Zeta Digital Advice.<br>Esperanza, Santa Fe, Argentina.</p>
          </div>
        </div>
      `;

      GmailApp.sendEmail(email, `Tu opinión sobre ${formacion} es clave`, "", {
        htmlBody: htmlBody,
        name: 'Somos Zeta Digital Advice'
      });

      hoja.getRange(i + 1, COL.estado).setValue(ESTADO_INVITADO);
      enviados++;
    }
  }

  SpreadsheetApp.getUi().alert(
    enviados === 0
      ? 'No había nadie pendiente de invitar.'
      : 'Listo: se enviaron ' + enviados + ' invitaciones.'
  );
}

/**
 * CONSULTA: el formulario pregunta, por correo, a qué inscripción corresponde
 * la persona. Devuelve la empresa y la formación que están cargadas en la
 * planilla, para mostrarlas como dato fijo en vez de dejar elegir.
 *
 * Solo responde con coincidencia exacta de correo y solo devuelve nombre,
 * empresa y formación: nunca la lista completa ni las respuestas de nadie.
 */
function doGet(e) {
  try {
    const correoBuscado = normalizarMail(e && e.parameter ? e.parameter.correo : '');
    if (!correoBuscado) {
      return jsonOut({ status: 'error', code: 'SIN_CORREO', message: 'Falta el correo.' });
    }

    const hoja = getHojaParticipantes();
    const datos = hoja.getDataRange().getValues();

    for (let i = 1; i < datos.length; i++) {
      const fila = datos[i];
      if (normalizarMail(fila[COL.email - 1]) !== correoBuscado) continue;

      return jsonOut({
        status: 'ok',
        nombre: String(fila[COL.nombre - 1] || ''),
        empresa: String(fila[COL.empresa - 1] || ''),
        formacion: String(fila[COL.formacion - 1] || ''),
        yaEnviado: fila[COL.estado - 1] === ESTADO_ENVIADO
      });
    }

    return jsonOut({ status: 'error', code: 'EMAIL_NO_ENCONTRADO', message: 'Email no encontrado' });
  } catch (error) {
    console.error('doGet falló: ' + (error && error.stack ? error.stack : error));
    return jsonOut({ status: 'error', code: 'ERROR_INTERNO', message: 'Error interno' });
  }
}

/**
 * WEBHOOK: Recibe el formulario, genera el certificado y envía el mail personalizado.
 *
 * Devuelve siempre un JSON con "status": success | already | error, y un "code"
 * estable para que el formulario pueda mostrar el mensaje adecuado. El formulario
 * lee esta respuesta, así que un error acá deja de ser invisible para la persona.
 */
function doPost(e) {
  // Dos envíos simultáneos podrían emitir dos certificados para la misma fila.
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (err) {
    return jsonOut({ status: 'error', code: 'OCUPADO', message: 'El sistema está procesando otra solicitud. Probá de nuevo en un minuto.' });
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOut({ status: 'error', code: 'SIN_DATOS', message: 'No llegaron datos del formulario.' });
    }

    let res;
    try {
      res = JSON.parse(e.postData.contents);
    } catch (err) {
      return jsonOut({ status: 'error', code: 'JSON_INVALIDO', message: 'No pudimos leer los datos del formulario.' });
    }

    const correoBuscado = normalizarMail(res.correo);
    if (!correoBuscado) {
      return jsonOut({ status: 'error', code: 'SIN_CORREO', message: 'No recibimos ninguna dirección de correo.' });
    }

    const hoja = getHojaParticipantes();
    const datos = hoja.getDataRange().getValues();

    for (let i = 1; i < datos.length; i++) {
      const fila = datos[i];
      const emailSheet = normalizarMail(fila[COL.email - 1]);
      if (!emailSheet || emailSheet !== correoBuscado) continue;

      const empresaSheet = fila[COL.empresa - 1];
      const formacion = fila[COL.formacion - 1];
      const horas = fila[COL.horas - 1];
      const fecha = fila[COL.fecha - 1];
      const estado = fila[COL.estado - 1];
      const numFila = i + 1;

      // Ya se le emitió el certificado: no generamos ni mandamos otro.
      if (estado === ESTADO_ENVIADO) {
        return jsonOut({
          status: 'already', code: 'YA_ENVIADO',
          message: 'Ya te habíamos enviado el certificado a esta dirección. Revisá tu correo, incluida la carpeta de no deseado.'
        });
      }

      // La fecha define el mes del certificado y el nombre del archivo.
      const fechaObj = new Date(fecha);
      if (!fecha || isNaN(fechaObj.getTime())) {
        return jsonOut({
          status: 'error', code: 'FALTA_FECHA',
          message: 'Tu inscripción no tiene cargada la fecha de la formación. Escribinos a ' + MAIL_CONTACTO + ' y lo resolvemos.'
        });
      }

      const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const mesYano = meses[fechaObj.getMonth()] + ' de ' + fechaObj.getFullYear();
      const anoMesFiltro = Utilities.formatDate(fechaObj, "GMT-3", "yyyyMM");

      // La empresa de la planilla manda: es la que cargamos nosotros. La del
      // formulario solo se usa si la fila vino vacía, así evitamos que un error
      // al elegir en el desplegable pise el dato bueno y cree carpetas sueltas.
      const empresaFinal = String(empresaSheet || '').trim() || String(res.empresa || '').trim() || 'Sin empresa';
      const nombreFinal = String(res.nombre || fila[COL.nombre - 1] || '').trim();
      if (!nombreFinal) {
        return jsonOut({ status: 'error', code: 'SIN_NOMBRE', message: 'No recibimos tu nombre y apellido.' });
      }

      const nombreArchivo = `${anoMesFiltro}_${nombreFinal}`;

      // 3. Gestión de Carpetas
      const carpetaRaiz = DriveApp.getFolderById(ID_CARPETA_RAIZ);
      const carpetasEmpresa = carpetaRaiz.getFoldersByName(empresaFinal);
      const carpetaDestino = carpetasEmpresa.hasNext() ? carpetasEmpresa.next() : carpetaRaiz.createFolder(empresaFinal);

      // 4. Generación del Slide (copia temporal que después se descarta)
      const copiaId = DriveApp.getFileById(ID_PLANTILLA_CERTIFICADO).makeCopy(nombreArchivo, carpetaDestino).getId();
      let pdf;
      try {
        const slide = SlidesApp.openById(copiaId);
        const shape = slide.getSlides()[0];

        shape.replaceAllText('{{Nombre y Apellido}}', nombreFinal);
        shape.replaceAllText('{{Nombre Empresa}}', empresaFinal);
        shape.replaceAllText('{{Nombre Formacion}}', String(formacion || ''));
        shape.replaceAllText('{{horas}}', String(horas == null ? '' : horas));
        shape.replaceAllText('{{Mes y año}}', mesYano);
        slide.saveAndClose();

        // 5. Conversión a PDF y archivado en la carpeta de la empresa.
        pdf = DriveApp.getFileById(copiaId).getAs('application/pdf').setName(nombreArchivo + '.pdf');
        carpetaDestino.createFile(pdf);
      } finally {
        // La copia de Slides es intermedia: el que queda guardado es el PDF.
        DriveApp.getFileById(copiaId).setTrashed(true);
      }

      // 6. CUERPO DE CORREO PERSONALIZADO (Somos Zeta Style)
      let htmlBody = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2d2b2c; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #2d2b2c; padding: 25px; text-align: center;">
              <img src="https://i.ibb.co/ccHsc2HC/Somos-Zeta-Exportar-Mesa-de-trabajo-1-copia.png" alt="Somos Zeta" style="max-height: 70px;">
            </div>
            <div style="padding: 35px 30px;">
              <p style="font-size: 18px; margin-top: 0;">¡Hola <strong>${nombreFinal}</strong>!</p>
              <p style="font-size: 15px; line-height: 1.6;">Gracias por haber completado la evaluación de la formación <strong>"${formacion}"</strong>. Tu feedback es fundamental para que sigamos impulsando la transformación digital en equipos como el de <strong>${empresaFinal}</strong>.</p>
              <p style="font-size: 15px; line-height: 1.6;">Adjunto a este correo encontrarás tu <strong>Certificado Oficial de Finalización</strong>.</p>
              <p style="font-size: 15px; line-height: 1.6; margin-bottom: 0;">¡Sigamos en contacto para llevar tu productividad al siguiente nivel!</p>
            </div>
            <div style="background-color: #f8f9fc; padding: 30px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="font-weight: bold; font-size: 14px; margin-bottom: 20px; color: #7030a0;">SEGUINOS EN NUESTRAS REDES</p>
              <div style="margin-bottom: 25px;">
                <a href="https://www.somos-zeta.com" style="text-decoration: none; margin: 0 10px;">
                  <img src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png" width="30" height="30" alt="Web">
                </a>
                <a href="https://www.instagram.com/somoszeta_da" style="text-decoration: none; margin: 0 10px;">
                  <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="30" height="30" alt="Instagram">
                </a>
                <a href="https://wa.me/5493496460513" style="text-decoration: none; margin: 0 10px;">
                  <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" width="30" height="30" alt="WhatsApp">
                </a>
              </div>
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">© 2026 Somos Zeta Digital Advice.<br>Esperanza, Santa Fe, Argentina.</p>
            </div>
          </div>
        `;

      GmailApp.sendEmail(res.correo, `Tu certificado: ${formacion}`, "", {
        htmlBody: htmlBody,
        attachments: [pdf],
        name: 'Somos Zeta Digital Advice'
      });

      // 7. Actualización del Sheet
      hoja.getRange(numFila, COL.nombre).setValue(nombreFinal);
      hoja.getRange(numFila, COL.empresa).setValue(empresaFinal);
      hoja.getRange(numFila, COL.estado).setValue(ESTADO_ENVIADO).setBackground('#d9ead3');

      const respuestas = [
        res.exp_general, res.expectativas, res.claridad, res.material,
        res.relevancia, res.ejemplos, res.ritmo, res.destacar,
        res.areas, res.herramientas, res.ejemplo_imp, res.nps,
        res.motivo, res.indecisos, res.comentarios
      ];
      hoja.getRange(numFila, COL.primeraRespuesta, 1, respuestas.length).setValues([respuestas]);

      return jsonOut({ status: 'success', code: 'OK' });
    }

    // Nadie en la planilla tiene ese correo.
    avisarCorreoNoEncontrado(res);
    return jsonOut({
      status: 'error', code: 'EMAIL_NO_ENCONTRADO',
      message: 'Email no encontrado'
    });

  } catch (error) {
    // Queda en el registro de ejecuciones para poder rastrearlo.
    console.error('doPost falló: ' + (error && error.stack ? error.stack : error));
    return jsonOut({
      status: 'error', code: 'ERROR_INTERNO',
      message: (error && error.message) ? error.message : 'Error interno'
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Cuando alguien completa la evaluación con un correo que no está en la lista,
 * sus respuestas se perderían sin que nadie se entere. Avisamos para poder
 * emitir el certificado a mano.
 */
function avisarCorreoNoEncontrado(res) {
  try {
    const filas = [
      ['Correo cargado', res.correo],
      ['Nombre', res.nombre],
      ['Empresa', res.empresa],
      ['Experiencia general', res.exp_general],
      ['NPS', res.nps],
      ['Comentarios', res.comentarios]
    ].map(function (f) {
      return '<tr><td style="padding:4px 10px 4px 0;color:#64748b;">' + f[0] + '</td><td style="padding:4px 0;"><strong>' + (f[1] == null ? '' : f[1]) + '</strong></td></tr>';
    }).join('');

    GmailApp.sendEmail(MAIL_CONTACTO, 'Evaluación sin certificado: correo fuera de la lista', '', {
      name: 'Somos Zeta Digital Advice',
      htmlBody:
        '<div style="font-family:Segoe UI,Tahoma,sans-serif;color:#2d2b2c;max-width:600px;">' +
        '<p>Alguien completó la evaluación con un correo que no figura en la planilla, ' +
        'así que <strong>no se emitió ningún certificado</strong>.</p>' +
        '<table style="font-size:14px;border-collapse:collapse;">' + filas + '</table>' +
        '<p style="font-size:13px;color:#64748b;">Si corresponde, agregá la fila en la planilla y ' +
        'pedile que vuelva a enviar el formulario.</p></div>'
    });
  } catch (err) {
    console.error('No se pudo avisar del correo no encontrado: ' + err);
  }
}
