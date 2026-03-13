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
    sostenimiento: "Público",
    categoria: "Material"
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
    sostenimiento: "Público",
    categoria: "Infraestructura"
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
    sostenimiento: "Privado",
    categoria: "Formacion"
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
    sostenimiento: "Público",
    categoria: "Salud"
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
    sostenimiento: "Autónomo",
    categoria: "Infraestructura"
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
    sostenimiento: "Público",
    categoria: "Material"
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
    sostenimiento: "Público",
    categoria: "Formacion"
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
    sostenimiento: "Privado",
    categoria: "Material"
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
    sostenimiento: "Público",
    categoria: "Formacion"
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
    sostenimiento: "Público",
    categoria: "Infraestructura"
  }
];

const express = require('express');
const cors = require('cors');
const jwt= require("jsonwebtoken");
const app = express();

const PORT = 3000;
const SECRET_KEY = "pachandini";

app.use(cors());
app.use(express.json())

/*Middleware */

function authenticateToken(req, res, next) {

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ mensaje: "Token requerido" });
  }
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ mensaje: "Token inválido o expirado" });
    }
    req.user = user;
    next();
  });
}

/*Endpoints */
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


const usuariosDB = [{usuario: "Lepe", password:"Hola"}, {usuario:"Nicole", password:"cool"}];
app.post('/api/login', (req, res) => {
  const { usuario, contraseña} = req.body;
  const usuarioEncontrado = usuariosDB.find((u) => {
    return u.usuario === usuario && u.password === contraseña;  });
  if (usuarioEncontrado) {
    const token = jwt.sign(
    { usuario: usuarioEncontrado.usuario }, 
    SECRET_KEY,
    { expiresIn: "10m" });
    res.status(200).json({ mensaje: "Login OK" });
  } else {
    res.status(401).json({ mensaje: "Error" });
  }
  

});


app.put('/api/escuelas/:id', (req, res) => {

  const idBuscado = parseInt(req.params.id);

  const escuelaIndex = escuelas.findIndex(
    e => e.id_escuela === idBuscado
  );

  if (escuelaIndex === -1) {
    return res.status(404).json({ mensaje: "Escuela no encontrada" });
  }

  const {
    nombre,
    plantel,
    municipio,
    direccion,
    ubicacion,
    cct,
    personal_escolar,
    estudiantes,
    nivelEducativo,
    modalidad,
    turno,
    sostenimiento,
    categoria
  } = req.body;

  escuelas[escuelaIndex] = {
    ...escuelas[escuelaIndex],
    nombre: nombre || escuelas[escuelaIndex].nombre,
    plantel: plantel || escuelas[escuelaIndex].plantel,
    municipio: municipio || escuelas[escuelaIndex].municipio,
    direccion: direccion || escuelas[escuelaIndex].direccion,
    ubicacion: ubicacion || escuelas[escuelaIndex].ubicacion,
    cct: cct || escuelas[escuelaIndex].cct,
    personal_escolar: personal_escolar || escuelas[escuelaIndex].personal_escolar,
    estudiantes: estudiantes || escuelas[escuelaIndex].estudiantes,
    nivelEducativo: nivelEducativo || escuelas[escuelaIndex].nivelEducativo,
    modalidad: modalidad || escuelas[escuelaIndex].modalidad,
    turno: turno || escuelas[escuelaIndex].turno,
    sostenimiento: sostenimiento || escuelas[escuelaIndex].sostenimiento,
    categoria: categoria || escuelas[escuelaIndex].categoria
  };

  res.json({
    mensaje: "Escuela actualizada",
    escuela: escuelas[escuelaIndex]
  });

});





app.post('/api/escuelas', (req, res) => {
  console.log("--- Petición recibida en POST /api/escuelas ---");
  console.log("Cuerpo de la petición:", req.body); 

  try {
    const { nombre, plantel, municipio, direccion, ubicacion, cct, 
      personal_escolar, estudiantes, nivelEducativo, modalidad, 
      turno, sostenimiento, categoria } = req.body;

    const nuevaEscuela = {
      id_escuela: escuelas.length > 0 ? escuelas[escuelas.length - 1].id_escuela + 1 : 1, 
      nombre,
      plantel: plantel || "No especificado",
      municipio: municipio || "No especificado",
      direccion: direccion || "",
      ubicacion: ubicacion || "",
      cct: cct || "",
      personal_escolar: parseInt(personal_escolar) || 0,
      estudiantes: parseInt(estudiantes) || 0,
      nivelEducativo: nivelEducativo || "",
      modalidad: modalidad || "",
      turno: turno || "",
      sostenimiento: sostenimiento || "",
      categoria: categoria || "General" 
    };

    escuelas.push(nuevaEscuela);

    res.status(201).json({ 
      mensaje: "Escuela registrada con éxito", 
      escuela: nuevaEscuela 
    });

  } catch (error) {
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

app.delete('/api/escuelas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const indice = escuelas.findIndex(e => e.id_escuela === id);
  if (indice !== -1) {
    const escuelaEliminada = escuelas.splice(indice, 1);
    res.status(200).json({ 
      mensaje: "Escuela eliminada con éxito",
      id: id 
    });
  } else {
    res.status(404).json({ mensaje: "Error: La escuela no existe en la base de datos." });
  }
});

app.listen(PORT, () => {
    console.log(`Listening in Port: ${PORT}`)
})

