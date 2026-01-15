
import React from 'react';
import { UserProfile } from '../types';

interface Props {
  user: UserProfile | null;
  onLogout: () => void;
  onStartRegistration: () => void;
}

const DashboardView: React.FC<Props> = ({ user, onLogout, onStartRegistration }) => {
  return (
    <div className="p-6 md:p-12 space-y-10 animate-fadeIn bg-white rounded-[2rem] shadow-xl border border-slate-100">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Panel de Gestión</h2>
        <p className="text-slate-500 font-medium">Bienvenido(a), <span className="text-blue-600 font-bold">{user?.displayName}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={onStartRegistration}
          className="group flex flex-col items-start p-8 bg-blue-600 text-white rounded-[2rem] transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-100"
        >
          <div className="bg-white/20 p-3 rounded-2xl mb-4 group-hover:rotate-12 transition-transform">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
          </div>
          <span className="text-xl font-black uppercase tracking-tight">Nueva Ficha</span>
          <span className="text-blue-100 text-sm mt-1">Iniciar registro de postulante</span>
        </button>

        <button 
          className="group flex flex-col items-start p-8 bg-slate-800 text-white rounded-[2rem] transition-all hover:bg-slate-900 opacity-90 cursor-not-allowed"
        >
          <div className="bg-white/10 p-3 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <span className="text-xl font-black uppercase tracking-tight text-slate-400">Informes</span>
          <span className="text-slate-500 text-sm mt-1 italic">Módulo en mantenimiento</span>
        </button>
      </div>

      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-6">
        <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Recordatorio</p>
          <p className="text-sm font-bold text-slate-700 tracking-tight">Recuerde verificar la cédula antes de iniciar el registro.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
