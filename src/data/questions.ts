import { Question, MatrixItem, QuestionOption } from '../types/questionnaire';

export const MATRIX_C1_DIRECTOR_ITEMS: MatrixItem[] = [
  { id: 'c1_1', label: 'Abasto de medicamentos conforme al CPM institucional' },
  { id: 'c1_2', label: 'Abasto de material de curación conforme al CPM institucional' },
  { id: 'c1_3', label: 'Suficiencia de médicos especialistas adicional' },
  { id: 'c1_4', label: 'Suficiencia de personal de enfermería adicional' },
  { id: 'c1_4_1', label: 'Suficiencia de personal paramédico adicional' },
  { id: 'c1_5', label: 'Equipo médico en funcionamiento' },
  { id: 'c1_6', label: 'Conservación y mantenimiento del inmueble' },
  { id: 'c1_7', label: 'Servicios generales (limpieza, lavandería, alimentación, vigilancia)' },
  { id: 'c1_7_1', label: 'Instalaciones electromecánicas en funcionamiento (elevadores, aire acondicionado, calderas, planta de emergencia)' },
  { id: 'c1_8', label: 'Recursos para gastos de operación' },
  { id: 'c1_9', label: 'Trámites administrativos (compras, contratación y pagos)' },
  { id: 'c1_10', label: 'Referencia y contrarreferencia de pacientes' },
  { id: 'c1_11', label: 'Sistemas informáticos y conectividad' },
  { id: 'c1_12', label: 'El Modelo médico de gestión' },
];

export const MATRIX_C1_ITEMS = MATRIX_C1_DIRECTOR_ITEMS;

export const MATRIX_C1_COLUMNS: QuestionOption[] = [
  { value: 'Mejoró', label: 'Mejoró' },
  { value: 'Igual', label: 'Igual' },
  { value: 'Empeoró', label: 'Empeoró' },
  { value: 'No me consta', label: 'No me consta' },
];

export const C2_OPTIONS: QuestionOption[] = MATRIX_C1_DIRECTOR_ITEMS.map((item) => ({
  value: item.id,
  label: item.label,
}));

export const QUESTIONS_CATALOG: Question[] = [
  // ==========================================
  // SECCIÓN A. Perfil del informante
  // ==========================================
  {
    id: 'A3',
    sectionId: 'sec_a',
    sectionTitle: 'Sección A. Perfil del informante',
    text: '¿Cuántos años cumplidos tiene?',
    roleDisplayIds: { coordinador: 'A2' },
    type: 'number',
    required: true,
    validation: {
      min: 25,
      max: 80,
    },
    help: 'Número entero de 25 a 80 años. Se conserva la edad exacta en las respuestas.',
  },
  {
    id: 'A4',
    sectionId: 'sec_a',
    sectionTitle: 'Sección A. Perfil del informante',
    text: 'Sexo',
    roleDisplayIds: { coordinador: 'A3' },
    type: 'single',
    required: true,
    options: [
      { value: 'Mujer', label: 'Mujer' },
      { value: 'Hombre', label: 'Hombre' },
      { value: 'Prefiero no responder', label: 'Prefiero no responder' },
    ],
  },
  {
    id: 'A5',
    sectionId: 'sec_a',
    sectionTitle: 'Sección A. Perfil del informante',
    text: '¿Cuál es su formación principal?',
    roleDisplayIds: { coordinador: 'A4' },
    type: 'single',
    required: true,
    options: [
      { value: 'Médico general, sin especialidad', label: 'Médico general, sin especialidad' },
      { value: 'Medicina familiar', label: 'Medicina familiar' },
      { value: 'Medicina interna', label: 'Medicina interna' },
      { value: 'Cirugía general', label: 'Cirugía general' },
      { value: 'Ginecología y obstetricia', label: 'Ginecología y obstetricia' },
      { value: 'Pediatría', label: 'Pediatría' },
      { value: 'Anestesiología', label: 'Anestesiología' },
      { value: 'Urgencias médicas', label: 'Urgencias médicas' },
      { value: 'Salud pública o epidemiología', label: 'Salud pública o epidemiología' },
      { value: 'Otra especialidad médica', label: 'Otra especialidad médica (especifique)' },
      { value: 'Profesión no médica', label: 'Profesión no médica (especifique)' },
    ],
  },
  {
    id: 'A5_otro',
    sectionId: 'sec_a',
    sectionTitle: 'Sección A. Perfil del informante',
    text: 'Especifique su formación principal.',
    type: 'short_text',
    required: false,
    validation: { maxLength: 120 },
    condition: (answers) => answers.A5 === 'Otra especialidad médica' || answers.A5 === 'Profesión no médica',
  },
  {
    id: 'A6',
    sectionId: 'sec_a',
    sectionTitle: 'Sección A. Perfil del informante',
    text: '¿Tiene estudios de posgrado en administración o gestión de servicios de salud?',
    roleDisplayIds: { coordinador: 'A5' },
    type: 'single',
    required: true,
    options: [
      { value: 'Sí, concluidos', label: 'Sí, concluidos' },
      { value: 'Sí, en curso', label: 'Sí, en curso' },
      { value: 'No', label: 'No' },
    ],
  },
  {
    id: 'A7',
    sectionId: 'sec_a',
    sectionTitle: 'Sección A. Perfil del informante',
    text: '¿Cuánto tiempo lleva en su cargo actual, en este hospital o región?',
    roleDisplayIds: { coordinador: 'A6' },
    coordinatorText: '¿Cuánto tiempo lleva como coordinador(a) de esta región?',
    type: 'single',
    required: true,
    options: [
      { value: 'Menos de 6 meses', label: 'Menos de 6 meses' },
      { value: 'De 6 meses a menos de 1 año', label: 'De 6 meses a menos de 1 año' },
      { value: 'De 1 a menos de 3 años', label: 'De 1 a menos de 3 años' },
      { value: 'De 3 a menos de 6 años', label: 'De 3 a menos de 6 años' },
      { value: '6 años o más', label: '6 años o más' },
    ],
  },
  {
    id: 'A7a',
    sectionId: 'sec_a',
    sectionTitle: 'Sección A. Perfil del informante',
    text: '¿Cuál es su tipo de nombramiento en el cargo actual?',
    type: 'single',
    required: true,
    appliesToRoles: ['director'],
    options: [
      { value: 'Plaza de director(a) (puesto de estructura o mando)', label: 'Plaza de director(a) (puesto de estructura o mando)' },
      { value: 'Encargado(a) de despacho o comisionado(a), conservando mi plaza de origen', label: 'Encargado(a) de despacho o comisionado(a), conservando mi plaza de origen' },
      { value: 'Nombramiento temporal o interino', label: 'Nombramiento temporal o interino' },
      { value: 'Otro', label: 'Otro (especifique)' },
    ],
  },
  {
    id: 'A7a_otro',
    sectionId: 'sec_a',
    sectionTitle: 'Sección A. Perfil del informante',
    text: 'Especifique su tipo de nombramiento.',
    type: 'short_text',
    required: false,
    appliesToRoles: ['director'],
    validation: { maxLength: 120 },
    condition: (answers) => answers.A7a === 'Otro',
  },
  {
    id: 'A7b',
    sectionId: 'sec_a',
    sectionTitle: 'Sección A. Perfil del informante',
    text: '¿Su plaza a qué institución pertenece?',
    type: 'single',
    required: true,
    appliesToRoles: ['director'],
    options: [
      { value: 'IMSS-Bienestar', label: 'IMSS-Bienestar' },
      { value: 'Secretaría de Salud', label: 'Secretaría de Salud' },
    ],
  },
  // ==========================================
  // SECCIÓN B. Situación general
  // ==========================================
  {
    id: 'B1',
    sectionId: 'sec_b',
    sectionTitle: 'Sección B. Situación general',
    sectionDescription: 'Tres preguntas: cómo está el hospital hoy, cómo cambió frente a antes de IMSS Bienestar y qué espera para el próximo año.',
    text: 'En general, ¿cómo calificaría la situación actual de su hospital?',
    coordinatorText: 'En general, ¿cómo calificaría la situación actual de los hospitales de su región?',
    type: 'single',
    required: true,
    options: [
      { value: 'Buena', label: 'Buena' },
      { value: 'Regular', label: 'Regular' },
      { value: 'Mala', label: 'Mala' },
      { value: 'No me consta', label: 'No me consta' },
    ],
  },
  {
    id: 'B2',
    sectionId: 'sec_b',
    sectionTitle: 'Sección B. Situación general',
    text: 'Comparada con la situación de su hospital antes de que pasara a IMSS Bienestar (enero de 2024), la situación general…',
    coordinatorText: 'Comparada con el año previo a la incorporación de su estado a IMSS Bienestar ([mes y año]), la situación general de los hospitales de su región…',
    type: 'single',
    required: true,
    options: [
      { value: 'Mejoró', label: 'Mejoró' },
      { value: 'Se mantuvo igual', label: 'Se mantuvo igual' },
      { value: 'Empeoró', label: 'Empeoró' },
      { value: 'No me consta', label: 'No me consta' },
    ],
    help: 'La pregunta compara periodos sin atribuir la causa; todas las opciones son balanceadas.',
  },
  {
    id: 'B3',
    sectionId: 'sec_b',
    sectionTitle: 'Sección B. Situación general',
    text: 'En los próximos 12 meses, ¿espera que la situación general de su hospital…',
    coordinatorText: 'En los próximos 12 meses, ¿espera que la situación de los hospitales de su región…',
    type: 'single',
    required: true,
    options: [
      { value: 'Mejore', label: 'Mejore' },
      { value: 'Siga igual', label: 'Siga igual' },
      { value: 'Empeore', label: 'Empeore' },
      { value: 'No sé', label: 'No sé' },
    ],
  },

  // ==========================================
  // SECCIÓN C. Comparación por área
  // ==========================================
  {
    id: 'C1',
    sectionId: 'sec_c',
    sectionTitle: 'Sección C. Comparación por área',
    sectionDescription: 'Una respuesta por aspecto; el orden de los renglones cambia para reducir respuestas por inercia.',
    text: 'Compare cada aspecto de su hospital con la situación anterior a que pasara a IMSS Bienestar (enero de 2024).',
    coordinatorText: 'Compare cada aspecto de los hospitales de su región con el año previo a la incorporación de su estado a IMSS Bienestar ([mes y año]).',
    type: 'matrix',
    required: true,
    matrixItems: MATRIX_C1_DIRECTOR_ITEMS,
    matrixColumns: MATRIX_C1_COLUMNS,
    help: 'Seleccione una respuesta por cada renglón. Incluye «No me consta».',
  },
  {
    id: 'C2',
    sectionId: 'sec_c',
    sectionTitle: 'Sección C. Comparación por área',
    text: 'Actualmente, ¿cuáles de estos aspectos son un problema grave en su hospital?',
    coordinatorText: 'Actualmente, ¿cuáles de estos aspectos son un problema grave en los hospitales de su región?',
    type: 'multiple',
    required: true,
    options: [
      ...C2_OPTIONS,
      { value: 'ninguno', label: 'Ninguno es un problema grave', exclusive: true },
    ],
    validation: { maxSelections: 3, requiresConfirmation: true },
    help: 'Seleccione hasta 3 aspectos, o marque «Ninguno es un problema grave».',
  },
  {
    id: 'C3',
    sectionId: 'sec_c',
    sectionTitle: 'Sección C. Comparación por área',
    text: 'Antes de que su hospital pasara a IMSS Bienestar (enero de 2024), ¿cuáles de estos aspectos eran un problema grave en su hospital?',
    coordinatorText: 'Antes de que el estado se incorporara a IMSS Bienestar (enero de 2024), ¿cuáles de estos aspectos eran un problema grave en los hospitales de su región?',
    type: 'multiple',
    required: true,
    validation: { maxSelections: 3, requiresConfirmation: true },
    options: [
      ...C2_OPTIONS,
      { value: 'ninguno', label: 'Ninguno era un problema grave', exclusive: true },
      { value: 'no_consta', label: 'No me consta', exclusive: true },
    ],
    help: 'Puede seleccionar los aspectos que aplicaban, ninguno o «No me consta».',
  },
  {
    id: 'C4',
    sectionId: 'sec_c',
    sectionTitle: 'Sección C. Comparación por área',
    text: '¿Hay algún servicio o área de su hospital que hoy esté cerrado o funcionando de forma parcial?',
    coordinatorText: '¿Hay algún servicio o área en los hospitales de su región que hoy esté cerrado o funcionando de forma parcial?',
    type: 'multiple',
    required: true,
    validation: { requiresConfirmation: true },
    options: [
      { value: 'Quirófanos', label: 'Quirófanos' },
      { value: 'Urgencias', label: 'Urgencias' },
      { value: 'Hospitalización (camas fuera de servicio)', label: 'Hospitalización (camas fuera de servicio)' },
      { value: 'Terapia intensiva o cuidados intermedios', label: 'Terapia intensiva o cuidados intermedios' },
      { value: 'Laboratorio o imagenología', label: 'Laboratorio o imagenología' },
      { value: 'Consulta de especialidades', label: 'Consulta de especialidades' },
      { value: 'Otro', label: 'Otro (especifique)' },
      { value: 'Ninguno', label: 'Ninguno', exclusive: true },
    ],
  },
  {
    id: 'C4_otro',
    sectionId: 'sec_c',
    sectionTitle: 'Sección C. Comparación por área',
    text: 'Especifique el otro servicio o área cerrada o parcial.',
    type: 'short_text',
    required: false,
    validation: { maxLength: 150 },
    condition: (answers) => Array.isArray(answers.C4) && answers.C4.includes('Otro'),
  },
  {
    id: 'C5',
    sectionId: 'sec_c',
    sectionTitle: 'Sección C. Comparación por área',
    text: 'El cierre o funcionamiento parcial más importante, ¿desde cuándo ocurre?',
    coordinatorText: 'El cierre o funcionamiento parcial más importante en los hospitales de su región, ¿desde cuándo ocurre?',
    type: 'single',
    required: true,
    condition: (answers) => {
      const c4 = answers['C4'];
      if (!c4 || !Array.isArray(c4) || c4.length === 0) return false;
      return !c4.includes('Ninguno');
    },
    options: [
      { value: 'Desde antes de enero de 2024', label: 'Desde antes de que su hospital pasara a IMSS Bienestar (enero de 2024)' },
      { value: 'Desde después de enero de 2024', label: 'Desde después de enero de 2024' },
      { value: 'No me consta', label: 'No me consta' },
    ],
    help: 'Se activa únicamente si en la pregunta anterior señaló al menos un área cerrada o parcial.',
  },

  {
    id: 'C6',
    sectionId: 'sec_c',
    sectionTitle: 'Sección C. Comparación por área',
    text: '¿Cómo describiría el almacén de su hospital para medicamentos e insumos?',
    coordinatorText: '¿Cómo describiría el almacén para medicamentos e insumos de los hospitales de su región?',
    type: 'single',
    required: true,
    options: [
      { value: 'Espacio y condiciones suficientes', label: 'Tiene espacio y condiciones suficientes' },
      { value: 'Espacio suficiente, condiciones inadecuadas', label: 'Tiene espacio suficiente, pero condiciones inadecuadas (temperatura, humedad, seguridad o red fría)' },
      { value: 'Espacio insuficiente', label: 'No tiene espacio suficiente' },
      { value: 'Sin almacén propio', label: 'No cuenta con almacén propio' },
    ],
  },

  // ==========================================
  // SECCIÓN D. Fondo rotatorio (solo directores)
  // ==========================================
  {
    id: 'D1',
    sectionId: 'sec_d',
    sectionTitle: 'Sección D. Fondo rotatorio',
    text: 'Antes de que su hospital pasara a IMSS Bienestar (enero de 2024), ¿contaba con recursos propios para gastos de operación (por ejemplo, fondo rotatorio o presupuesto asignado al hospital)?',
    type: 'amount_conditional',
    required: true,
    appliesToRoles: ['director'],
    validation: { min: 0, max: 5000000 },
    help: 'Si responde «Sí», indique el monto mensual aproximado o marque «No sé».',
  },
  {
    id: 'D2',
    sectionId: 'sec_d',
    sectionTitle: 'Sección D. Fondo rotatorio',
    text: '¿Qué tan necesario considera contar con un fondo rotatorio para la operación de su hospital?',
    type: 'single',
    required: true,
    appliesToRoles: ['director'],
    options: [
      { value: 'Muy necesario', label: 'Muy necesario' },
      { value: 'Algo necesario', label: 'Algo necesario' },
      { value: 'Poco necesario', label: 'Poco necesario' },
      { value: 'Nada necesario', label: 'Nada necesario' },
    ],
  },
  {
    id: 'D3',
    sectionId: 'sec_d',
    sectionTitle: 'Sección D. Fondo rotatorio',
    text: 'Antes de la incorporación a IMSS Bienestar, ¿su hospital tenía cajas de cobro de cuotas de recuperación?',
    type: 'single',
    required: true,
    appliesToRoles: ['director'],
    options: [
      { value: 'Sí', label: 'Sí' },
      { value: 'No', label: 'No' },
      { value: 'No sé', label: 'No sé' },
    ],
  },

  // ==========================================
  // SECCIÓN E. Plantilla de personal
  // ==========================================
  {
    id: 'E1', sectionId: 'sec_e', sectionTitle: 'Sección E. Plantilla de personal',
    text: 'Al día de hoy, ¿cuántas personas integran la plantilla total de su hospital? Incluya todo el personal y todos los tipos de contratación.',
    type: 'number', required: true, appliesToRoles: ['director'], numberUnknownLabel: 'No tengo el dato',
    validation: { min: 0 },
  },
  {
    id: 'E2', sectionId: 'sec_e', sectionTitle: 'Sección E. Plantilla de personal',
    text: 'Del total anterior, ¿cuántas personas son personal médico (médicos generales, especialistas y residentes)?',
    type: 'number', required: true, appliesToRoles: ['director'], numberUnknownLabel: 'No tengo el dato',
    validation: { min: 0 },
  },
  {
    id: 'E3', sectionId: 'sec_e', sectionTitle: 'Sección E. Plantilla de personal',
    text: 'Del total, ¿cuántas personas se dedican a la atención al usuario y al trato digno (trabajo social, módulo de atención y orientación, gestor de calidad u otras áreas afines)?',
    type: 'number', required: true, appliesToRoles: ['director'], numberUnknownLabel: 'No tengo el dato',
    validation: { min: 0 },
  },
  {
    id: 'E4', sectionId: 'sec_e', sectionTitle: 'Sección E. Plantilla de personal',
    text: 'Para cada tipo de personal, ¿cuántas personas necesitaría contratar como mínimo indispensable en los próximos 3 meses?',
    type: 'number_matrix', required: true, appliesToRoles: ['director'],
    matrixItems: [
      { id: 'especialistas', label: 'Médicos especialistas' },
      { id: 'generales', label: 'Médicos generales' },
      { id: 'enfermeria_clinica', label: 'Enfermería de atención clínica' },
      { id: 'enfermeria_especialidad', label: 'Enfermería de especialidad' },
      { id: 'paramedicos', label: 'Personal paramédico' },
    ],
  },
  {
    id: 'E5', sectionId: 'sec_e', sectionTitle: 'Sección E. Plantilla de personal',
    text: 'Si anotó médicos especialistas, ¿de qué especialidades y cuántas personas necesita de cada una?',
    type: 'number_matrix', required: true, appliesToRoles: ['director'],
    condition: (answers) => Number(answers.E4?.especialistas) > 0,
    matrixItems: [
      { id: 'cirugia', label: 'Cirugía' },
      { id: 'medicina_interna', label: 'Medicina Interna' },
      { id: 'trauma_ortopedia', label: 'Trauma y ortopedia' },
      { id: 'gineco_obstetricia', label: 'Ginecología y obstetricia' },
      { id: 'pediatria', label: 'Pediatría' },
      { id: 'anestesiologia', label: 'Anestesiología' },
      { id: 'urgencias', label: 'Urgencias médicas' },
      { id: 'medicina_familiar', label: 'Medicina familiar' },
      { id: 'otra', label: 'Otra especialidad' },
    ],
  },

  // ==========================================
  // SECCIÓN F. Equipo electromecánico
  // ==========================================
  {
    id: 'F1', sectionId: 'sec_f', sectionTitle: 'Sección F. Equipo electromecánico',
    text: '¿Qué tipo de aire acondicionado tiene su hospital?', type: 'single', required: true,
    appliesToRoles: ['director'],
    options: [
      { value: 'Sistema integral', label: 'Sistema integral que climatiza todo el hospital' },
      { value: 'Equipos individuales', label: 'Solo equipos individuales en algunas áreas (minisplits, de ventana o tipo paquete)' },
      { value: 'Ambos', label: 'Ambos' },
      { value: 'No cuenta', label: 'No cuenta con aire acondicionado' },
    ],
  },
  {
    id: 'F2', sectionId: 'sec_f', sectionTitle: 'Sección F. Equipo electromecánico',
    text: '¿Su hospital cuenta con chiller (enfriador de agua para el sistema central)?', type: 'single', required: true,
    appliesToRoles: ['director'],
    options: [
      { value: 'Sí, funciona', label: 'Sí, funciona' },
      { value: 'Sí, no funciona', label: 'Sí, pero no funciona' },
      { value: 'No cuenta', label: 'No cuenta con chiller' },
    ],
  },
  {
    id: 'F3', sectionId: 'sec_f', sectionTitle: 'Sección F. Equipo electromecánico',
    text: '¿Cuántos equipos de aire acondicionado individuales tiene instalados su hospital? Incluya minisplits, de ventana y tipo paquete.',
    type: 'number', required: true, appliesToRoles: ['director'], numberUnknownLabel: 'No tengo el dato',
    validation: { min: 0 },
  },
  {
    id: 'F4', sectionId: 'sec_f', sectionTitle: 'Sección F. Equipo electromecánico',
    text: 'De ellos, ¿cuántos son minisplits?', type: 'number', required: true, appliesToRoles: ['director'],
    numberUnknownLabel: 'No tengo el dato', validation: { min: 0 },
    condition: (answers) => answers.F3 !== 'unknown' && Number(answers.F3) > 0,
  },
  {
    id: 'F5', sectionId: 'sec_f', sectionTitle: 'Sección F. Equipo electromecánico',
    text: 'De esos equipos individuales, ¿cuántos no funcionan hoy?', type: 'number', required: true, appliesToRoles: ['director'],
    numberUnknownLabel: 'No tengo el dato', validation: { min: 0 },
    condition: (answers) => answers.F3 !== 'unknown' && Number(answers.F3) > 0,
  },
  {
    id: 'F6', sectionId: 'sec_f', sectionTitle: 'Sección F. Equipo electromecánico',
    text: '¿Cuántos elevadores tiene su hospital?', type: 'number', required: true, appliesToRoles: ['director'],
    validation: { min: 0 },
  },
  {
    id: 'F7', sectionId: 'sec_f', sectionTitle: 'Sección F. Equipo electromecánico',
    text: 'De ellos, ¿cuántos no funcionan hoy?', type: 'number', required: true, appliesToRoles: ['director'],
    validation: { min: 0 }, condition: (answers) => Number(answers.F6) > 0,
  },

  // ==========================================
  // SECCIÓN G. Traslado de pacientes
  // ==========================================
  {
    id: 'G1', sectionId: 'sec_g', sectionTitle: 'Sección G. Traslado de pacientes',
    text: '¿Cuántas ambulancias tiene asignadas su hospital?', type: 'number', required: true, appliesToRoles: ['director'],
    validation: { min: 0 },
  },
  {
    id: 'G2', sectionId: 'sec_g', sectionTitle: 'Sección G. Traslado de pacientes',
    text: 'De ese total, ¿cuántas se encuentran actualmente en funcionamiento, es decir, en condiciones de dar servicio hoy?',
    type: 'number', required: true, appliesToRoles: ['director'], validation: { min: 0 },
    condition: (answers) => Number(answers.G1) > 0,
  },
  {
    id: 'G3', sectionId: 'sec_g', sectionTitle: 'Sección G. Traslado de pacientes',
    text: 'De las ambulancias que no funcionan, ¿cuál es la causa principal?', type: 'multiple', required: true,
    appliesToRoles: ['director'], condition: (answers) => Number(answers.G1) > Number(answers.G2),
    options: [
      { value: 'Falla mecánica', label: 'Falla mecánica' },
      { value: 'Falta de equipo médico', label: 'Falta de equipo médico' },
      { value: 'Falta de combustible o presupuesto de operación', label: 'Falta de combustible o presupuesto de operación' },
      { value: 'Falta de personal para operarla', label: 'Falta de personal para operarla' },
      { value: 'Siniestro o accidente', label: 'Siniestro o accidente' },
      { value: 'Otra', label: 'Otra' },
    ],
  },
  {
    id: 'G3_otro', sectionId: 'sec_g', sectionTitle: 'Sección G. Traslado de pacientes',
    text: 'Especifique otra causa de ambulancias fuera de servicio.', type: 'short_text', required: false,
    appliesToRoles: ['director'], validation: { maxLength: 150 },
    condition: (answers) => Array.isArray(answers.G3) && answers.G3.includes('Otra'),
  },
  {
    id: 'G4', sectionId: 'sec_g', sectionTitle: 'Sección G. Traslado de pacientes',
    text: '¿Quién opera las ambulancias?', type: 'multiple', required: true, appliesToRoles: ['director'],
    condition: (answers) => Number(answers.G1) > 0,
    options: [
      { value: 'IMSS-Bienestar', label: 'IMSS-Bienestar' },
      { value: 'Gobierno estatal / Servicios Estatales de Salud', label: 'Gobierno estatal / Servicios Estatales de Salud' },
      { value: 'Municipio', label: 'Municipio' },
    ],
  },
  {
    id: 'G5', sectionId: 'sec_g', sectionTitle: 'Sección G. Traslado de pacientes',
    text: '¿Las ambulancias son propias o se prestan mediante un servicio?', type: 'multiple', required: true,
    appliesToRoles: ['director'], condition: (answers) => Number(answers.G1) > 0,
    options: [
      { value: 'Propias', label: 'Propias' },
      { value: 'Servicio subrogado o contratado', label: 'Servicio subrogado o contratado' },
      { value: 'Prestadas o en comodato', label: 'Prestadas o en comodato (por ejemplo, del municipio o de Cruz Roja)' },
    ],
  },
  {
    id: 'G6', sectionId: 'sec_g', sectionTitle: 'Sección G. Traslado de pacientes',
    text: '¿Con cuántas personas cuenta para operar las ambulancias (operadores, paramédicos o técnicos en urgencias médicas)?',
    type: 'number', required: true, appliesToRoles: ['director'], validation: { min: 0 },
    condition: (answers) => Number(answers.G1) > 0,
  },
  {
    id: 'G7', sectionId: 'sec_g', sectionTitle: 'Sección G. Traslado de pacientes',
    text: '¿Qué necesita su hospital en materia de ambulancias? (Seleccione hasta 3)', type: 'multiple', required: true,
    appliesToRoles: ['director'], validation: { maxSelections: 3 },
    options: [
      { value: 'Más unidades', label: 'Más unidades' },
      { value: 'Reparación o mantenimiento', label: 'Reparación o mantenimiento' },
      { value: 'Equipamiento médico', label: 'Equipamiento médico' },
      { value: 'Combustible o presupuesto de operación', label: 'Combustible o presupuesto de operación' },
      { value: 'Personal operativo', label: 'Personal operativo' },
      { value: 'Capacitación', label: 'Capacitación' },
      { value: 'Otra', label: 'Otra' },
    ],
  },
  {
    id: 'G7_otro', sectionId: 'sec_g', sectionTitle: 'Sección G. Traslado de pacientes',
    text: 'Especifique otra necesidad relacionada con ambulancias.', type: 'short_text', required: false,
    appliesToRoles: ['director'], validation: { maxLength: 150 },
    condition: (answers) => Array.isArray(answers.G7) && answers.G7.includes('Otra'),
  },
  {
    id: 'G8', sectionId: 'sec_g', sectionTitle: 'Sección G. Traslado de pacientes',
    text: 'Describa brevemente la principal necesidad o problema en el traslado de pacientes de su hospital.',
    type: 'long_text', required: false, appliesToRoles: ['director'], validation: { maxLength: 500 },
  },

  // ==========================================
  // SECCIÓN H. Valoración de IMSS Bienestar
  // ==========================================
  {
    id: 'H1', sectionId: 'sec_h', sectionTitle: 'Sección H. Valoración de IMSS Bienestar',
    text: 'En una frase, ¿qué aspecto de IMSS Bienestar considera más positivo para su hospital?',
    coordinatorText: 'En una frase, ¿qué aspecto de IMSS Bienestar considera más positivo para los hospitales de su región?',
    type: 'short_text', required: false, validation: { maxLength: 150 },
  },
  {
    id: 'H2', sectionId: 'sec_h', sectionTitle: 'Sección H. Valoración de IMSS Bienestar',
    text: 'En una frase, ¿qué aspecto de IMSS Bienestar considera que más necesita mejorar?',
    coordinatorText: 'En una frase, ¿qué aspecto de IMSS Bienestar considera que más necesita mejorar en los hospitales de su región?',
    type: 'short_text', required: false, validation: { maxLength: 150 },
  },

  // ==========================================
  // SECCIÓN I. Cierre
  // ==========================================
  {
    id: 'I1', sectionId: 'sec_i', sectionTitle: 'Sección I. Cierre',
    text: 'Si pudiera pedir una sola acción al nivel central para mejorar su hospital en los próximos 6 meses, ¿cuál sería?',
    coordinatorText: 'Si pudiera pedir una sola acción al nivel central para mejorar los hospitales de su región en los próximos 6 meses, ¿cuál sería?',
    type: 'long_text', required: false, validation: { maxLength: 300 },
  },
];

/**
 * Filter questions based on current user role and conditions
 */
export function getActiveQuestions(role: 'director' | 'coordinador', answers: Record<string, any>): Question[] {
  return QUESTIONS_CATALOG.filter((q) => {
    // Check role eligibility
    if (q.appliesToRoles && !q.appliesToRoles.includes(role)) {
      return false;
    }
    // Check conditional triggers
    if (q.condition && !q.condition(answers)) {
      return false;
    }
    return true;
  }).map((question) => ({
    ...question,
    text: role === 'coordinador' && question.coordinatorText
      ? question.coordinatorText
      : question.text,
    sectionTitle: question.roleSectionTitles?.[role] || question.sectionTitle,
    sectionId: question.roleSectionIds?.[role] || question.sectionId,
    options: question.roleOptions?.[role] || question.options,
    matrixItems: question.roleMatrixItems?.[role] || question.matrixItems,
    validation: {
      ...question.validation,
      ...question.roleValidation?.[role],
    },
  }));
}
