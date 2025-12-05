import { Leader, Voter, CreateLeaderInput, CreateVoterInput } from '@/types';

// Datos de ejemplo para generar nombres realistas
const nombres = [
  'Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Laura', 'Pedro', 'Carmen',
  'José', 'Sofía', 'Miguel', 'Isabel', 'Fernando', 'Patricia', 'Roberto', 'Andrea',
  'Daniel', 'Monica', 'Andrés', 'Diana', 'Ricardo', 'Claudia', 'Jorge', 'Gloria',
  'Alejandro', 'Martha', 'Francisco', 'Lucía', 'Manuel', 'Elena', 'Diego', 'Paola'
];

const apellidos = [
  'García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez',
  'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Álvarez',
  'Muñoz', 'Romero', 'Alonso', 'Gutiérrez', 'Navarro', 'Torres', 'Domínguez', 'Vázquez',
  'Ramos', 'Gil', 'Ramírez', 'Serrano', 'Blanco', 'Suárez', 'Molina', 'Morales'
];

const municipios = [
  'Medellín', 'Bogotá', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira',
  'Santa Marta', 'Manizales', 'Armenia', 'Pasto', 'Ibagué', 'Villavicencio', 'Montería',
  'Valledupar', 'Sincelejo', 'Popayán', 'Tunja', 'Riohacha', 'Quibdó'
];

const barrios = [
  'El Poblado', 'Laureles', 'Envigado', 'Sabaneta', 'Itagüí', 'Bello', 'Copacabana',
  'Girardota', 'Barbosa', 'Guarne', 'Rionegro', 'La Estrella', 'Caldas', 'La Ceja',
  'El Retiro', 'San Jerónimo', 'Angostura', 'Sopetrán', 'San Vicente', 'Concepción'
];

const empresas = [
  'Asociación de Vecinos', 'Comité Cívico', 'Junta de Acción Comunal', 'Fundación Social',
  'Cooperativa de Trabajo', 'Asociación de Comerciantes', 'Grupo de Liderazgo', 'Movimiento Ciudadano',
  'Alianza Comunitaria', 'Red de Líderes', 'Organización Social', 'Colectivo de Barrio'
];

const profesiones = [
  'Ingeniero', 'Médico', 'Abogado', 'Contador', 'Profesor', 'Comerciante', 'Empresario',
  'Arquitecto', 'Enfermero', 'Psicólogo', 'Administrador', 'Técnico', 'Trabajador Social',
  'Periodista', 'Diseñador', 'Arquitecto', 'Economista', 'Veterinario', 'Farmacéutico', 'Odontólogo'
];

const funciones = [
  'Coordinador', 'Director', 'Líder Comunitario', 'Representante', 'Vocero', 'Secretario',
  'Tesorero', 'Vicepresidente', 'Asesor', 'Gestor', 'Promotor', 'Facilitador', 'Mediador'
];

/**
 * Genera un número de cédula aleatorio
 */
const generateCedula = (): string => {
  return Math.floor(1000000 + Math.random() * 90000000).toString();
};

/**
 * Genera un número de celular aleatorio (3XXXXXXXXX)
 */
const generateCelular = (): string => {
  return '3' + Math.floor(100000000 + Math.random() * 900000000).toString();
};

/**
 * Genera un email aleatorio
 */
const generateEmail = (nombres: string, apellidos: string): string => {
  const nombreLower = nombres.toLowerCase().replace(/\s/g, '');
  const apellidoLower = apellidos.toLowerCase().replace(/\s/g, '');
  const random = Math.floor(Math.random() * 1000);
  return `${nombreLower}.${apellidoLower}${random}@example.com`;
};

/**
 * Genera una fecha de nacimiento aleatoria (entre 18 y 80 años)
 */
const generateFechaNacimiento = (): string => {
  const hoy = new Date();
  const edadMin = 18;
  const edadMax = 80;
  const añoNacimiento = hoy.getFullYear() - (edadMin + Math.floor(Math.random() * (edadMax - edadMin)));
  const mes = Math.floor(Math.random() * 12) + 1;
  const dia = Math.floor(Math.random() * 28) + 1;
  return `${añoNacimiento}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
};

/**
 * Selecciona un elemento aleatorio de un array
 */
const randomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Genera datos de prueba para un líder
 */
export const generateLeader = (): CreateLeaderInput => {
  const nombre = randomItem(nombres);
  const apellido = randomItem(apellidos);
  const nombreCompleto = `${nombre} ${apellido}`;
  
  return {
    name: nombreCompleto,
    municipio: randomItem(municipios),
    empresaAsociacion: randomItem(empresas),
    celular: generateCelular(),
    cedula: generateCedula(),
  };
};

/**
 * Genera datos de prueba para un votante
 */
export const generateVoter = (leaderId: string): CreateVoterInput => {
  const nombresVoter = randomItem(nombres);
  const apellidosVoter = randomItem(apellidos);
  
  return {
    leaderId,
    municipio: randomItem(municipios),
    barrio: randomItem(barrios),
    nombres: nombresVoter,
    apellidos: apellidosVoter,
    cedula: generateCedula(),
    email: generateEmail(nombresVoter, apellidosVoter),
    celular: generateCelular(),
    fechaNacimiento: generateFechaNacimiento(),
    funcionCargo: randomItem(funciones),
    profesion: randomItem(profesiones),
  };
};

/**
 * Genera múltiples líderes
 */
export const generateLeaders = (count: number): CreateLeaderInput[] => {
  return Array.from({ length: count }, () => generateLeader());
};

/**
 * Genera múltiples votantes para un líder
 */
export const generateVoters = (leaderId: string, count: number): CreateVoterInput[] => {
  return Array.from({ length: count }, () => generateVoter(leaderId));
};

