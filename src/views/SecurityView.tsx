//
import React, { useState } from 'react';

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

const SecurityView: React.FC<Props> = ({ onBack, onSuccess }) => {
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [error, setError] = useState(false);

  const generateNewCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(code);
    setError(false);
  };

  const handleValidation = () => {
    if (inputCode === generatedCode && generatedCode !== '') {
      onSuccess();
    } else {
      setError(true);
      setInputCode('');
    }
  };

  return (
    <div className="p-8 flex flex-col items-center space-y-8 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">Validación de Usuario</h2>
        <p className="text-slate-500">Paso 1: Seguridad del Operador</p>
      </div>

      <div className="bg-slate-100 p-8 rounded-2xl w-full max-w-sm text-center border border-slate-200">
        {!generatedCode ? (
          <button 
            onClick={generateNewCode}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors w-full shadow-lg"
          >
            Generar Código Secreto
          </button>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-white border-2 border-dashed border-indigo-300 rounded-lg">
              <span className="text-4xl font-mono font-bold tracking-[0.5em] text-indigo-600">{generatedCode}</span>
            </div>
            <p className="text-xs text-slate-400">Memoriza este código e ingrésalo debajo.</p>
            
            <input 
              type="text"
              maxLength={4}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
              placeholder="Ingrese código"
              className={`w-full text-center text-2xl font-mono p-3 border-2 rounded-xl focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-200'}`}
            />

            {error && <p className="text-red-500 text-xs font-bold">Código incorrecto. Inténtelo de nuevo.</p>}

            <button 
              onClick={handleValidation}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg"
            >
              Ingresar Ficha
            </button>
          </div>
        )}
      </div>

      <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium transition-colors">
        ← Volver al Panel
      </button>
    </div>
  );
};

export default SecurityView;
