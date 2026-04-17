require('dotenv').config();
const initDatabase = require('./init');
const queries = require('./queries');

const escuelas = [
  {
    nombre: "Francisco Rojas González", plantel: "Francisco Rojas González",
    municipio: "Arandas", direccion: "Desconocido, Llano Grande, CP 47198",
    ubicacion: "https://maps.app.goo.gl/jyZ4fChtbgVMrBZH8", cct: "14EPR1614C",
    personal_escolar: 6, estudiantes: 119, nivelEducativo: "Primaria",
    modalidad: "SEP-Multigrado", turno: "Matutino", sostenimiento: "Estatal",
    categoria: ["infraestructura", "material", "formacion"],
  },
  {
    nombre: "Los Aguirre", plantel: "Los Aguirre",
    municipio: "San Juan de los Lagos", direccion: "Los Aguirres de arriba, s/n, 47000",
    ubicacion: "https://maps.app.goo.gl/XvZzMtZRRCjrUJv27", cct: "14KTV0408X",
    personal_escolar: 1, estudiantes: 24, nivelEducativo: "Secundaria",
    modalidad: "CONAFE", turno: "Matutino", sostenimiento: "Federal",
    categoria: ["infraestructura", "material", "formacion", "salud"],
  },
  {
    nombre: "Miguel Hidalgo y Costilla", plantel: "Miguel Hidalgo y Costilla",
    municipio: "San Juan de los Lagos", direccion: "Santa Cecilia, 47013 San Juan de los Lagos, Jal.",
    ubicacion: "https://goo.gl/maps/qLgcz1XDMbQyCdez6", cct: "14DPR1702Y",
    personal_escolar: 15, estudiantes: 314, nivelEducativo: "Primaria",
    modalidad: "SEP-General", turno: "Matutino", sostenimiento: "Federal",
    categoria: ["material", "formacion", "salud"],
  },
  {
    nombre: "Antonio de Caso Peralta", plantel: "Antonio de Caso Peralta",
    municipio: "San Pedro Tlaquepaque", direccion: "Sin número, Nueva Santa María, San Pedro Tlaquepaque",
    ubicacion: "https://www.google.com/maps?q=20.6061277,-103.3763599", cct: "14DPR3313V",
    personal_escolar: 16, estudiantes: 289, nivelEducativo: "Primaria",
    modalidad: "SEP-General", turno: "Vespertino", sostenimiento: "Federal",
    categoria: ["material", "formacion"],
  },
  {
    nombre: "Lázaro Cárdenas", plantel: "Lázaro Cárdenas",
    municipio: "San Pedro Tlaquepaque", direccion: "Lázaro Cárdenas #28, Los Santibáñez, 45620 San Pedro Tlaquepaque, Jal.",
    ubicacion: "https://maps.app.goo.gl/4Uj3m6i4abEhs7L2A", cct: "14EPR1467J",
    personal_escolar: 12, estudiantes: 350, nivelEducativo: "Primaria",
    modalidad: "SEP-General", turno: "Matutino", sostenimiento: "Federal",
    categoria: ["formacion", "material"],
  },
  {
    nombre: "Urbana 1098", plantel: "Urbana 1097",
    municipio: "Arandas", direccion: "Miguel Hidalgo #203, Emiliano Zapata, 45638 San Pedro Tlaquepaque, Jal.",
    ubicacion: "https://goo.gl/maps/9tLJL1qJMeAjXjsx9", cct: "14EPR0145U",
    personal_escolar: 16, estudiantes: 398, nivelEducativo: "Primaria",
    modalidad: "SEP-General", turno: "Matutino", sostenimiento: "Estatal",
    categoria: ["material", "formacion"],
  },
  {
    nombre: "Carlos de Icaza", plantel: "Las Cuevas",
    municipio: "Zapopan", direccion: "Camino a las Cuevas, Sin número, Resplandor del Rayo, Zapopan",
    ubicacion: "https://maps.app.goo.gl/KSKzkvKDpLMo5eRi9?g_st=iw", cct: "14DPR4183Z",
    personal_escolar: 2, estudiantes: 31, nivelEducativo: "Primaria",
    modalidad: "SEP-Multigrado", turno: "Matutino", sostenimiento: "Federal",
    categoria: ["infraestructura", "material", "formacion", "salud"],
  },
  {
    nombre: "Preescolar Comunitario Cuevas", plantel: "Las Cuevas",
    municipio: "Zapopan", direccion: "Camino a las Cuevas, Sin número, Resplandor del Rayo, Zapopan",
    ubicacion: "https://maps.app.goo.gl/KSKzkvKDpLMo5eRi9?g_st=iw", cct: "14KJN2189Z",
    personal_escolar: 1, estudiantes: 8, nivelEducativo: "Preescolar",
    modalidad: "CONAFE", turno: "Matutino", sostenimiento: "Federal",
    categoria: [],
  },
  {
    nombre: "Secundaria Comunitaria Cuevas", plantel: "Las Cuevas",
    municipio: "Zapopan", direccion: "Camino a las Cuevas, Sin número, Resplandor del Rayo, Zapopan",
    ubicacion: "https://maps.app.goo.gl/KSKzkvKDpLMo5eRi9?g_st=iw", cct: "14KTV0274Y",
    personal_escolar: 1, estudiantes: 20, nivelEducativo: "Secundaria",
    modalidad: "CONAFE", turno: "Matutino", sostenimiento: "Federal",
    categoria: [],
  },
  {
    nombre: "Justo Sierra", plantel: "Justo Sierra",
    municipio: "Zapopan", direccion: "Agustín Melgar 1509, prados Santa Lucia, Zapopan, Jalisco",
    ubicacion: "https://maps.app.goo.gl/LnystBsvg6Y16AuY6", cct: "14DPR0060O",
    personal_escolar: 21, estudiantes: 558, nivelEducativo: "Primaria",
    modalidad: "SEP-General", turno: "Matutino", sostenimiento: "Federalizado",
    categoria: ["infraestructura", "material", "formacion", "salud"],
  },
  {
    nombre: "Las Mesitas (P) Guadalupe Victoria", plantel: "Las Mesitas",
    municipio: "Zapopan", direccion: "Paseo de las Galeanas, s/n, Las Mesitas, 45200",
    ubicacion: "https://maps.app.goo.gl/aEP6ysbRdDveaXGY8", cct: "14KJN1164J",
    personal_escolar: 2, estudiantes: 19, nivelEducativo: "Preescolar",
    modalidad: "CONAFE", turno: "Matutino", sostenimiento: "Federal",
    categoria: ["infraestructura", "material", "formacion", "salud"],
  },
  {
    nombre: "Las Mesitas (S) Guadalupe Victoria", plantel: "Las Mesitas",
    municipio: "Zapopan", direccion: "Paseo de las Galeanas, s/n, Las Mesitas, 45200",
    ubicacion: "https://maps.app.goo.gl/aEP6ysbRdDveaXGY8", cct: "14KTVO382F",
    personal_escolar: 2, estudiantes: 25, nivelEducativo: "Preescolar",
    modalidad: "CONAFE", turno: "Matutino", sostenimiento: "Federal",
    categoria: ["infraestructura", "material", "formacion", "salud"],
  },
  {
    nombre: "La Reserva (Pre)", plantel: "La Reserva",
    municipio: "Zapopan", direccion: "Sin nombre conocido, Santa Lucía, 45200",
    ubicacion: "https://maps.app.goo.gl/fT1CgLiiCS7ZUcU27", cct: "14KPR1665U",
    personal_escolar: 1, estudiantes: 9, nivelEducativo: "Preescolar",
    modalidad: "CONAFE", turno: "Matutino", sostenimiento: "Federal",
    categoria: ["infraestructura", "material", "formacion", "salud"],
  },
  {
    nombre: "La Reserva (Pri)", plantel: "La Reserva",
    municipio: "Zapopan", direccion: "Sin nombre conocido, Santa Lucía, 45200",
    ubicacion: "https://maps.app.goo.gl/fT1CgLiiCS7ZUcU27", cct: "14KPR1665U",
    personal_escolar: 1, estudiantes: 8, nivelEducativo: "Primaria",
    modalidad: "CONAFE", turno: "Matutino", sostenimiento: "Federal",
    categoria: ["infraestructura", "material", "formacion", "salud"],
  },
  {
    nombre: "Manuel M Cerna", plantel: "Manuel M Cerna",
    municipio: "Zapopan", direccion: "San Antonio, Sin número, Ex Hacienda del Lazo, CP 45205",
    ubicacion: "https://maps.app.goo.gl/aEP6ysbRdDveaXGY8?g_st=am", cct: "14DPR1588W",
    personal_escolar: 2, estudiantes: 44, nivelEducativo: "Primaria",
    modalidad: "SEP-Multigrado", turno: "Matutino", sostenimiento: "Federal",
    categoria: ["infraestructura", "material", "formacion", "salud"],
  },
  {
    nombre: "Margarita Maza de Juárez", plantel: "Margarita Maza de Juárez",
    municipio: "Zapopan", direccion: "C. Felipe Ángeles, 45205 San Esteban, Jal.",
    ubicacion: "https://maps.app.goo.gl/zhipcjRnsZm4bkAc8", cct: "14DPR2324U",
    personal_escolar: 15, estudiantes: 444, nivelEducativo: "Primaria",
    modalidad: "SEP-General", turno: "Matutino", sostenimiento: "Federal",
    categoria: ["infraestructura", "material"],
  },
];

const dbConfig = {
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'mi_escuela_primero',
  port:     parseInt(process.env.DB_PORT) || 3306,
};

async function seed() {
  await initDatabase(dbConfig);

  console.log('Insertando escuelas...');
  let ok = 0;
  for (const escuela of escuelas) {
    try {
      await queries.createEscuela(escuela);
      console.log(`  ✓ ${escuela.nombre}`);
      ok++;
    } catch (err) {
      console.error(`  ✗ ${escuela.nombre}: ${err.message}`);
    }
  }
  console.log(`\nListo: ${ok}/${escuelas.length} escuelas insertadas.`);
  process.exit(0);
}

seed().catch(err => {
  console.error('Error en seed:', err.message);
  process.exit(1);
});
