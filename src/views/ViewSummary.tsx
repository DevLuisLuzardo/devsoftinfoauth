
import React, { useState } from 'react';
import { FichaData } from '../types';

interface Props {
  ficha: FichaData;
  onBack: () => void;
  onEdit: () => void;
}

declare var html2pdf: any;

const ViewSummary: React.FC<Props> = ({ ficha, onBack, onEdit }) => {
  const [isPreparing, setIsPreparing] = useState(false);

  const handleExportPDF = async () => {
    setIsPreparing(true);
    setTimeout(async () => {
      const element = document.getElementById('pdf-report');
      if (!element) return;
      
      const opt = {
        margin: [15, 20, 15, 20], // Margen: 2cm laterales
        filename: `Ficha_FMC_${ficha.documentNumber}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
          scale: 3, 
          useCORS: true, 
          letterRendering: true, 
          logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };
      
      try {
        await html2pdf().set(opt).from(element).save();
      } catch (error) {
        window.print();
      } finally {
        setIsPreparing(false);
      }
    }, 800);
  };

  const displayVal = (val: any) => {
    if (val === undefined || val === null || val === '' || val === false) return '---';
    if (val === true) return 'SÍ / AUTORIZADO';
    return val;
  };

  // Estilos solicitados: Label en negrita 9px, Datos en normal 12px
  const labelStyle = "text-[9px] text-slate-400 uppercase mb-1 tracking-widest font-black";
  const dataStyle = "text-[12px] font-normal text-slate-900 leading-none"; 
  const sectionGrid = "grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4";

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col animate-fadeIn relative pb-32">
      {/* Barra de Acciones Superior (Pantalla) */}
      <div className="p-6 md:p-8 bg-white border-b border-slate-200 no-print sticky top-0 z-30 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none uppercase">Visor de Ficha Oficial</h1>
          <p className="text-[10px] font-bold text-blue-600 mt-1 font-mono uppercase tracking-widest">Postulante: {ficha.documentNumber}</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={handleExportPDF} className="flex-grow md:flex-initial bg-blue-700 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-blue-800 transition-all">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"></path></svg>
            DESCARGAR PDF
          </button>
          <button onClick={onBack} className="bg-slate-100 text-slate-500 p-3.5 rounded-2xl hover:bg-slate-200 transition-all border border-slate-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      {/* Contenedor del Reporte PDF */}
      <div className="p-4 md:p-12 overflow-x-auto">
        <div id="pdf-report" className="bg-white text-slate-900 w-full mx-auto shadow-2xl overflow-hidden rounded-sm" style={{ minWidth: '210mm' }}>
           
           {/* Encabezado del Informe */}
           <div className="p-10 border-b-8 border-slate-900 flex justify-between items-center bg-slate-50">
            <div className="flex gap-5 items-center">
              <div className="bg-slate-900 p-3 rounded-2xl text-white">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight uppercase tracking-tighter">Fundación Misión Colombia</h2>
                <p className="text-[10px] font-bold text-slate-400 tracking-[0.4em] uppercase mt-1">Proyecto PEAIMCF - Ficha de Registro Unificado</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[12px] font-black text-slate-900 uppercase">ID FICHA: {ficha.fichaId || 'PENDIENTE'}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Estado: {ficha.estado}</p>
            </div>
          </div>

          <div className="p-10 space-y-12">
            {/* GRUPO 1: Identificación */}
            <section className="space-y-4">
              <div className="border-b-2 border-slate-100 pb-1">
                <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">01. Identificación</h3>
              </div>
              <div className={sectionGrid}>
                <div className="col-span-2"><p className={labelStyle}>Nombres</p><div className={dataStyle}>{displayVal(ficha.nombre)}</div></div>
                <div className="col-span-2"><p className={labelStyle}>Apellidos</p><div className={dataStyle}>{displayVal(ficha.apellidos)}</div></div>
                <div><p className={labelStyle}>Documento</p><div className={dataStyle}>{displayVal(ficha.documentNumber)}</div></div>
                <div><p className={labelStyle}>Tipo Doc.</p><div className={dataStyle}>{displayVal(ficha.documentType)}</div></div>
                <div><p className={labelStyle}>Nacionalidad</p><div className={dataStyle}>{displayVal(ficha.nacionalidad)}</div></div>
                <div><p className={labelStyle}>Edad</p><div className={dataStyle}>{displayVal(ficha.edad)} años</div></div>
              </div>
            </section>

            {/* GRUPO 2: Ubicación y Contacto */}
            <section className="space-y-4">
              <div className="border-b-2 border-slate-100 pb-1">
                <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">02. Ubicación y Contacto</h3>
              </div>
              <div className={sectionGrid}>
                <div className="col-span-2"><p className={labelStyle}>Dirección</p><div className={dataStyle}>{displayVal(ficha.direccion)}</div></div>
                <div><p className={labelStyle}>Barrio</p><div className={dataStyle}>{displayVal(ficha.barrio)}</div></div>
                <div><p className={labelStyle}>Municipio</p><div className={dataStyle}>{displayVal(ficha.municipio)}</div></div>
                <div><p className={labelStyle}>Departamento</p><div className={dataStyle}>{displayVal(ficha.departamento)}</div></div>
                <div><p className={labelStyle}>Estrato</p><div className={dataStyle}>{displayVal(ficha.estrato)}</div></div>
                <div><p className={labelStyle}>Celular</p><div className={dataStyle}>{displayVal(ficha.phoneNumber)}</div></div>
                <div><p className={labelStyle}>Email</p><div className={dataStyle}>{displayVal(ficha.emailPersonal)}</div></div>
              </div>
            </section>

            {/* GRUPO 3: Perfil Socioeconómico */}
            <section className="space-y-4">
              <div className="border-b-2 border-slate-100 pb-1">
                <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">03. Perfil Socioeconómico</h3>
              </div>
              <div className={sectionGrid}>
                <div><p className={labelStyle}>Madre Cabeza Hogar</p><div className={dataStyle}>{displayVal(ficha.esMadreCabezaHogar)}</div></div>
                <div><p className={labelStyle}>Estado Civil</p><div className={dataStyle}>{displayVal(ficha.estadoCivil)}</div></div>
                <div><p className={labelStyle}>Nivel Estudios</p><div className={dataStyle}>{displayVal(ficha.nivelEstudios)}</div></div>
                <div><p className={labelStyle}>Ocupación</p><div className={dataStyle}>{displayVal(ficha.ocupacion)}</div></div>
                <div><p className={labelStyle}>Número Hijos</p><div className={dataStyle}>{displayVal(ficha.numeroHijos)}</div></div>
                <div><p className={labelStyle}>Personas Cargo</p><div className={dataStyle}>{displayVal(ficha.personasACargo)}</div></div>
                <div><p className={labelStyle}>Tipo Vivienda</p><div className={dataStyle}>{displayVal(ficha.tipoVivienda)}</div></div>
                <div><p className={labelStyle}>Zona Residencia</p><div className={dataStyle}>{displayVal(ficha.zonaVivienda)}</div></div>
              </div>
            </section>

            {/* GRUPO 4: Salud y Seguridad Social */}
            <section className="space-y-4">
              <div className="border-b-2 border-slate-100 pb-1">
                <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">04. Seguridad Social y Salud</h3>
              </div>
              <div className={sectionGrid}>
                <div className="col-span-2"><p className={labelStyle}>EPS Actual</p><div className={dataStyle}>{displayVal(ficha.eps)}</div></div>
                <div><p className={labelStyle}>Régimen</p><div className={dataStyle}>{displayVal(ficha.regimenSalud)}</div></div>
                <div><p className={labelStyle}>Cotiza Pensión</p><div className={dataStyle}>{displayVal(ficha.cotizaPension)}</div></div>
                <div><p className={labelStyle}>Posee Discapacidad</p><div className={dataStyle}>{displayVal(ficha.discapacidad)}</div></div>
                <div className="col-span-2"><p className={labelStyle}>Caja de Compensación</p><div className={dataStyle}>{displayVal(ficha.cajaCompensacion)}</div></div>
              </div>
            </section>

            {/* GRUPO 5: Otros Datos y Observaciones */}
            <section className="space-y-4">
              <div className="border-b-2 border-slate-100 pb-1">
                <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">05. Datos Complementarios</h3>
              </div>
              <div className={sectionGrid}>
                <div className="col-span-2"><p className={labelStyle}>Estudios Realizados</p><div className={dataStyle}>{displayVal(ficha.estudiosRealizados)}</div></div>
                <div className="col-span-2"><p className={labelStyle}>Profesión u Oficio</p><div className={dataStyle}>{displayVal(ficha.profesion)}</div></div>
                <div className="col-span-4"><p className={labelStyle}>Población Vulnerable</p><div className={dataStyle}>{displayVal(ficha.poblacionVulnerable)}</div></div>
              </div>
              <div className="mt-4">
                <p className={labelStyle}>Observaciones Generales</p>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-[12px] font-normal text-slate-700 leading-relaxed italic">
                  {displayVal(ficha.observaciones)}
                </div>
              </div>
            </section>

            {/* GRUPO 6: Conformación Grupo Familiar */}
            <section className="space-y-4">
              <div className="border-b-2 border-slate-100 pb-1">
                <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">06. Grupo Familiar</h3>
              </div>
              {ficha.grupoFamiliar && ficha.grupoFamiliar.length > 0 ? (
                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-900 text-white">
                      <tr>
                        <th className="py-2 px-4 text-[9px] font-black uppercase">Parentesco</th>
                        <th className="py-2 px-4 text-[9px] font-black uppercase">Género</th>
                        <th className="py-2 px-4 text-[9px] font-black uppercase text-right">Edad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ficha.grupoFamiliar.map((m, i) => (
                        <tr key={i} className="border-b border-slate-50">
                          <td className="py-2 px-4 text-[11px] font-normal text-slate-700">{m.parentesco}</td>
                          <td className="py-2 px-4 text-[11px] font-normal text-slate-700">{m.genero}</td>
                          <td className="py-2 px-4 text-[11px] font-normal text-slate-700 text-right">{m.edad} años</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[11px] italic text-slate-400">Sin registros adicionales en el grupo familiar.</p>
              )}
            </section>

            {/* Área de Firmas */}
            <div className="mt-40 pt-20 grid grid-cols-2 gap-40 px-10">
              <div className="text-center border-t border-slate-300 pt-2">
                <p className="text-[10px] font-black uppercase text-slate-800 tracking-widest">Firma Postulante</p>
                <p className="text-[9px] text-slate-400 font-mono mt-1">CC: {ficha.documentNumber}</p>
              </div>
              <div className="text-center border-t border-slate-300 pt-2">
                <p className="text-[10px] font-black uppercase text-slate-800 tracking-widest">Responsable FMC</p>
                <p className="text-[9px] text-slate-400 font-mono mt-1">ID: {ficha.createdBy}</p>
              </div>
            </div>
          </div>
          
          <div className="p-8 bg-slate-900 text-white text-[9px] text-center font-bold tracking-[0.4em] uppercase">
            Sistema de Información PEAIMCF - Fundación Misión Colombia
          </div>
        </div>
      </div>

      {/* Botones de Navegación Inferiores (Pantalla) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-6 z-40 no-print flex justify-center shadow-2xl">
        <div className="max-w-xl w-full flex gap-4">
          <button onClick={onBack} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-slate-200">Panel Principal</button>
          <button onClick={onEdit} className="flex-[1.5] bg-blue-700 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 transition-all hover:bg-blue-800">Modificar Registro</button>
        </div>
      </div>
    </div>
  );
};

export default ViewSummary;
