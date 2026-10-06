import React from 'react';
import { HardDrive, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  saveStatus: 'saving' | 'saved' | 'error';
  currentStage: 'cover' | 'instructions' | 'selector' | 'capture' | 'review' | 'success';
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  saveStatus,
  currentStage,
  isOnline,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-b from-black/55 to-transparent transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Title */}
        <div className="flex items-center space-x-3">
          <img
            src="https://imssbienestar.gob.mx/assets/img/imb_b.svg"
            alt="IMSS Bienestar"
            className="h-10 w-auto object-contain"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-base font-semibold text-slate-100 tracking-tight leading-none">
                Cuestionario Hospitalario
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block mt-0.5">
              Evaluación Directiva & Coordinación Regional
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 rounded-md px-1.5 sm:px-2 py-1 text-[10px] sm:text-[11px] ${
              isOnline ? 'bg-emerald-950/75 text-emerald-200' : 'bg-rose-950/75 text-rose-200'
            }`}
            title={isOnline ? 'El dispositivo detecta conexión de red' : 'Sin conexión de red; las respuestas se conservan localmente'}
          >
            {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            <span className="sm:hidden">{isOnline ? 'En línea' : 'Sin red'}</span>
            <span className="hidden sm:inline">Internet {isOnline ? 'conectado' : 'desconectado'}</span>
          </div>
          {currentStage === 'capture' && (
            <div className="flex items-center text-xs px-2.5 py-1 rounded-md bg-black/30 border border-white/10">
              {saveStatus === 'saving' && (
                <span className="flex items-center text-amber-300 animate-pulse space-x-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Guardando...</span>
                  <span className="sm:hidden">Guardando</span>
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="flex items-center text-emerald-300 space-x-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Guardado localmente</span>
                  <span className="sm:hidden">Local</span>
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="flex items-center text-rose-300 space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Error al guardar</span>
                  <span className="sm:hidden">Error</span>
                </span>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
