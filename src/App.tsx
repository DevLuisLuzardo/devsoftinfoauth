// App.tsx
import React, { useState, useEffect } from 'react';
import { UserProfile, Step, FichaData } from './types';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import SecurityView from './views/SecurityView';
import SearchView from './views/SearchView';
import FormStepperView from './views/FormStepperView';
import ViewSummary from './views/ViewSummary';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>(Step.LOGIN);
  const [selectedFicha, setSelectedFicha] = useState<FichaData | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('fmc_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentStep(Step.DASHBOARD);
    }
  }, []);

  const handleLogin = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('fmc_user', JSON.stringify(profile));
    setCurrentStep(Step.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fmc_user');
    setCurrentStep(Step.LOGIN);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case Step.LOGIN:
        return <LoginView onLogin={handleLogin} />;
      case Step.DASHBOARD:
        return <DashboardView user={user} onLogout={handleLogout} onStartRegistration={() => setCurrentStep(Step.SECURITY_CHECK)} />;
      case Step.SECURITY_CHECK:
        return <SecurityView onBack={() => setCurrentStep(Step.DASHBOARD)} onSuccess={() => setCurrentStep(Step.SEARCH_ID)} />;
      case Step.SEARCH_ID:
        return (
          <SearchView 
            user={user}
            onBack={() => setCurrentStep(Step.SECURITY_CHECK)} 
            onFichaFound={(ficha) => {
              setSelectedFicha(ficha);
              setCurrentStep(Step.FORM_STEPPER);
            }} 
            onViewSummary={(ficha) => {
              setSelectedFicha(ficha);
              setCurrentStep(Step.VIEW_SUMMARY);
            }}
          />
        );
      case Step.FORM_STEPPER:
        return selectedFicha ? (
          <FormStepperView 
            ficha={selectedFicha} 
            onBack={() => setCurrentStep(Step.SEARCH_ID)} 
            onComplete={() => {
              setCurrentStep(Step.DASHBOARD);
              alert("Registro PEAIMCF finalizado exitosamente.");
            }} 
          />
        ) : null;
      case Step.VIEW_SUMMARY:
        return selectedFicha ? (
          <ViewSummary 
            ficha={selectedFicha} 
            onBack={() => setCurrentStep(Step.SEARCH_ID)} 
            onEdit={() => setCurrentStep(Step.FORM_STEPPER)} 
          />
        ) : null;
      default:
        return <LoginView onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <header className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-4 shadow-xl sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-xl shadow-inner">
               <svg className="w-7 h-7 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
            <h1 className="text-lg font-black tracking-tight uppercase">FMC PEAIMCF</h1>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-blue-200">Operador Activo</span>
                <span className="text-xs font-bold leading-none">{user.displayName}</span>
              </div>
              <button onClick={handleLogout} className="bg-blue-700/50 hover:bg-red-500/80 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8 flex justify-center items-start">
        <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100">
          {renderCurrentStep()}
        </div>
      </main>

      <footer className="bg-white p-6 text-center border-t border-slate-100">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Fundación Misión Colombia (FMC) - Proyecto PEAIMCF © 2024</p>
      </footer>
    </div>
  );
};

export default App;
