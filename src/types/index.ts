export interface Leader {
  id: string;
  name: string;
  municipio: string;
  empresaAsociacion: string;
  celular: string;
  cedula: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Voter {
  id: string;
  leaderId: string;
  municipio: string;
  barrio: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  email: string;
  celular: string;
  fechaNacimiento: string;
  funcionCargo: string;
  profesion: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeaderInput {
  name: string;
  municipio: string;
  empresaAsociacion: string;
  celular: string;
  cedula: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
}

export interface UpdateLeaderInput {
  name?: string;
  municipio?: string;
  empresaAsociacion?: string;
  celular?: string;
  cedula?: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
}

export interface CreateVoterInput {
  leaderId: string;
  municipio: string;
  barrio: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  email: string;
  celular: string;
  fechaNacimiento: string;
  funcionCargo: string;
  profesion: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
}

export interface UpdateVoterInput {
  municipio?: string;
  barrio?: string;
  nombres?: string;
  apellidos?: string;
  cedula?: string;
  email?: string;
  celular?: string;
  fechaNacimiento?: string;
  funcionCargo?: string;
  profesion?: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
}

export interface TwoFactorCode {
  code: string;
  expiresAt: Date;
  verified: boolean;
}

export interface DeepLinkResponse {
  leaderId: string;
  deepLink: string;
  webFallback: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

