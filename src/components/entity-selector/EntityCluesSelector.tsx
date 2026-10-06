import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Building2,
  MapPin,
  ArrowRight,
  ArrowLeft,
  X,
  PlusCircle,
  Shield,
} from 'lucide-react';
import { Entity, Clues, UserRole } from '../../types/questionnaire';
import { MEXICAN_ENTITIES, normalizeCatalogText, searchClues, buildCustomClues } from '../../data/notebookCatalog';

interface EntityCluesSelectorProps {
  selectedEntity: Entity | null;
  selectedClues: Clues | null;
  currentRole: UserRole;
  capturedAnswersCount: number;
  onConfirmSelection: (entity: Entity, clues: Clues, role: UserRole) => void;
  onBack: () => void;
}

export const EntityCluesSelector: React.FC<EntityCluesSelectorProps> = ({
  selectedEntity,
  selectedClues,
  currentRole,
  capturedAnswersCount,
  onConfirmSelection,
  onBack,
}) => {
  // Local state for interactive selection
  const [entity, setEntity] = useState<Entity | null>(selectedEntity);
  const [clues, setClues] = useState<Clues | null>(selectedClues);

  // Search input queries
  const [entityQuery, setEntityQuery] = useState('');
  const [cluesQuery, setCluesQuery] = useState('');
  const [isEntityDropdownOpen, setIsEntityDropdownOpen] = useState(false);

  // Warning modal for changing entity/clues with captured answers
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingChangeAction, setPendingChangeAction] = useState<(() => void) | null>(null);

  // State for manual custom CLUES addition
  const [showCustomCluesModal, setShowCustomCluesModal] = useState(false);
  const [customCluesCode, setCustomCluesCode] = useState('');
  const [customHospitalName, setCustomHospitalName] = useState('');

  // Filter entities based on search input
  const filteredEntities = useMemo(() => {
    if (!entityQuery.trim()) return MEXICAN_ENTITIES;
    const q = normalizeCatalogText(entityQuery.trim());
    return MEXICAN_ENTITIES.filter((e) => normalizeCatalogText(e.name).includes(q));
  }, [entityQuery]);

  // Filter CLUES conditioned strictly on the selected entity
  const filteredCluesList = useMemo(() => {
    if (!entity) return [];
    return searchClues(entity.id, cluesQuery);
  }, [entity, cluesQuery]);

  // When selectedEntity prop changes
  useEffect(() => {
    if (selectedEntity) setEntity(selectedEntity);
    if (selectedClues) setClues(selectedClues);
  }, [selectedEntity, selectedClues]);

  // Handle entity change with safety warning check
  const handleSelectEntity = (newEntity: Entity) => {
    const doChange = () => {
      setEntity(newEntity);
      setClues(null); // Reset CLUES since it belongs to previous entity
      setEntityQuery('');
      setIsEntityDropdownOpen(false);
      setCluesQuery('');
    };

    if (capturedAnswersCount > 0 && entity && entity.id !== newEntity.id) {
      setPendingChangeAction(() => doChange);
      setShowWarningModal(true);
    } else {
      doChange();
    }
  };

  const handleSelectClues = (newClues: Clues) => {
    const doChange = () => {
      setClues(newClues);
      setCluesQuery('');
    };

    if (capturedAnswersCount > 0 && clues && clues.clues !== newClues.clues) {
      setPendingChangeAction(() => doChange);
      setShowWarningModal(true);
    } else {
      doChange();
    }
  };

  const handleSaveCustomClues = () => {
    if (!entity || !customCluesCode.trim() || !customHospitalName.trim()) return;
    const built = buildCustomClues(entity.id, customCluesCode, customHospitalName);
    setClues(built);
    setShowCustomCluesModal(false);
    setCustomCluesCode('');
    setCustomHospitalName('');
  };

  const handleConfirmAndProceed = () => {
    if (!entity || !clues) return;
    onConfirmSelection(entity, clues, currentRole);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-3xl w-full institutional-glass rounded-2xl p-6 sm:p-9 shadow-2xl text-slate-100"
      >
        {/* Header */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wider">
          <MapPin className="w-4 h-4" />
          <span>Fase de Identificación Institucional</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Selección de Entidad y Unidad Médica (CLUES)
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mb-6">
          Seleccione la entidad y una unidad de referencia. Los coordinadores elegirán su región en la siguiente etapa. No se solicita ningún dato personal ni cuenta de usuario.
        </p>

        {/* 1. Selector de Entidad Federativa */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            1. Entidad Federativa <span className="text-emerald-400">*</span>
          </label>

          {entity ? (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-emerald-500/40">
              <div className="flex items-center space-x-3">
                <div>
                  <span className="text-xs text-slate-400 block">Entidad seleccionada:</span>
                  <span className="text-sm sm:text-base font-bold text-white">{entity.name}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (capturedAnswersCount > 0) {
                    setPendingChangeAction(() => () => {
                      setEntity(null);
                      setClues(null);
                    });
                    setShowWarningModal(true);
                  } else {
                    setEntity(null);
                    setClues(null);
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-600/50 transition-colors cursor-pointer"
              >
                Cambiar entidad
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={entityQuery}
                  onChange={(e) => {
                    setEntityQuery(e.target.value);
                    setIsEntityDropdownOpen(true);
                  }}
                  onFocus={() => setIsEntityDropdownOpen(true)}
                  placeholder="Escriba el nombre o parte del nombre de la entidad (ej. Chiapas, Veracruz, Ciudad de México)..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-emerald-900/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-400 text-sm outline-none transition-all"
                />
              </div>

              {isEntityDropdownOpen && (
                <div className="absolute z-20 mt-1 w-full max-h-60 overflow-y-auto rounded-xl bg-slate-900/95 border border-emerald-800/60 shadow-2xl divide-y divide-slate-800 backdrop-blur-md">
                  {filteredEntities.length > 0 ? (
                    filteredEntities.map((ent) => (
                      <button
                        key={ent.id}
                        type="button"
                        onClick={() => handleSelectEntity(ent)}
                        className="w-full text-left px-4 py-2.5 hover:bg-emerald-950/60 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <span className="text-sm font-medium text-slate-200 group-hover:text-emerald-300">
                          {ent.name}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-xs text-slate-400">
                      No se encontraron entidades coincidentes con &quot;{entityQuery}&quot;.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. Selector de CLUES (condicionado a Entidad) */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            2. Establecimiento Hospitalario (CLUES){' '}
            <span className="text-emerald-400">*</span>
          </label>

          {!entity ? (
            <div className="p-4 rounded-xl bg-black/20 border border-dashed border-slate-700/60 text-xs text-slate-400 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>Primero busque y seleccione una Entidad Federativa para habilitar el catálogo de CLUES.</span>
            </div>
          ) : clues ? (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-emerald-500/40">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 shrink-0 mt-0.5 border border-emerald-500/30">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/40">
                      {clues.clues}
                    </span>
                    <span className="text-[11px] text-slate-400">{clues.tipo}</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white mt-1">{clues.name}</h4>
                  {clues.region && (
                    <span className="text-[11px] text-emerald-300/80 block mt-0.5">
                      {clues.region}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (capturedAnswersCount > 0) {
                    setPendingChangeAction(() => () => setClues(null));
                    setShowWarningModal(true);
                  } else {
                    setClues(null);
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-600/50 transition-colors cursor-pointer shrink-0 ml-3"
              >
                Cambiar CLUES
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={cluesQuery}
                  onChange={(e) => setCluesQuery(e.target.value)}
                  placeholder={`Buscar CLUES o nombre de unidad en ${entity.name}...`}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-emerald-900/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-400 text-sm outline-none transition-all"
                />
              </div>

              {/* Lista compacta de resultados CLUES */}
              <div className="max-h-52 overflow-y-auto rounded-xl bg-black/40 border border-emerald-900/40 divide-y divide-slate-800/80">
                {filteredCluesList.length > 0 ? (
                  filteredCluesList.map((item) => (
                    <button
                      key={item.clues}
                      type="button"
                      onClick={() => handleSelectClues(item)}
                      className="w-full text-left p-3 hover:bg-emerald-950/60 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-semibold text-emerald-400">
                            {item.clues}
                          </span>
                          <span className="text-[10px] text-slate-400 bg-black/40 px-1.5 py-0.5 rounded">
                            {item.tipo}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm text-slate-200 group-hover:text-emerald-200 font-medium mt-0.5">
                          {item.name}
                        </div>
                      </div>
                      <span className="text-xs text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium ml-2 shrink-0">
                        Seleccionar →
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-xs text-slate-400 mb-2">
                      No se encontraron establecimientos con ese criterio en {entity.name}.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowCustomCluesModal(true)}
                      className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-600/30 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Ingresar CLUES manualmente</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Resumen previo de Confirmación Institucional */}
        {entity && clues && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/40 mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Resumen Institucional a Registrar</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400">Entidad:</span>
                <p className="font-bold text-white">{entity.name}</p>
              </div>
              <div>
                <span className="text-slate-400">CLUES:</span>
                <p className="font-mono font-bold text-emerald-300">{clues.clues}</p>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-sm font-medium border border-slate-700/50 transition-colors flex items-center space-x-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Instrucciones</span>
          </button>

          <button
            type="button"
            disabled={!entity || !clues}
            onClick={handleConfirmAndProceed}
            className={`px-7 py-3 rounded-xl font-bold text-sm tracking-wide shadow-lg transition-all flex items-center space-x-2 ${
              entity && clues
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-emerald-950/50'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40'
            }`}
          >
            <span>Confirmar y Comenzar Captura</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* MODAL ADVERTENCIA CAMBIO CON RESPUESTAS */}
      <AnimatePresence>
        {showWarningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md w-full institutional-glass rounded-2xl p-6 border border-amber-500/40 text-slate-100 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                ¿Cambiar Entidad o Establecimiento?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                Tiene actualmente <strong>{capturedAnswersCount} respuestas capturadas</strong>. Si cambia la Entidad o CLUES, las respuestas registradas corresponderán a la nueva unidad.
              </p>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowWarningModal(false);
                    setPendingChangeAction(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Conservar actual
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (pendingChangeAction) pendingChangeAction();
                    setShowWarningModal(false);
                    setPendingChangeAction(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer"
                >
                  Sí, cambiar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL CLUES MANUAL */}
      <AnimatePresence>
        {showCustomCluesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md w-full institutional-glass rounded-2xl p-6 border border-emerald-500/40 text-slate-100 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Ingresar CLUES manualmente</h3>
                <button
                  onClick={() => setShowCustomCluesModal(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-300 mb-4">
                Si su unidad médica no aparece en el listado rápido de muestra para {entity?.name}, ingrese la clave y el nombre oficial del establecimiento.
              </p>
              <div className="space-y-3 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Código CLUES (11 caracteres)
                  </label>
                  <input
                    type="text"
                    value={customCluesCode}
                    onChange={(e) => setCustomCluesCode(e.target.value)}
                    placeholder="Ej. DFSSA001999"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-slate-700 text-white text-xs uppercase font-mono outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nombre del Hospital o Centro de Salud
                  </label>
                  <input
                    type="text"
                    value={customHospitalName}
                    onChange={(e) => setCustomHospitalName(e.target.value)}
                    placeholder="Ej. Hospital Comunitario Santa María"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-slate-700 text-white text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCustomCluesModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={!customCluesCode.trim() || !customHospitalName.trim()}
                  onClick={handleSaveCustomClues}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white text-xs font-bold"
                >
                  Registrar CLUES
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
