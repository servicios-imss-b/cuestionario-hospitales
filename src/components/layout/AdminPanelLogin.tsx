import React, { FormEvent, useState } from 'react';
import { LockKeyhole, X } from 'lucide-react';

interface AdminPanelLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const DASHBOARD_URL = 'https://servicios-imss-b.github.io/reporte-new/';
const PANEL_USERNAME = 'add.31';
const PANEL_PASSWORD = '3180';

export const AdminPanelLogin: React.FC<AdminPanelLoginProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username.trim() !== PANEL_USERNAME || password !== PANEL_PASSWORD) {
      setHasError(true);
      return;
    }

    window.location.assign(DASHBOARD_URL);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="admin-panel-login-title"
        aria-modal="true"
        className="w-full max-w-md rounded-xl border border-emerald-500/30 bg-slate-950 p-6 text-slate-100 shadow-2xl"
        role="dialog"
      >
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <LockKeyhole className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold" id="admin-panel-login-title">Acceso al panel de datos</h2>
          </div>
          <button
            aria-label="Cerrar"
            className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-1.5 text-sm">
            <span>Usuario</span>
            <input
              autoComplete="username"
              autoFocus
              className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
              onChange={(event) => {
                setUsername(event.target.value);
                setHasError(false);
              }}
              value={username}
            />
          </label>

          <label className="block space-y-1.5 text-sm">
            <span>Contraseña</span>
            <input
              autoComplete="current-password"
              className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
              onChange={(event) => {
                setPassword(event.target.value);
                setHasError(false);
              }}
              type="password"
              value={password}
            />
          </label>

          {hasError && (
            <p className="text-sm text-rose-300" role="alert">Usuario o contraseña incorrectos.</p>
          )}

          <button
            className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-600"
            type="submit"
          >
            Entrar al panel
          </button>
        </form>
      </section>
    </div>
  );
};