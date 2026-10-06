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

export const MATRIX_C1_COORDINATOR_ITEMS: MatrixItem[] = [
  { id: 'c1_1', label: 'Abasto de medicamentos' },
  { id: 'c1_2', label: 'Abasto de material de curación e insumos' },
  { id: 'c1_3', label: 'Suficiencia de médicos especialistas' },
  { id: 'c1_4', label: 'Suficiencia de personal de enfermería' },
  { id: 'c1_5', label: 'Equipo médico en funcionamiento' },
  { id: 'c1_6', label: 'Conservación y mantenimiento del inmueble' },
  { id: 'c1_7', label: 'Servicios generales (limpieza, lavandería, alimentación, vigilancia)' },
  { id: 'c1_8', label: 'Recursos para gastos de operación' },
  { id: 'c1_9', label: 'Trámites administrativos (compras, contratación y pagos)' },
  { id: 'c1_10', label: 'Tiempo de espera de los pacientes' },
  { id: 'c1_11', label: 'Referencia y contrarreferencia de pacientes' },
  { id: 'c1_12', label: 'Sistemas informáticos y conectividad' },
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

export const C3_OPTIONS: QuestionOption[] = MATRIX_C1_DIRECTOR_ITEMS
  .filter((item) => item.id !== 'c1_4_1' && item.id !== 'c1_7_1')
  .map((item) => ({ value: item.id, label: item.label }));

export const TOP_PROBLEMS_OPTIONS: QuestionOption[] = [
  { value: 'p1', label: 'Falta de médicos especialistas' },
  { value: 'p2', label: 'Falta de personal de enfermería o paramédico' },
  { value: 'p3', label: 'Desabasto de medicamentos' },
  { value: 'p4', label: 'Desabasto de material de curación e insumos' },
  { value: 'p5', label: 'Equipo médico descompuesto u obsoleto' },
  { value: 'p6', label: 'Infraestructura deteriorada' },
  { value: 'p7', label: 'Fallas en servicios generales (limpieza, lavandería, alimentación, vigilancia)' },
  { value: 'p8', label: 'Falta de recursos para gastos de operación' },
  { value: 'p9', label: 'Trámites administrativos lentos (compras, contratación, pagos)' },
  { value: 'p10', label: 'Saturación por exceso de demanda' },
  { value: 'p11', label: 'Problemas de referencia y contrarreferencia de pacientes' },
  { value: 'p12', label: 'Sistemas informáticos o conectividad' },
  { value: 'p13', label: 'Planeación y gestión interna del hospital (procesos, coordinación entre áreas)' },
  { value: 'p14', label: 'Dirección del hospital' },
  { value: 'otro', label: 'Otro (especifique)' },
];

export const QUESTIONS_CATALOG: Question[] = [
  // ==========================================
  // SECCIÓN A. Perfil del informante
  // ==========================================
  {
    id: 'A1',
    sectionId: 'sec_a',
    sectionTitle: 'Sección A. Perfil del informante',
    sectionDescription: 'Nueve preguntas de respuesta rápida; las responden directores y coordinadores.',
    text: '¿Cuál es su cargo actual?',
    type: 'single',
    required: true,
    appliesToRoles: ['director'],
    options: [
      { value: 'director', label: 'Director(a) de hospital' },
      { value: 'coordinador', label: 'Coordinador(a) regional' },
    ],
    help: 'La ruta regional se abre al seleccionar «Coordinador(a) regional».',
  },
  {
    id: 'A2_coord',
    sectionId: 'sec_a',
    sectionTitle: 'Sección A. Perfil del informante',
    text: 'Seleccione su región.',
    type: 'single',
    required: true,
    appliesToRoles: ['coordinador'],
    roleDisplayIds: { coordinador: 'A1' },
    options: [],
    help: 'Las regiones disponibles corresponden a la entidad federativa seleccionada.',
  },
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
    help: 'Número entero de 25 a 80 años. La edad se captura exacta para validar, pero se reporta solo en rangos anónimos.',
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
  {
    id: 'A7_coord',
    sectionId: 'sec_a',
    sectionTitle: 'Sección A. Perfil del informante',
    text: 'Antes de la incorporación de su estado a IMSS Bienestar ([mes y año]), ¿trabajaba en esta región?',
    roleDisplayIds: { coordinador: 'A7' },
    type: 'single',
    required: true,
    appliesToRoles: ['coordinador'],
    options: [
      { value: 'Sí, en el mismo cargo', label: 'Sí, en el mismo cargo' },
      { value: 'Sí, en otro cargo', label: 'Sí, en otro cargo' },
      { value: 'No', label: 'No' },
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
    roleOptions: {
      coordinador: [
        { value: 'Muy buena', label: 'Muy buena' },
        { value: 'Buena', label: 'Buena' },
        { value: 'Regular', label: 'Regular' },
        { value: 'Mala', label: 'Mala' },
        { value: 'Muy mala', label: 'Muy mala' },
      ],
    },
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
    roleOptions: {
      coordinador: [
        { value: 'Mejoró mucho', label: 'Mejoró mucho' },
        { value: 'Mejoró algo', label: 'Mejoró algo' },
        { value: 'Se mantuvo igual', label: 'Se mantuvo igual' },
        { value: 'Empeoró algo', label: 'Empeoró algo' },
        { value: 'Empeoró mucho', label: 'Empeoró mucho' },
        { value: 'No me consta', label: 'No me consta' },
      ],
    },
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
    roleOptions: {
      coordinador: [
        { value: 'Mejore mucho', label: 'Mejore mucho' },
        { value: 'Mejore algo', label: 'Mejore algo' },
        { value: 'Siga igual', label: 'Siga igual' },
        { value: 'Empeore algo', label: 'Empeore algo' },
        { value: 'Empeore mucho', label: 'Empeore mucho' },
        { value: 'No sé', label: 'No sé' },
      ],
    },
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
    roleMatrixItems: { coordinador: MATRIX_C1_COORDINATOR_ITEMS },
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
    appliesToRoles: ['director'],
    options: [
      ...C2_OPTIONS,
      { value: 'ninguno', label: 'Ninguno es un problema grave', exclusive: true },
    ],
    validation: { maxSelections: 3, exactSelectionCount: 3, requiresConfirmation: true },
    help: 'Seleccione como máximo 3 aspectos, o marque «Ninguno es un problema grave».',
  },
  {
    id: 'C3',
    sectionId: 'sec_c',
    sectionTitle: 'Sección C. Comparación por área',
    text: 'Antes de que su hospital pasara a IMSS Bienestar (enero de 2024), ¿cuáles de estos aspectos eran un problema grave en su hospital?',
    type: 'multiple',
    required: true,
    appliesToRoles: ['director'],
    validation: { requiresConfirmation: true },
    options: [
      ...C3_OPTIONS,
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
    appliesToRoles: ['director'],
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
    appliesToRoles: ['director'],
    validation: { maxLength: 150 },
    condition: (answers) => Array.isArray(answers.C4) && answers.C4.includes('Otro'),
  },
  {
    id: 'C5',
    sectionId: 'sec_c',
    sectionTitle: 'Sección C. Comparación por área',
    text: 'El cierre o funcionamiento parcial más importante, ¿desde cuándo ocurre?',
    type: 'single',
    required: true,
    appliesToRoles: ['director'],
    condition: (answers) => {
      const c4 = answers['C4'];
      if (!c4 || !Array.isArray(c4) || c4.length === 0) return false;
      return !c4.includes('Ninguno');
    },
    options: [
      { value: 'Desde antes de enero de 2024', label: 'Desde antes de que pasara a IMSS Bienestar (enero de 2024)' },
      { value: 'Desde después de enero de 2024', label: 'Desde después de enero de 2024' },
      { value: 'No me consta', label: 'No me consta' },
    ],
    help: 'Se activa únicamente si en la pregunta anterior señaló al menos un área cerrada o parcial.',
  },

  // ==========================================
  // SECCIÓN D. Fondo rotatorio (Directores)
  // ==========================================
  {
    id: 'D1',
    sectionId: 'sec_d',
    sectionTitle: 'Sección D. Fondo rotatorio',
    sectionDescription: 'Mide los recursos de operación inmediata antes de la incorporación.',
    text: 'Antes de que su hospital pasara a IMSS Bienestar (enero de 2024), ¿contaba con recursos propios para gastos de operación (por ejemplo, fondo rotatorio o presupuesto asignado al hospital)?',
    type: 'amount_conditional',
    required: true,
    appliesToRoles: ['director'],
    validation: {
      min: 0,
      max: 5000000,
    },
    help: 'Si responde «Sí», indique el monto mensual aproximado entre $0 y $5,000,000 o marque «No sé».',
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
  // SECCIÓN D (Variante Coordinadores: Hospitales de la red regional)
  // ==========================================
  {
    id: 'D1_coord',
    sectionId: 'sec_d_coord',
    sectionTitle: 'Sección D. Hospitales de la red regional',
    sectionDescription: 'Diagnóstico regional de prioridades hospitalarias.',
    text: 'De los hospitales a su cargo, ¿cuál es su problema principal?',
    type: 'single',
    required: true,
    appliesToRoles: ['coordinador'],
    options: TOP_PROBLEMS_OPTIONS,
  },
  {
    id: 'D1_coord_otro',
    sectionId: 'sec_d_coord',
    sectionTitle: 'Sección D. Hospitales de la red regional',
    text: 'Especifique el otro problema principal de los hospitales a su cargo.',
    type: 'short_text',
    required: false,
    appliesToRoles: ['coordinador'],
    validation: { maxLength: 150 },
    condition: (answers) => answers.D1_coord === 'otro',
  },
  {
    id: 'D2_coord',
    sectionId: 'sec_d_coord',
    sectionTitle: 'Sección D. Hospitales de la red regional',
    text: '¿Cuál es el principal problema de la red de hospitales de su región, más allá de cada hospital?',
    type: 'single',
    required: true,
    appliesToRoles: ['coordinador'],
    options: [
      { value: 'Referencia y traslado entre unidades', label: 'Referencia y traslado entre unidades' },
      { value: 'Distribución de medicamentos e insumos desde el almacén', label: 'Distribución de medicamentos e insumos desde el almacén' },
      { value: 'Especialistas insuficientes para la región', label: 'Especialistas insuficientes para la región' },
      { value: 'Ambulancias y transporte', label: 'Ambulancias y transporte' },
      { value: 'Supervisión y comunicación con los hospitales', label: 'Supervisión y comunicación con los hospitales' },
      { value: 'Coordinación con el nivel estatal o central', label: 'Coordinación con el nivel estatal o central' },
      { value: 'Otro', label: 'Otro (especifique)' },
    ],
  },
  {
    id: 'D2_coord_otro',
    sectionId: 'sec_d_coord',
    sectionTitle: 'Sección D. Hospitales de la red regional',
    text: 'Especifique el problema principal de la red regional.',
    type: 'short_text',
    required: false,
    appliesToRoles: ['coordinador'],
    validation: { maxLength: 150 },
    condition: (answers) => answers.D2_coord === 'Otro',
  },
  {
    id: 'D3_coord',
    sectionId: 'sec_d_coord',
    sectionTitle: 'Sección D. Hospitales de la red regional',
    text: '¿Desde cuándo existe ese problema?',
    type: 'single',
    required: true,
    appliesToRoles: ['coordinador'],
    options: [
      { value: 'Más de 5 años antes de la incorporación', label: 'Más de 5 años antes de la incorporación' },
      { value: 'Entre 1 y 5 años antes', label: 'Entre 1 y 5 años antes' },
      { value: 'Menos de 1 año antes', label: 'Menos de 1 año antes' },
      { value: 'Surgió después de la incorporación', label: 'Surgió después de la incorporación' },
      { value: 'No me consta', label: 'No me consta' },
    ],
  },

  // ==========================================
  // SECCIÓN E. Valoración de IMSS Bienestar (Solo Directores)
  // ==========================================
  {
    id: 'E1',
    sectionId: 'sec_e',
    sectionTitle: 'Sección E. Valoración de IMSS Bienestar',
    text: 'En una frase, ¿qué aspecto de IMSS Bienestar considera más positivo para su hospital?',
    type: 'short_text',
    required: false,
    appliesToRoles: ['director'],
    validation: { maxLength: 150 },
  },
  {
    id: 'E2',
    sectionId: 'sec_e',
    sectionTitle: 'Sección E. Valoración de IMSS Bienestar',
    text: 'En una frase, ¿qué aspecto de IMSS Bienestar considera que más necesita mejorar?',
    type: 'short_text',
    required: false,
    appliesToRoles: ['director'],
    validation: { maxLength: 150 },
  },

  // ==========================================
  // SECCIÓN F / CIERRE. Cierre institucional
  // ==========================================
  {
    id: 'F1',
    sectionId: 'sec_f',
    sectionTitle: 'Sección F. Cierre',
    roleSectionIds: { coordinador: 'sec_e_coord' },
    roleSectionTitles: { coordinador: 'Sección E. Cierre' },
    sectionDescription: 'Propuesta de mejora estratégica hacia el nivel central.',
    text: 'Si pudiera pedir una sola acción al nivel central para mejorar su hospital en los próximos 6 meses, ¿cuál sería?',
    coordinatorText: 'Si pudiera pedir una sola acción al nivel central para mejorar los hospitales de la región en los próximos 6 meses, ¿cuál sería?',
    type: 'long_text',
    required: false,
    validation: {
      maxLength: 300,
    },
    help: 'Pregunta abierta opcional. Máximo 300 caracteres.',
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
