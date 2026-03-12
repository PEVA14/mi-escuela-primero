const escuelas = [
  {
    id_escuela: 1,
    nombre: "Francisco Rojas González",
    plantel: "Francisco Rojas González",
    municipio: "Arandas",
    direccion: "Desconocido, Llano Grande, CP 47198",
    ubicacion: "https://maps.app.goo.gl/jyZ4fChtbgVMrBZH8",
    cct: "14EPR1614C",
    personal_escolar: 6,
    estudiantes: 119,
    nivelEducativo: "Primaria",
    modalidad: "SEP-Multigrado",
    turno: "Matutino",
    sostenimiento: "Estatal",
    categoria: ["infraestructura","material","formacion"]
  },

  {
    id_escuela: 2,
    nombre: "Los Aguirre",
    plantel: "Los Aguirre",
    municipio: "San Juan de los Lagos",
    direccion: "Los Aguirres de arriba, s/n, 47000",
    ubicacion: "https://maps.app.goo.gl/XvZzMtZRRCjrUJv27",
    cct: "14KTV0408X",
    personal_escolar: 1,
    estudiantes: 24,
    nivelEducativo: "Secundaria",
    modalidad: "CONAFE",
    turno: "Matutino",
    sostenimiento: "Federal",
    categoria: ["infraestructura","material","formacion","salud"]
  },

  {
    id_escuela: 3,
    nombre: "Miguel Hidalgo y Costilla",
    plantel: "Miguel Hidalgo y Costilla",
    municipio: "San Juan de los Lagos",
    direccion: "Santa Cecilia, 47013 San Juan de los Lagos, Jal.",
    ubicacion: "https://goo.gl/maps/qLgcz1XDMbQyCdez6",
    cct: "14DPR1702Y",
    personal_escolar: 15,
    estudiantes: 314,
    nivelEducativo: "Primaria",
    modalidad: "SEP-General",
    turno: "Matutino",
    sostenimiento: "Federal",
    categoria: ["material","formacion", "salud"]
  },

  {
    id_escuela: 4,
    nombre: "Antonio de Caso Peralta",
    plantel: "Antonio de Caso Peralta",
    municipio: "San Pedro Tlaquepaque",
    direccion: "Sin número, Nueva Santa María, San Pedro Tlaquepaque",
    ubicacion: "https://www.google.com/maps?q=20.6061277,-103.3763599",
    cct: "14DPR3313V",
    personal_escolar: 16,
    estudiantes: 289,
    nivelEducativo: "Primaria",
    modalidad: "SEP-General",
    turno: "Vespertino",
    sostenimiento: "Federal",
    categoria: ["material","formacion"]
  },

  {
    id_escuela: 5,
    nombre: "Lázaro Cárdenas",
    plantel: "Lázaro Cárdenas",
    municipio: "San Pedro Tlaquepaque",
    direccion: "Lázaro Cárdenas #28, Los Santibáñez, 45620 San Pedro Tlaquepaque, Jal.",
    ubicacion: "https://maps.app.goo.gl/4Uj3m6i4abEhs7L2A",
    cct: "14EPR1467J",
    personal_escolar: 12,
    estudiantes: 350,
    nivelEducativo: "Primaria",
    modalidad: "SEP-General",
    turno: "Matutino",
    sostenimiento: "Federal",
    categoria: ["formacion","material"]
  },

  {
    id_escuela: 6,
    nombre: "Urbana 1098",
    plantel: "Urbana 1097",
    municipio: "Arandas",
    direccion: "Miguel Hidalgo #203, Emiliano Zapata, 45638 San Pedro Tlaquepaque, Jal.",
    ubicacion: "https://goo.gl/maps/9tLJL1qJMeAjXjsx9",
    cct: "14EPR0145U",
    personal_escolar: 16,
    estudiantes: 398,
    nivelEducativo: "Primaria",
    modalidad: "SEP-General",
    turno: "Matutino",
    sostenimiento: "Estatal",
    categoria: ["material","formacion"]
  },

  {
    id_escuela: 7,
    nombre: "Carlos de Icaza",
    plantel: "Las Cuevas",
    municipio: "Zapopan",
    direccion: "Camino a las Cuevas, Sin número, Resplandor del Rayo, Zapopan",
    ubicacion: "https://maps.app.goo.gl/KSKzkvKDpLMo5eRi9?g_st=iw",
    cct: "14DPR4183Z",
    personal_escolar: 2,
    estudiantes: 31,
    nivelEducativo: "Primaria",
    modalidad: "SEP-Multigrado",
    turno: "Matutino",
    sostenimiento: "Federal",
    categoria: ["infraestructura","material","formacion","salud"]
  },

  {
    id_escuela: 8,
    nombre: "Preescolar Comunitario Cuevas",
    plantel: "Las Cuevas",
    municipio: "Zapopan",
    direccion: "Camino a las Cuevas, Sin número, Resplandor del Rayo, Zapopan",
    ubicacion: "https://maps.app.goo.gl/KSKzkvKDpLMo5eRi9?g_st=iw",
    cct: "14KJN2189Z",
    personal_escolar: 1,
    estudiantes: 8,
    nivelEducativo: "Preescolar",
    modalidad: "CONAFE",
    turno: "Matutino",
    sostenimiento: "Federal",
    categoria: ["na"]
  },

  {
    id_escuela: 9,
    nombre: "Secundaria Comunitaria Cuevas",
    plantel: "Las Cuevas",
    municipio: "Zapopan",
    direccion: "Camino a las Cuevas, Sin número, Resplandor del Rayo, Zapopan",
    ubicacion: "https://maps.app.goo.gl/KSKzkvKDpLMo5eRi9?g_st=iw",
    cct: "14KTV0274Y",
    personal_escolar: 1,
    estudiantes: 20,
    nivelEducativo: "Secundaria",
    modalidad: "CONAFE",
    turno: "Matutino",
    sostenimiento: "Federal",
    categoria: ["na"]
  },

  {
    id_escuela: 10,
    nombre: "Justo Sierra",
    plantel: "Justo Sierra",
    municipio: "Zapopan",
    direccion: "Agustín Melgar 1509, prados Santa Lucia, Zapopan, Jalisco",
    ubicacion: "https://maps.app.goo.gl/LnystBsvg6Y16AuY6",
    cct: "14DPR0060O",
    personal_escolar: 21,
    estudiantes: 558,
    nivelEducativo: "Primaria",
    modalidad: "SEP-General",
    turno: "Matutino",
    sostenimiento: "Federalizado",
    categoria: ["infraestructura","material","formacion","salud"]
  },

  {
    id_escuela: 11,
    nombre: "Las Mesitas (P) Guadalupe Victoria",
    plantel: "Las Mesitas",
    municipio: "Zapopan",
    direccion: "Paseo de las Galeanas, s/n, Las Mesitas, 45200",
    ubicacion: "https://maps.app.goo.gl/aEP6ysbRdDveaXGY8",
    cct: "14KJN1164J",
    personal_escolar: 2,
    estudiantes: 19,
    nivelEducativo: "Preescolar",
    modalidad: "CONAFE",
    turno: "Matutino",
    sostenimiento: "Federal",
    categoria: ["infraestructura","material","formacion","salud"]
  },

  {
    id_escuela: 12,
    nombre: "Las Mesitas (S) Guadalupe Victoria",
    plantel: "Las Mesitas",
    municipio: "Zapopan",
    direccion: "Paseo de las Galeanas, s/n, Las Mesitas, 45200",
    ubicacion: "https://maps.app.goo.gl/aEP6ysbRdDveaXGY8",
    cct: "14KTVO382F",
    personal_escolar: 2,
    estudiantes: 25,
    nivelEducativo: "Preescolar",
    modalidad: "CONAFE",
    turno: "Matutino",
    sostenimiento: "Federal",
    categoria: ["infraestructura","material","formacion","salud"]
  },

  {
    id_escuela: 13,
    nombre: "La Reserva (Pre)",
    plantel: "La Reserva",
    municipio: "Zapopan",
    direccion: "Sin nombre conocido, Santa Lucía, 45200",
    ubicacion: "https://maps.app.goo.gl/fT1CgLiiCS7ZUcU27",
    cct: "14KPR1665U",
    personal_escolar: 1,
    estudiantes: 9,
    nivelEducativo: "Preescolar",
    modalidad: "CONAFE",
    turno: "Matutino",
    sostenimiento: "Federal",
    categoria: ["infraestructura","material","formacion","salud"]
  },

  {
    id_escuela: 14,
    nombre: "La Reserva (Pri)",
    plantel: "La Reserva",
    municipio: "Zapopan",
    direccion: "Sin nombre conocido, Santa Lucía, 45200",
    ubicacion: "https://maps.app.goo.gl/fT1CgLiiCS7ZUcU27",
    cct: "14KPR1665U",
    personal_escolar: 1,
    estudiantes: 8,
    nivelEducativo: "Primaria",
    modalidad: "CONAFE",
    turno: "Matutino",
    sostenimiento: "Federal",
    categoria: ["infraestructura","material","formacion","salud"]
  },

  {
    id_escuela: 15,
    nombre: "Manuel M Cerna",
    plantel: "Manuel M Cerna",
    municipio: "Zapopan",
    direccion: "San Antonio, Sin número, Ex Hacienda del Lazo, CP 45205",
    ubicacion: "https://maps.app.goo.gl/aEP6ysbRdDveaXGY8?g_st=am",
    cct: "14DPR1588W",
    personal_escolar: 2,
    estudiantes: 44,
    nivelEducativo: "Primaria",
    modalidad: "SEP-Multigrado",
    turno: "Matutino",
    sostenimiento: "Federal",
    categoria: ["infraestructura","material","formacion","salud"]
  },

  {
    id_escuela: 16,
    nombre: "Margarita Maza de Juárez",
    plantel: "Margarita Maza de Juárez",
    municipio: "Zapopan",
    direccion: "C. Felipe Ángeles, 45205 San Esteban, Jal.",
    ubicacion: "https://maps.app.goo.gl/zhipcjRnsZm4bkAc8",
    cct: "14DPR2324U",
    personal_escolar: 15,
    estudiantes: 444,
    nivelEducativo: "Primaria",
    modalidad: "SEP-General",
    turno: "Matutino",
    sostenimiento: "Federal",
    categoria: ["infraestructura","material"]
  }
]

export const propuestas = [

{
id_propuesta: 1,
id_escuela: 1,
categoria: "infraestructura",
subcategoria: "Contruccion materiales",
titulo: "Cubetas de pintura",
descripcion: "",
estado: "cubierto"
},

{
id_propuesta: 2,
id_escuela: 1,
categoria: "material",
subcategoria: "Pizarrones/Pintarrones",
titulo: "Pizarrones",
descripcion: "",
estado: "cubierto"
},

{
id_propuesta: 3,
id_escuela: 2,
categoria: "Salud",
subcategoria: "Salud fisica",
titulo: "Botiquien",
descripcion: "",
estado: "pendiente"
},

{
id_propuesta: 4,
id_escuela: 2,
categoria: "Formacion",
subcategoria: "Formacion para estudiantes",
titulo: "Estudiantes: manejo de emociones",
descripcion: "ormación para un grupo de estudiantes de secundaria (aprox. 25 alumnos)",
estado: "cubierto"
},

{
id_propuesta: 5,
id_escuela: 3,
categoria: "Formacion",
subcategoria: "Formación para estudiantes",
titulo: "Estudiantes: desarrollo de valores",
descripcion: "Instalación de estaciones de lavado de manos",
estado: "pendiente"
},

{
id_propuesta: 6,
id_escuela: 3,
categoria: "Salud",
subcategoria: "Salud material",
titulo: "Silla de ruedas/andadera",
descripcion: "Sustitución de pupitres dañados",
estado: "cubierto"
},

{
id_propuesta: 7,
id_escuela: 4,
categoria: "Material",
subcategoria: "Material tecnologico",
titulo: "Proyectores",
descripcion: "",
estado: "pendiente"
},

{
id_propuesta: 8,
id_escuela: 4,
categoria: "Formacion",
subcategoria: "Formación para estudiantes",
titulo: "Estudiantes: Convivencia escolar y valores",
descripcion: "",
estado: "cubierto"
},

{
id_propuesta: 9,
id_escuela: 5,
categoria: "Formacion",
subcategoria: "Formación para familias",
titulo: "Prevención de abuso sexual",
descripcion: "",
estado: "cubierto"
},

{
id_propuesta: 10,
id_escuela: 5,
categoria: "Material",
subcategoria: "Material didáctico",
titulo: "Material estudiantes: proyecto de vida (alebrijes)",
descripcion: "",
estado: "cubierto"
},

{
id_propuesta: 11,
id_escuela: 6,
categoria: "Formacion",
subcategoria: "Formación para docentes",
titulo: "Docentes: proyecto de vida",
descripcion: "",
estado: "cubierto"
},

{
id_propuesta: 12,
id_escuela: 6,
categoria: "Material",
subcategoria: "Mobiliario",
titulo: "Comedores",
descripcion: "",
estado: "pendiente"
},

{
id_propuesta: 13,
id_escuela: 7,
categoria: "Material",
subcategoria: "Material literario",
titulo: "Libros infantil",
descripcion: "",
estado: "cubierto"
},

{
id_propuesta: 14,
id_escuela: 7,
categoria: "Infraestructura",
subcategoria: "Construcción materiales",
titulo: "Montenes de fierro (vigas) de 5 pulgadas calibre 14",
descripcion: "",
estado: "cubierto"
},

{
id_propuesta: 15,
id_escuela: 8,
categoria: "Infraestructura",
subcategoria: "Construcción materiales",
titulo: "Cubetas de pintura",
descripcion: "",
estado: "cubierto"
},

{
id_propuesta: 16,
id_escuela: 8,
categoria: "Material",
subcategoria: "Material tecnológico",
titulo: "Proyectores",
descripcion: "",
estado: "Pendiente"
},

{
id_propuesta: 17,
id_escuela: 9,
categoria: "Salud",
subcategoria: "Salud física",
titulo: "Jornadas de salud física",
descripcion: "",
estado: "Cubierto"
},

{
id_propuesta: 18,
id_escuela: 9,
categoria: "Formación",
subcategoria: "Formación para estudiantes",
titulo: "Estudiantes S: Prevención de violencia",
descripcion: "",
estado: "Pendiente"
},

{
id_propuesta: 19,
id_escuela: 10,
categoria: "Infrestructura",
subcategoria: "Salud física",
titulo: "Filtros de agua (quizás)",
descripcion: "",
estado: "Cubierto"
},

{
id_propuesta: 20,
id_escuela: 10,
categoria: "Material",
subcategoria: "Transporte",
titulo: "Bicicletas",
descripcion: "",
estado: "Cubierto"
},

{
id_propuesta: 21,
id_escuela: 11,
categoria: "Salud",
subcategoria: "Salud física",
titulo: "Jornadas de salud física",
descripcion: "",
estado: "Cubierto"
},

{
id_propuesta: 22,
id_escuela: 11,
categoria: "Material",
subcategoria: "Material de educación física",
titulo: "Pelotas",
descripcion: "",
estado: "Pendientes"
},

{
id_propuesta: 23,
id_escuela: 12,
categoria: "Material",
subcategoria: "Material didáctico",
titulo: "Juegos de mesa",
descripcion: "",
estado: "Pendiente"
},

{
id_propuesta: 24,
id_escuela: 12,
categoria: "Infraestructura",
subcategoria: "Construcción servicio",
titulo: "Arreglo de barda con alambrado caído",
descripcion: "",
estado: "Pendientes"
}

]

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api/escuelas', (req,res) => {
  res.json(escuelas);
})

app.get('/api/escuelas/:id', (req,res) => {
  const idBuscado = parseInt(req.params.id);
  const escuelaEncontrada = escuelas.find(e => e.id_escuela === idBuscado);
  if (escuelaEncontrada) {
    res.json(escuelaEncontrada);
  } else {
    res.status(404).json({ mensaje: "Escuela no encontrada" });
  }
});

app.get('/api/home', (req, res) => {
  
})

app.listen(PORT, () => {
    console.log(`Listening in Port: ${PORT}`)
})

