
import React, { useState } from 'react';
import { mockFirestore } from '../firebase';
import { FichaData, UserProfile } from '../types';

interface Props {
  user: UserProfile | null;
  onBack: () => void;
  onFichaFound: (ficha: FichaData) => void;
  onViewSummary: (ficha: FichaData) => void;
}

const mapFirestoreToFicha = (raw: any): FichaData => {
  return {
    documentNumber: raw.documentNumber || '',
    documentType: raw.documentType || 'Cédula de ciudadanía',
    countryCode: raw.countryCode || '+57',
    estado: raw.estado || 'Pendiente',
    phoneNumber: raw.phoneNumber || '',
    fichaId: raw.fichaId || '',
    createdAt: raw.createdAt || '',
    fecha_actualizacion: raw.fecha_actualizacion || '',
    createdBy: raw.createdBy || '',
    nombre: raw.grupo1_personal?.nombre || '',
    apellidos: raw.grupo1_personal?.apellidos || '',
    fechaNacimiento: raw.grupo1_personal?.fechanacimiento || '',
    edad: raw.grupo1_personal?.edad || '',
    nacionalidad: raw.grupo1_personal?.nacionalidad || 'Colombiano(a)',
    direccion: raw.grupo2_ubicacion?.direccion || '',
    barrio: raw.grupo2_ubicacion?.barrio || '',
    municipio: raw.grupo2_ubicacion?.municipio || '',
    departamento: raw.grupo2_ubicacion?.departamento || '',
    estrato: raw.grupo2_ubicacion?.estrato || '',
    telefonoFijo: raw.grupo2_ubicacion?.telefonoFijo || '',
    emailPersonal: raw.grupo2_ubicacion?.email || '',
    esMadreCabezaHogar: raw.grupo3_socioeconomico?.esMadreCabezaHogar || 'No',
    estadoCivil: raw.grupo3_socioeconomico?.estadoCivil || 'Soltero(a)',
    nivelEstudios: raw.grupo3_socioeconomico?.nivelEstudios || 'Bachillerato',
    numeroHijos: raw.grupo3_socioeconomico?.numeroHijos || '0',
    ocupacion: raw.grupo3_socioeconomico?.ocupacion || '',
    personasACargo: raw.grupo3_socioeconomico?.personasACargo || '0',
    tipoVivienda: raw.grupo3_socioeconomico?.tipoVivienda || 'Propia',
    zonaVivienda: raw.grupo3_socioeconomico?.zonaVivienda || 'Urbana',
    grupoFamiliar: raw.grupo3_socioeconomico?.grupoFamiliar || [],
    afiliadoSalud: raw.grupo4_seguridad_social?.afiliadoSalud || 'Sí',
    condicionMedica: raw.grupo4_seguridad_social?.condicionMedica || 'No',
    cotizaPension: raw.grupo4_seguridad_social?.cotizaPension || 'No',
    cualCondicion: raw.grupo4_seguridad_social?.cualCondicion || '',
    discapacidad: raw.grupo4_seguridad_social?.discapacidad || 'No',
    eps: raw.grupo4_seguridad_social?.eps || '',
    fondoPension: raw.grupo4_seguridad_social?.fondoPension || '',
    regimenSalud: raw.grupo4_seguridad_social?.regimenSalud || 'Contributivo',
    tipoDiscapacidad: raw.grupo4_seguridad_social?.tipoDiscapacidad || '',
    cajaCompensacion: raw.grupo4_seguridad_social?.cajaCompensacion || '',
    autorizaTratamiento: raw.grupo5_adicional?.autorizaTratamiento ?? true,
    cualBeneficio: raw.grupo5_adicional?.cualBeneficio || '',
    observaciones: raw.grupo5_adicional?.observaciones || '',
    poblacionVulnerable: raw.grupo5_adicional?.poblacionVulnerable || 'Ninguna',
    recibeBeneficio: raw.grupo3_socioeconomico?.recibeBeneficio || 'No',
    estudiosRealizados: raw.grupo5_adicional?.estudiosRealizados || '',
    profesion: raw.grupo5_adicional?.profesion || ''
  };
};

const SearchView: React.FC<Props> = ({ user, onBack, onFichaFound, onViewSummary }) => {
  const [searchId, setSearchId] = useState('');
  const [docType, setDocType] = useState('Cédula de ciudadanía');
  const [docNumber, setDocNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentFicha, setCurrentFicha] = useState<FichaData | null>(null);
  const [isFound, setIsFound] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    setIsSearching(true);
    setIsFound(false);
    setErrorMsg(null);
    try {
      const result = await mockFirestore.getFicha(searchId);
      if (result) {
        const ficha = mapFirestoreToFicha(result);
        setDocNumber(ficha.documentNumber);
        setPhone(ficha.phoneNumber);
        setDocType(ficha.documentType);
        setCurrentFicha(ficha);
        setIsFound(true);
      } else {
        setDocNumber(searchId);
        setPhone('');
        setIsFound(false);
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Error de conexión inesperado.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAction = () => {
    if (isFound && currentFicha) {
      onFichaFound(currentFicha);
    } else {
      if (!docNumber || !phone) {
        alert("Por favor ingrese el número de documento y el celular para iniciar el registro.");
        return;
      }
      const newFicha: FichaData = {
        documentNumber: docNumber, documentType: docType, countryCode: '+57', estado: 'Pendiente', phoneNumber: phone,
        nombre: '', apellidos: '', fechaNacimiento: '', edad: '', nacionalidad: 'Colombiano(a)',
        direccion: '', barrio: '', municipio: '', departamento: '', estrato: '', telefonoFijo: '', emailPersonal: '',
        esMadreCabezaHogar: 'No', estadoCivil: 'Soltero(a)', nivelEstudios: 'Bachillerato', numeroHijos: '0', ocupacion: '', personasACargo: '0', tipoVivienda: 'Propia', zonaVivienda: 'Urbana',
        grupoFamiliar: [],
        afiliadoSalud: 'Sí', condicionMedica: 'No', cotizaPension: 'No', cualCondicion: '', discapacidad: 'No', eps: '', fondoPension: '', regimenSalud: 'Contributivo', tipoDiscapacidad: '',
        cajaCompensacion: '',
        autorizaTratamiento: true, cualBeneficio: '', observaciones: '', poblacionVulnerable: 'Ninguna', recibeBeneficio: 'No',
        estudiosRealizados: '', profesion: '',
        createdBy: user?.email || 'sistema'
      };
      onFichaFound(newFicha);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-fadeIn p-5 md:p-8 space-y-5">
      <div className="flex justify-between items-start px-2">
        <div className="space-y-1">
          <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Buscar Postulante</h2>
          <p className="text-slate-400 text-[10px] md:text-sm font-medium">Ingrese los datos para verificar o iniciar un registro.</p>
        </div>
        <button onClick={onBack} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="w-full h-[1px] bg-slate-100"></div>

      {errorMsg && (
        <div className="px-2">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center gap-3">
            <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
            <p className="text-[10px] font-bold text-amber-800 uppercase leading-tight">{errorMsg}</p>
          </div>
        </div>
      )}

      <div className="px-2">
        <div className="flex items-center bg-slate-50 border border-slate-100 rounded-full p-1.5 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <div className="pl-4 pr-2">
            <svg className="h-4 w-4 md:h-5 md:w-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input 
            type="text" 
            placeholder="Buscar por cédula..." 
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-grow min-w-0 bg-transparent border-none focus:ring-0 text-slate-600 font-bold placeholder-slate-300 text-xs md:text-base py-2.5"
          />
          <button 
            onClick={handleSearch}
            disabled={isSearching}
            className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-5 md:px-8 py-2.5 rounded-full text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95"
          >
            {isSearching ? '...' : 'BUSCAR'}
          </button>
        </div>
      </div>

      <div className="px-1">
        <div className="bg-slate-50 border border-slate-100 rounded-[2.2rem] p-5 md:p-8 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Tipo de Documento</label>
            <div className="relative">
              <select 
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-2xl p-3.5 text-xs md:text-sm font-bold text-slate-700 outline-none appearance-none cursor-pointer pr-10"
              >
                <option>Cédula de ciudadanía</option>
                <option>Cédula de extranjería</option>
                <option>Pasaporte</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Número de Documento</label>
            <input 
              type="text" 
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              placeholder="72167569"
              className="w-full bg-white border border-slate-100 rounded-2xl p-3.5 text-xs md:text-sm font-bold text-slate-700 outline-none" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Número de Celular</label>
            <div className="flex gap-2">
              <div className="bg-blue-50 border border-blue-100 px-4 py-3.5 rounded-2xl flex items-center justify-center font-black text-blue-900 text-[10px] md:text-sm">+57</div>
              <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="3XXXXXXXXX"
                className="flex-grow min-w-0 bg-white border border-slate-100 rounded-2xl p-3.5 text-xs md:text-sm font-bold text-slate-700 outline-none" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-2 pt-2">
        <button 
          onClick={handleAction}
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 md:py-5 rounded-full font-black text-[10px] md:text-sm uppercase tracking-[0.25em] shadow-[0_10px_20px_rgba(249,115,22,0.25)] hover:scale-[1.01] active:scale-95 transition-all"
        >
          {isFound ? 'CONTINUAR REGISTRO' : 'INICIAR REGISTRO'}
        </button>
      </div>

      {isFound && (
        <button 
          onClick={() => currentFicha && onViewSummary(currentFicha)}
          className="w-full text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline text-center pb-2"
        >
          Ver resumen actual de la ficha
        </button>
      )}
    </div>
  );
};

export default SearchView;
