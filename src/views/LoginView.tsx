
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { auth, provider, signInWithPopup } from '../firebase';

interface Props {
  onLogin: (profile: UserProfile) => void;
}

const LoginView: React.FC<Props> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email || 'No email provided',
        displayName: user.displayName || 'No name provided',
        photoURL: user.photoURL
      };
      onLogin(profile);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-16 text-center space-y-8 animate-fadeIn">
      <div className="space-y-4">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">Bienvenido al Portal PEAIMCF</h2>
        <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
          Fundación Misión Colombia (FMC). Inicie sesión con su cuenta corporativa para gestionar las fichas del proyecto.
        </p>
      </div>

      <div className="w-full max-w-sm">
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`group w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 px-6 py-5 rounded-[2rem] font-black text-slate-700 transition-all duration-300 shadow-sm active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6 group-hover:scale-110 transition-transform" />
          )}
          <span className="text-sm tracking-tight">{loading ? 'CONECTANDO...' : 'Continuar con Google'}</span>
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <div className="pt-12 border-t border-slate-100 w-full max-w-md">
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Acceso Privado y Seguro</p>
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Fundación Misión Colombia © 2024</p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
