
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface FamilyMember {
  parentesco: string;
  genero: string;
  edad: string;
}

export interface FichaData {
  // Campos base raíz
  documentNumber: string;
  documentType: string;
  countryCode: string;
  estado: string;
  createdAt?: string;
  createdBy?: string;
  fecha_actualizacion?: string;
  fichaId?: string;
  phoneNumber: string;

  // Grupo 1: Personal
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  edad: string;
  nacionalidad: string;

  // Grupo 2: Ubicación
  direccion: string;
  barrio: string;
  municipio: string;
  departamento: string;
  estrato: string;
  telefonoFijo: string;
  emailPersonal: string;

  // Grupo 3: Socioeconomico
  esMadreCabezaHogar: string;
  estadoCivil: string;
  nivelEstudios: string;
  numeroHijos: string;
  ocupacion: string;
  personasACargo: string;
  tipoVivienda: string;
  zonaVivienda: string;
  recibeBeneficio: string;
  cualBeneficio: string;

  // Grupo Familiar
  grupoFamiliar: FamilyMember[];

  // Grupo 4: Seguridad Social
  afiliadoSalud: string;
  condicionMedica: string;
  cotizaPension: string;
  cualCondicion: string;
  discapacidad: string;
  eps: string;
  fondoPension: string;
  regimenSalud: string;
  tipoDiscapacidad: string;
  cajaCompensacion: string;

  // Grupo 5: Adicional
  autorizaTratamiento: boolean;
  observaciones: string;
  poblacionVulnerable: string;
  estudiosRealizados: string;
  profesion: string;
}

export enum Step {
  LOGIN,
  DASHBOARD,
  SECURITY_CHECK,
  SEARCH_ID,
  FORM_STEPPER,
  VIEW_SUMMARY
}
