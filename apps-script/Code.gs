const SPREADSHEET_ID = '1Gk99noDGNIW4xKD1ETsAECAyBPaaf2qVITaLhqAouwA';
const SUBMISSIONS_SHEET_NAME = 'Envios';
const SUBMISSION_HEADERS = [
  'folio',
  'fecha_envio',
  'clues_imb',
  'entidad',
  'nombre_de_la_unidad',
  'perfil',
  'preguntas_total',
  'preguntas_respondidas',
  'region',
  'estado',
  'estado',
];
const SECTION_SHEETS = {
  sec_a: 'Seccion_A',
  sec_b: 'Seccion_B',
  sec_c: 'Seccion_C',
  sec_d: 'Seccion_D',
  sec_d_coord: 'Seccion_D_Coordinacion',
  sec_e: 'Seccion_E',
  sec_e_coord: 'Seccion_E_Coordinacion',
  sec_f: 'Seccion_F',
};

function doGet(event) {
  const callback = event && event.parameter && event.parameter.callback;
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SUBMISSIONS_SHEET_NAME) || getSubmissionsSheet_(spreadsheet);
    const questionSchema = event && event.parameter && event.parameter.schema;
    let schemaQuestionCount = 0;
    if (questionSchema) {
      const schema = JSON.parse(questionSchema);
      ensureQuestionSchema_(spreadsheet, schema);
      schemaQuestionCount = schema.length;
    }
    return respond_({
      connected: true,
      sheet: sheet.getName(),
      schemaSynced: schemaQuestionCount > 0,
      schemaQuestionCount: schemaQuestionCount,
    }, callback);
  } catch (error) {
    return respond_({ connected: false, error: String(error) }, callback);
  }
}

function doPost(event) {
  const requestId = event && event.parameter && event.parameter.requestId;
  try {
    const rawBody = event && event.parameter && event.parameter.payload;
    if (!rawBody || rawBody.length > 250000) throw new Error('Solicitud vacía o demasiado grande.');

    const submission = JSON.parse(rawBody);
    if (!submission.submissionId || (!submission.cluesCode && !submission.regionName) || !submission.entityName || !Array.isArray(submission.answersBySection)) {
      throw new Error('Faltan datos institucionales requeridos.');
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      const submissionsSheet = getSubmissionsSheet_(spreadsheet);
      upsertRowByFolio_(submissionsSheet, [
        submission.submissionId,
        submission.submittedAt,
        submission.cluesCode,
        submission.entityName,
        submission.hospitalName,
        submission.role,
        submission.totalQuestions,
        submission.answeredQuestions,
        submission.regionName || '',
        submission.submissionStatus === 'completed' ? 'Completado' : 'Borrador',
        submission.submissionStatus === 'completed' ? 'Completado' : 'Borrador',
      ]);

      for (const section of submission.answersBySection) {
        const sheetName = SECTION_SHEETS[section.sectionId];
        if (!sheetName) throw new Error('Sección no reconocida: ' + section.sectionId);
        const sectionSheet = getSectionSheet_(spreadsheet, sheetName, Object.keys(section.answers || {}));
        const headers = sectionSheet.getRange(1, 1, 1, sectionSheet.getLastColumn()).getValues()[0];
        const row = headers.map((header, index) => {
          if (index === 0) return submission.submissionId;
          return toCellValue_(section.answers[header]);
        });
        upsertRowByFolio_(sectionSheet, row);
      }
    } finally {
      lock.releaseLock();
    }
    return submissionResponse_({ ok: true }, requestId);
  } catch (error) {
    return submissionResponse_({ ok: false, error: String(error) }, requestId);
  }
}

function getSubmissionsSheet_(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(SUBMISSIONS_SHEET_NAME);
  if (!sheet) {
    const legacySheet = spreadsheet.getSheetByName('Hoja 1');
    if (legacySheet && legacySheet.getLastRow() <= 1) {
      sheet = legacySheet;
      sheet.setName(SUBMISSIONS_SHEET_NAME);
    } else {
      sheet = spreadsheet.insertSheet(SUBMISSIONS_SHEET_NAME);
    }
  }

  if (sheet.getLastRow() === 0 || (sheet.getLastRow() === 1 && sheet.getRange(1, 1).getValue() === 'folio')) {
    sheet.getRange(1, 1, 1, SUBMISSION_HEADERS.length).setValues([SUBMISSION_HEADERS]);
    sheet.setFrozenRows(1);
  } else {
    ensureHeaders_(sheet, SUBMISSION_HEADERS);
  }
  return sheet;
}

function getSectionSheet_(spreadsheet, sheetName, questionIds) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) sheet = spreadsheet.insertSheet(sheetName);
  ensureHeaders_(sheet, ['folio'].concat(questionIds));
  return sheet;
}

function ensureQuestionSchema_(spreadsheet, schema) {
  const questionIdsBySection = {};
  for (const [questionId, sectionId] of schema) {
    if (!SECTION_SHEETS[sectionId]) continue;
    if (!questionIdsBySection[sectionId]) questionIdsBySection[sectionId] = [];
    questionIdsBySection[sectionId].push(questionId);
  }

  Object.keys(SECTION_SHEETS).forEach((sectionId) => {
    getSectionSheet_(spreadsheet, SECTION_SHEETS[sectionId], questionIdsBySection[sectionId] || []);
  });
}

function ensureHeaders_(sheet, requiredHeaders) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, requiredHeaders.length).setValues([requiredHeaders]);
    sheet.setFrozenRows(1);
    return;
  }

  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const existingHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  const newHeaders = requiredHeaders.filter((header) => existingHeaders.indexOf(header) === -1);
  if (newHeaders.length > 0) {
    sheet.getRange(1, lastColumn + 1, 1, newHeaders.length).setValues([newHeaders]);
  }
}

function upsertRowByFolio_(sheet, rowValues) {
  const lastRow = sheet.getLastRow();
  const match = lastRow > 1
    ? sheet.getRange(2, 1, lastRow - 1, 1).createTextFinder(String(rowValues[0])).matchEntireCell(true).findNext()
    : null;
  const targetRow = match ? match.getRow() : lastRow + 1;
  sheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);
}

function toCellValue_(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  return JSON.stringify(value);
}

function getResponseSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  return getSubmissionsSheet_(spreadsheet);
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function respond_(data, callback) {
  if (callback && /^__sheetsHealth_[A-Za-z0-9_]+$/.test(callback)) {
    return ContentService.createTextOutput(`${callback}(${JSON.stringify(data)});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return jsonResponse_(data);
}

function submissionResponse_(data, requestId) {
  if (requestId && /^submission_[A-Za-z0-9_]+$/.test(requestId)) {
    const message = JSON.stringify(JSON.stringify({ requestId: requestId, ...data }));
    return HtmlService.createHtmlOutput(
      '<script>parent.postMessage(JSON.parse(' + message + '), "*");</script>'
    );
  }
  return jsonResponse_(data);
}