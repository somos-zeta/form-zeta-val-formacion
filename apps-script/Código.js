/**
 * SOMOS ZETA - SISTEMA DE CERTIFICADOS AUTOMATIZADOS
 * Jerarquía: Carpeta Raíz > Carpetas por Empresa > PDFs (AÑOMES_Nombre)
 */

// =====================================================================
// 1. CONFIGURACIÓN (REEMPLAZÁ CON TUS IDs REALES)
// =====================================================================
const ID_PLANTILLA_CERTIFICADO = '1zP-MH9GoegeUT_txMJwdJaK2i9FIQ6jSxHKE6aXcn_o'; 
const ID_CARPETA_RAIZ = '1gMK2lJExZBVktzrf8sjQzUueSKzATQEM'; // Carpeta donde se crearán las de las empresas
const URL_FORMULARIO_WEB = 'https://somos-zeta.github.io/form-zeta-val-formacion/'; 

function onOpen() {
  SpreadsheetApp.getUi().createMenu('🚀 Somos Zeta')
    .addItem('1. Enviar Invitaciones', 'enviarInvitaciones')
    .addToUi();
}

/**
 * Función para enviar el correo invitando a evaluar (Con diseño unificado Somos Zeta)
 */
function enviarInvitaciones() {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const datos = hoja.getDataRange().getValues();
  
  for (let i = 1; i < datos.length; i++) {
    let [nombre, email, empresa, formacion, horas, fecha, estado] = datos[i];
    
    // Solo enviamos si no se le mandó nada y si tiene un email cargado
    if (estado !== 'Invitado' && estado !== 'Certificado Enviado' && email) {
      
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
      
      hoja.getRange(i + 1, 7).setValue('Invitado');
    }
  }
}

/**
 * WEBHOOK: Recibe el formulario, genera el certificado y envía el mail personalizado
 */
function doPost(e) {
  try {
    const res = JSON.parse(e.postData.contents);
    const hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const datos = hoja.getDataRange().getValues();
    
    for (let i = 1; i < datos.length; i++) {
      let [nombreSheet, emailSheet, empresaSheet, formacion, horas, fecha, estado] = datos[i];
      
      // Buscamos coincidencia por correo (en el form se llama 'correo')
      if (emailSheet && emailSheet.toString().toLowerCase().trim() === res.correo.toLowerCase().trim()) {
        
        // 1. Lógica de Fechas
        let fechaObj = new Date(fecha);
        let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        let mesYano = meses[fechaObj.getMonth()] + ' de ' + fechaObj.getFullYear();
        let anoMesFiltro = Utilities.formatDate(fechaObj, "GMT-3", "yyyyMM");
        
        // 2. Datos finales
        let empresaFinal = res.empresa ? res.empresa : empresaSheet;
        let nombreArchivo = `${anoMesFiltro}_${res.nombre}`;

        // 3. Gestión de Carpetas
        let carpetaRaiz = DriveApp.getFolderById(ID_CARPETA_RAIZ);
        let carpetasEmpresa = carpetaRaiz.getFoldersByName(empresaFinal);
        let carpetaDestino = carpetasEmpresa.hasNext() ? carpetasEmpresa.next() : carpetaRaiz.createFolder(empresaFinal);

        // 4. Generación del Slide
        const copiaId = DriveApp.getFileById(ID_PLANTILLA_CERTIFICADO).makeCopy(nombreArchivo, carpetaDestino).getId();
        const slide = SlidesApp.openById(copiaId);
        const shape = slide.getSlides()[0];
        
        shape.replaceAllText('{{Nombre y Apellido}}', res.nombre);
        shape.replaceAllText('{{Nombre Empresa}}', empresaFinal);
        shape.replaceAllText('{{Nombre Formacion}}', formacion); 
        shape.replaceAllText('{{horas}}', horas.toString());
        shape.replaceAllText('{{Mes y año}}', mesYano);
        slide.saveAndClose();
        
        // 5. Conversión a PDF
        const pdf = DriveApp.getFileById(copiaId).getAs('application/pdf');

        // 6. CUERPO DE CORREO PERSONALIZADO (Somos Zeta Style)
        let htmlBody = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2d2b2c; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #2d2b2c; padding: 25px; text-align: center;">
              <img src="https://i.ibb.co/ccHsc2HC/Somos-Zeta-Exportar-Mesa-de-trabajo-1-copia.png" alt="Somos Zeta" style="max-height: 70px;">
            </div>
            <div style="padding: 35px 30px;">
              <p style="font-size: 18px; margin-top: 0;">¡Hola <strong>${res.nombre}</strong>!</p>
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
        hoja.getRange(i + 1, 1).setValue(res.nombre);
        hoja.getRange(i + 1, 3).setValue(empresaFinal);
        hoja.getRange(i + 1, 7).setValue('Certificado Enviado').setBackground('#d9ead3');
        
        const respuestas = [
          res.exp_general, res.expectativas, res.claridad, res.material, 
          res.relevancia, res.ejemplos, res.ritmo, res.destacar, 
          res.areas, res.herramientas, res.ejemplo_imp, res.nps, 
          res.motivo, res.indecisos, res.comentarios
        ];
        hoja.getRange(i + 1, 8, 1, respuestas.length).setValues([respuestas]);
        
        DriveApp.getFileById(copiaId).setTrashed(true);
        return ContentService.createTextOutput(JSON.stringify({"status": "success"}));
      }
    }
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": "Email no encontrado"}));
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.message}));
  }
}