const escuelas = [
  {
    id_escuela: 1,
    nombre: "Primaria Federal Constituyentes de 1917",
    plantel: "Matriz",
    municipio: "Zapopan",
    direccion: "Av. de los Laureles 450",
    ubicacion: "20.7215, -103.3912",
    cct: "14DPR3412Z",
    personal_escolar: 24,
    estudiantes: 520,
    nivelEducativo: "Primaria",
    modalidad: "Escolarizada",
    turno: "Matutino",
    sostenimiento: "Público"
  },
  {
    id_escuela: 2,
    nombre: "Secundaria Técnica 114",
    plantel: "Anexo A",
    municipio: "Guadalajara",
    direccion: "Calzada Independencia Norte 1022",
    ubicacion: "20.6890, -103.3341",
    cct: "14DST0114B",
    personal_escolar: 42,
    estudiantes: 890,
    nivelEducativo: "Secundaria",
    modalidad: "Técnica",
    turno: "Vespertino",
    sostenimiento: "Público"
  },
  {
    id_escuela: 3,
    nombre: "Colegio Americano de Occidente",
    plantel: "Campus Vallarta",
    municipio: "Puerto Vallarta",
    direccion: "Calle Pez Vela 15, Marina Vallarta",
    ubicacion: "20.6661, -105.2443",
    cct: "14PJN0089X",
    personal_escolar: 18,
    estudiantes: 120,
    nivelEducativo: "Preescolar",
    modalidad: "Privada",
    turno: "Matutino",
    sostenimiento: "Privado"
  },
  {
    id_escuela: 4,
    nombre: "Centro de Atención Múltiple (CAM) No. 5",
    plantel: "Unidad Especial",
    municipio: "Tlaquepaque",
    direccion: "Niños Héroes 88",
    ubicacion: "20.6401, -103.3150",
    cct: "14DML0005M",
    personal_escolar: 12,
    estudiantes: 45,
    nivelEducativo: "Especial",
    modalidad: "Escolarizada",
    turno: "Matutino",
    sostenimiento: "Público"
  },
  {
    id_escuela: 5,
    nombre: "Preparatoria Regional de El Salto",
    plantel: "Modulo Juanacatlán",
    municipio: "El Salto",
    direccion: "Carr. a El Castillo Km 2",
    ubicacion: "20.5189, -103.2455",
    cct: "14UBH0021L",
    personal_escolar: 35,
    estudiantes: 1100,
    nivelEducativo: "Media Superior",
    modalidad: "Bivalente",
    turno: "Continuo",
    sostenimiento: "Autónomo"
  },
  {
    id_escuela: 6,
    nombre: "Escuela Rural Emiliano Zapata",
    plantel: "Único",
    municipio: "Tequila",
    direccion: "Conocido, Domicilio Rural",
    ubicacion: "20.8841, -103.8377",
    cct: "14KPR0552J",
    personal_escolar: 3,
    estudiantes: 58,
    nivelEducativo: "Primaria",
    modalidad: "Multigrado",
    turno: "Matutino",
    sostenimiento: "Público"
  },
  {
    id_escuela: 7,
    nombre: "Instituto Tecnológico Superior de Zapopan",
    plantel: "Campus Central",
    municipio: "Zapopan",
    direccion: "Camino a las Cañadas 600",
    ubicacion: "20.7456, -103.3762",
    cct: "14EIT0001D",
    personal_escolar: 150,
    estudiantes: 4500,
    nivelEducativo: "Superior",
    modalidad: "Ingeniería",
    turno: "Mixto",
    sostenimiento: "Público"
  },
  {
    id_escuela: 8,
    nombre: "Kinder Mi Pequeño Mundo",
    plantel: "Zapopan Norte",
    municipio: "Zapopan",
    direccion: "Av. Patria 220",
    ubicacion: "20.7001, -103.4150",
    cct: "14PJN1122C",
    personal_escolar: 8,
    estudiantes: 65,
    nivelEducativo: "Preescolar",
    modalidad: "Privada",
    turno: "Matutino",
    sostenimiento: "Privado"
  },
  {
    id_escuela: 9,
    nombre: "Escuela de Artes y Oficios",
    plantel: "Centro Histórico",
    municipio: "Guadalajara",
    direccion: "Calle Morelos 50",
    ubicacion: "20.6765, -103.3480",
    cct: "14EDP0012W",
    personal_escolar: 20,
    estudiantes: 200,
    nivelEducativo: "Formación Trabajo",
    modalidad: "Presencial",
    turno: "Nocturno",
    sostenimiento: "Público"
  },
  {
    id_escuela: 10,
    nombre: "Telebachillerato Comunitario No. 42",
    plantel: "San Juanito",
    municipio: "San Juanito de Escobedo",
    direccion: "Hidalgo s/n",
    ubicacion: "20.7950, -103.9980",
    cct: "14ETK0042K",
    personal_escolar: 4,
    estudiantes: 82,
    nivelEducativo: "Media Superior",
    modalidad: "Telebachillerato",
    turno: "Vespertino",
    sostenimiento: "Público"
  }
];

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

