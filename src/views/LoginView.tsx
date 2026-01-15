
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
    <div className="bg-gradient-to-b from-[#1a237e] to-[#0c0f2e] text-white min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="w-full py-6 px-6 flex items-center justify-center">
        <h1 className="text-2xl font-bold tracking-wider">
          Inicio de Sesión
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
                            
          <div className="mb-8 text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-32 h-32 mx-auto">
              <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
            </svg>
          </div>

          <p className="text-gray-400 mb-10">
            Accede a tu cuenta.
          </p>

          <div className="flex justify-center">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="inline-flex items-center justify-center gap-3 bg-[#4285F4] hover:bg-[#357ae8] active:scale-[0.98] transition-all py-3 px-6 rounded-lg text-white font-medium shadow-md text-base w-full"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="bg-white p-1 rounded-full flex items-center justify-center">
                  <svg height="20" viewBox="0 0 24 24" width="20">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                </div>
              )}
              <span>{loading ? 'CONECTANDO...' : 'Continuar con Google'}</span>
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </main>
    </div>
  );
};

export default LoginView;
