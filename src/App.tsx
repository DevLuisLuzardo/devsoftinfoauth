
import React, { useState, useEffect } from 'react';
import { UserProfile, Step, FichaData } from './types';
import LoginView from './login/LoginView';
import DashboardView from './views/DashboardView';
import SecurityView from './views/SecurityView';
import SearchView from './views/SearchView';
import FormStepperView from './views/FormStepperView';
import ViewSummary from './views/ViewSummary';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>(Step.LOGIN);
  const [selectedFicha, setSelectedFicha] = useState<FichaData | null>(null);

  // Theme state and logic
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleDarkMode = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <header className="bg-[#f0f2f5] text-black dark:bg-gradient-to-r dark:from-blue-800 dark:to-indigo-900 dark:text-white p-4 shadow-xl sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <a href="https://imgbb.com/"><img src="https://i.ibb.co/7t0LHGkr/logo-Devsoftinfo-removebg-preview.png" alt="logo Devsoftinfo removebg preview" style={{ height: '80px' }} /></a>
            <h1 className="text-lg font-black tracking-tight uppercase">Develop Soft Info</h1>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-blue-300">Operador Activo</span>
                <span className="text-xs font-bold leading-none">{user.displayName}</span>
              </div>
              <button onClick={handleLogout} className="bg-red-500/80 hover:bg-red-600/80 dark:bg-blue-700/50 dark:hover:bg-red-500/80 px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">Cerrar Sesión</button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8 flex justify-center items-start pb-24">
        <div className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 dark:border-slate-700">
          {renderCurrentStep()}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-[#f0f2f5] dark:bg-slate-900 p-6 text-center border-t border-slate-100 dark:border-slate-700 z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Develop Soft Info</p>
      </footer>

      <div className="fixed bottom-20 right-4 z-50">
        <button
          className="p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-lg text-2xl"
          onClick={toggleDarkMode}
        >
          {theme === 'dark' ? '🌙' : '🔆'}
        </button>
      </div>
    </div>
  );
};

export default App;
