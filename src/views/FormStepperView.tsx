
import React, { useState } from 'react';
import { FichaData, FamilyMember } from '../types';
import { mockFirestore } from '../firebase';

interface Props {
  ficha: FichaData;
  onBack: () => void;
  onComplete: () => void;
}

const FormStepperView: React.FC<Props> = ({ ficha, onBack, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FichaData>({
    ...ficha,
    nombre: ficha.nombre || '',
    apellidos: ficha.apellidos || '',
    documentNumber: ficha.documentNumber || '',
    documentType: ficha.documentType || 'Cédula de ciudadanía',
    fechaNacimiento: ficha.fechaNacimiento || '',
    edad: ficha.edad || '',
    nacionalidad: ficha.nacionalidad || '',
    direccion: ficha.direccion || '',
    barrio: ficha.barrio || '',
    municipio: ficha.municipio || '',
    departamento: ficha.departamento || '',
    estrato: ficha.estrato || '',
    telefonoFijo: ficha.telefonoFijo || '',
    emailPersonal: ficha.emailPersonal || '',
    esMadreCabezaHogar: ficha.esMadreCabezaHogar || 'No',
    estadoCivil: ficha.estadoCivil || 'Soltero(a)',
    nivelEstudios: ficha.nivelEstudios || '',
    numeroHijos: ficha.numeroHijos || '0',
    ocupacion: ficha.ocupacion || '',
    personasACargo: ficha.personasACargo || '0',
    tipoVivienda: ficha.tipoVivienda || 'Propia',
    zonaVivienda: ficha.zonaVivienda || 'Urbana',
    afiliadoSalud: ficha.afiliadoSalud || 'Sí',
    condicionMedica: ficha.condicionMedica || 'No',
    cotizaPension: ficha.cotizaPension || 'No',
    cualCondicion: ficha.cualCondicion || '',
    discapacidad: ficha.discapacidad || 'No',
    eps: ficha.eps || '',
    fondoPension: ficha.fondoPension || '',
    regimenSalud: ficha.regimenSalud || 'Contributivo',
    tipoDiscapacidad: ficha.tipoDiscapacidad || '',
    cajaCompensacion: ficha.cajaCompensacion || '',
    autorizaTratamiento: ficha.autorizaTratamiento ?? true,
    cualBeneficio: ficha.cualBeneficio || '',
    observaciones: ficha.observaciones || '',
    poblacionVulnerable: ficha.poblacionVulnerable || 'Ninguna',
    recibeBeneficio: ficha.recibeBeneficio || 'No',
    grupoFamiliar: ficha.grupoFamiliar || [],
    estudiosRealizados: ficha.estudiosRealizados || '',
    profesion: ficha.profesion || ''
  });

  const [tempMember, setTempMember] = useState<FamilyMember>({
    parentesco: 'Hijo',
    genero: 'Femenino',
    edad: '0'
  });

  const [isSaving, setIsSaving] = useState(false);

  const calculateAge = (birthday: string) => {
    if (!birthday) return '';
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) { age--; }
    return age >= 0 ? age.toString() : '0';
  };

  const updateField = (field: keyof FichaData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      if (field === 'fechaNacimiento') { newData.edad = calculateAge(value); }
      return newData;
    });
  };

  const addFamilyMember = () => {
    if (!tempMember.edad) return;
    setFormData(prev => ({
      ...prev,
      grupoFamiliar: [...prev.grupoFamiliar, { ...tempMember }]
    }));
    setTempMember({ parentesco: 'Hijo', genero: 'Femenino', edad: '0' });
  };

  const removeFamilyMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      grupoFamiliar: prev.grupoFamiliar.filter((_, i) => i !== index)
    }));
  };

  const prepareFirestoreData = (data: FichaData, status: string) => {
    return {
      documentNumber: data.documentNumber,
      documentType: data.documentType,
      countryCode: data.countryCode || "+57",
      estado: status,
      createdBy: data.createdBy || 'sistema',
      createdAt: data.createdAt || new Date().toISOString(),
      fichaId: data.fichaId || `2026-MCF-${data.documentNumber.slice(-4)}`,
      phoneNumber: data.phoneNumber,
      
      grupo1_personal: {
        nombre: data.nombre,
        apellidos: data.apellidos,
        fechanacimiento: data.fechaNacimiento,
        edad: data.edad,
        nacionalidad: data.nacionalidad
      },
      grupo2_ubicacion: {
        barrio: data.barrio,
        departamento: data.departamento,
        direccion: data.direccion,
        email: data.emailPersonal,
        estrato: data.estrato,
        municipio: data.municipio,
        telefonoFijo: data.telefonoFijo
      },
      grupo3_socioeconomico: {
        esMadreCabezaHogar: data.esMadreCabezaHogar,
        estadoCivil: data.estadoCivil,
        nivelEstudios: data.nivelEstudios,
        numeroHijos: data.numeroHijos,
        ocupacion: data.ocupacion,
        personasACargo: data.personasACargo,
        tipoVivienda: data.tipoVivienda,
        zonaVivienda: data.zonaVivienda,
        recibeBeneficio: data.recibeBeneficio,
        cualBeneficio: data.cualBeneficio,
        grupoFamiliar: data.grupoFamiliar
      },
      grupo4_seguridad_social: {
        afiliadoSalud: data.afiliadoSalud,
        condicionMedica: data.condicionMedica,
        cotizaPension: data.cotizaPension,
        cualCondicion: data.cualCondicion,
        discapacidad: data.discapacidad,
        eps: data.eps,
        fondoPension: data.fondoPension,
        regimenSalud: data.regimenSalud,
        tipoDiscapacidad: data.tipoDiscapacidad,
        cajaCompensacion: data.cajaCompensacion
      },
      grupo5_adicional: {
        autorizaTratamiento: data.autorizaTratamiento,
        observaciones: data.observaciones,
        poblacionVulnerable: data.poblacionVulnerable,
        estudiosRealizados: data.estudiosRealizados,
        profesion: data.profesion
      }
    };
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const structuredData = prepareFirestoreData(formData, 'En Proceso');
      await mockFirestore.updateFicha(formData.documentNumber, structuredData);
      alert("Registro guardado exitosamente.");
    } catch (e) {
      alert("Error al guardar en la base de datos.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => { if (currentStep < 5) setCurrentStep(currentStep + 1); };
  const handlePrev = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); else onBack(); };

  return (
    <div className="p-4 md:p-8 animate-fadeIn bg-white min-h-[900px] flex flex-col">
      <div className="flex justify-between items-start mb-6 px-2">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">REGISTRO DE<br/>POSTULANTE</h2>
          <p className="text-[10px] font-bold text-blue-600/60 font-mono">CC: {formData.documentNumber}</p>
        </div>
        <div className="text-right">
          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
            {formData.estado || 'PENDIENTE'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8 px-2 max-w-md mx-auto w-full">
        {[1, 2, 3, 4, 5].map((num) => (
          <React.Fragment key={num}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm border-2 transition-all ${currentStep === num ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : currentStep > num ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>{num}</div>
              <span className={`text-[7px] md:text-[8px] mt-2 font-black uppercase tracking-widest ${currentStep === num ? 'text-blue-700' : 'text-slate-400'}`}>PASO {num}</span>
            </div>
            {num < 5 && <div className={`flex-grow h-0.5 mx-1 mb-5 ${currentStep > num ? 'bg-blue-600' : 'bg-slate-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-slate-50 rounded-[2.5rem] p-6 md:p-8 border border-slate-100 flex-grow shadow-inner overflow-y-auto max-h-[600px]">
        
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] border-b border-blue-100 pb-2">DATOS PERSONALES BÁSICOS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nombres Completos</label>
                <input type="text" value={formData.nombre} onChange={e => updateField('nombre', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold focus:border-blue-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Apellidos Completos</label>
                <input type="text" value={formData.apellidos} onChange={e => updateField('apellidos', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold focus:border-blue-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Tipo de Documento</label>
                <select value={formData.documentType} onChange={e => updateField('documentType', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold focus:border-blue-500 outline-none">
                  <option>Cédula de ciudadanía</option>
                  <option>Cédula de extranjería</option>
                  <option>Pasaporte</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Número de Documento</label>
                <input type="text" value={formData.documentNumber} readOnly className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-slate-100 text-sm font-bold cursor-not-allowed" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-blue-600 uppercase ml-2 tracking-widest">Fecha Nacimiento</label>
                <input type="date" value={formData.fechaNacimiento} onChange={e => updateField('fechaNacimiento', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-blue-100 bg-white text-sm font-bold focus:border-blue-500 outline-none shadow-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Edad (Calculada)</label>
                <input type="text" value={formData.edad} readOnly className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-slate-100 text-sm font-bold" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nacionalidad</label>
                <input type="text" value={formData.nacionalidad} onChange={e => updateField('nacionalidad', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold focus:border-blue-500 outline-none" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] border-b border-blue-100 pb-2">UBICACIÓN Y CONTACTO</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Dirección de Residencia</label>
                <input type="text" value={formData.direccion} onChange={e => updateField('direccion', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Barrio</label>
                  <input type="text" value={formData.barrio} onChange={e => updateField('barrio', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Municipio / Ciudad</label>
                  <input type="text" value={formData.municipio} onChange={e => updateField('municipio', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Departamento</label>
                  <input type="text" value={formData.departamento} onChange={e => updateField('departamento', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Estrato</label>
                  <select value={formData.estrato} onChange={e => updateField('estrato', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold">
                    <option value="">Seleccione</option>
                    <option value="1">Estrato 1</option>
                    <option value="2">Estrato 2</option>
                    <option value="3">Estrato 3</option>
                    <option value="4">Estrato 4</option>
                    <option value="5">Estrato 5</option>
                    <option value="6">Estrato 6</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Correo Electrónico</label>
                  <input type="email" value={formData.emailPersonal} onChange={e => updateField('emailPersonal', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Teléfono Fijo</label>
                  <input type="text" value={formData.telefonoFijo} onChange={e => updateField('telefonoFijo', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-blue-600 uppercase ml-2 tracking-widest">Número de Celular</label>
                <input type="text" value={formData.phoneNumber} onChange={e => updateField('phoneNumber', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-blue-100 bg-white text-sm font-bold shadow-sm" />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] border-b border-blue-100 pb-2">DATOS SOCIOECONÓMICOS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">¿Es Madre Cabeza de Hogar?</label>
                <select value={formData.esMadreCabezaHogar} onChange={e => updateField('esMadreCabezaHogar', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold">
                  <option value="No">No</option>
                  <option value="Si">Si</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Estado Civil</label>
                <select value={formData.estadoCivil} onChange={e => updateField('estadoCivil', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold">
                  <option>Soltero(a)</option>
                  <option>Casado(a)</option>
                  <option>Unión Libre</option>
                  <option>Divorciado(a)</option>
                  <option>Viudo(a)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nivel de Estudios</label>
                <input type="text" placeholder="Ej: Bachiller, Profesional..." value={formData.nivelEstudios} onChange={e => updateField('nivelEstudios', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Ocupación Actual</label>
                <input type="text" value={formData.ocupacion} onChange={e => updateField('ocupacion', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Número de Hijos</label>
                <input type="number" value={formData.numeroHijos} onChange={e => updateField('numeroHijos', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Personas a Cargo</label>
                <input type="number" value={formData.personasACargo} onChange={e => updateField('personasACargo', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Tipo de Vivienda</label>
                <select value={formData.tipoVivienda} onChange={e => updateField('tipoVivienda', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold">
                  <option>Propia</option>
                  <option>Arrendada</option>
                  <option>Familiar</option>
                  <option>Compartida</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Zona de Residencia</label>
                <select value={formData.zonaVivienda} onChange={e => updateField('zonaVivienda', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold">
                  <option>Urbana</option>
                  <option>Rural</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] border-b border-blue-100 pb-2">CONFORMACIÓN GRUPO FAMILIAR</h3>
            
            <div className="bg-white p-5 rounded-3xl border-2 border-slate-100 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Parentesco</label>
                  <select 
                    value={tempMember.parentesco}
                    onChange={e => setTempMember({...tempMember, parentesco: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold"
                  >
                    <option>Padre</option>
                    <option>Madre</option>
                    <option>Hijo</option>
                    <option>Cónyuge</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Género</label>
                  <select 
                    value={tempMember.genero}
                    onChange={e => setTempMember({...tempMember, genero: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold"
                  >
                    <option>Femenino</option>
                    <option>Masculino</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Edad</label>
                  <input 
                    type="number"
                    value={tempMember.edad}
                    onChange={e => setTempMember({...tempMember, edad: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold"
                  />
                </div>
              </div>
              <button 
                onClick={addFamilyMember}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md hover:bg-blue-700 transition-all active:scale-95"
              >
                Insertar Registro
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex-1">Parentesco</div>
                <div className="flex-1">Género</div>
                <div className="w-16">Edad</div>
                <div className="w-8"></div>
              </div>
              {formData.grupoFamiliar.length === 0 ? (
                <div className="text-center py-8 text-slate-300 font-bold text-xs uppercase italic">No hay familiares registrados</div>
              ) : (
                formData.grupoFamiliar.map((member, idx) => (
                  <div key={idx} className="flex items-center px-4 py-3 bg-white rounded-xl border border-slate-100 shadow-sm animate-fadeIn">
                    <div className="flex-1 text-xs font-bold text-slate-700">{member.parentesco}</div>
                    <div className="flex-1 text-xs font-bold text-slate-700">{member.genero}</div>
                    <div className="w-16 text-xs font-black text-blue-600">{member.edad} años</div>
                    <button 
                      onClick={() => removeFamilyMember(idx)}
                      className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] border-b border-blue-100 pb-2">SALUD, PENSIONES Y OTROS DATOS</h3>
            
            {/* Subgrupo: Salud y Pensiones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">EPS Actual</label>
                <input type="text" value={formData.eps} onChange={e => updateField('eps', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold focus:border-blue-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Régimen Salud</label>
                <select value={formData.regimenSalud} onChange={e => updateField('regimenSalud', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold">
                  <option>Contributivo</option>
                  <option>Subsidiado</option>
                  <option>Especial</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Cotiza Pensión</label>
                <select value={formData.cotizaPension} onChange={e => updateField('cotizaPension', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold">
                  <option value="No">No</option>
                  <option value="Si">Si</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Discapacidad</label>
                <select value={formData.discapacidad} onChange={e => updateField('discapacidad', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold">
                  <option value="No">No</option>
                  <option value="Si">Si</option>
                </select>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Caja de Compensación</label>
                <input type="text" value={formData.cajaCompensacion} onChange={e => updateField('cajaCompensacion', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold focus:border-blue-500 outline-none" />
              </div>
            </div>

            {/* Subgrupo: Otros Datos */}
            <div className="pt-4 space-y-4">
              <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-l-4 border-indigo-200 pl-3">Otros datos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Estudios realizados</label>
                  <input type="text" value={formData.estudiosRealizados} onChange={e => updateField('estudiosRealizados', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold focus:border-blue-500 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Profesión</label>
                  <input type="text" value={formData.profesion} onChange={e => updateField('profesion', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold focus:border-blue-500 outline-none" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Población Vulnerable</label>
                  <input type="text" value={formData.poblacionVulnerable} onChange={e => updateField('poblacionVulnerable', e.target.value)} className="w-full p-3.5 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold focus:border-blue-500 outline-none" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm">
              <input type="checkbox" checked={formData.autorizaTratamiento} onChange={e => updateField('autorizaTratamiento', e.target.checked)} className="w-5 h-5 accent-blue-600 rounded" />
              <label className="text-[10px] font-black text-slate-600 uppercase leading-none">Autorizo tratamiento de datos personales</label>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Observaciones</label>
              <textarea rows={3} value={formData.observaciones} onChange={e => updateField('observaciones', e.target.value)} className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-white text-sm font-bold"></textarea>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mt-8">
        <button onClick={handlePrev} className="px-4 py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-slate-50 transition-all">ANTERIOR</button>
        <button onClick={handleSave} disabled={isSaving} className="px-4 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-lg shadow-emerald-100 active:scale-95 transition-all">{isSaving ? '...' : 'GUARDAR'}</button>
        {currentStep < 5 ? (
          <button onClick={handleNext} className="px-4 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-lg shadow-blue-100 active:scale-95 transition-all">SIGUIENTE</button>
        ) : (
          <button onClick={async () => { await handleSave(); onComplete(); }} className="px-4 py-4 bg-indigo-700 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-lg shadow-indigo-100 active:scale-95 transition-all">FINALIZAR</button>
        )}
      </div>
    </div>
  );
};

export default FormStepperView;
