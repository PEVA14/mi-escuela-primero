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
];


// ===== NECESIDADES (datos de ejemplo) =====
const necesidades = [
  { id_necesidad: 1, id_escuela: 1, titulo: "Pintura y renovación de aulas", descripcion: "Material de pintura para las 4 aulas de la escuela", categoria: "infraestructura", prioridad: "Alta", monto_requerido: 8000, monto_recaudado: 2500, estado: "En progreso" },
  { id_necesidad: 2, id_escuela: 1, titulo: "Útiles escolares para alumnos", descripcion: "Cuadernos, lápices y colores para 40 alumnos de bajos recursos", categoria: "material", prioridad: "Alta", monto_requerido: 5000, monto_recaudado: 0, estado: "Pendiente" },
  { id_necesidad: 3, id_escuela: 2, titulo: "Reparación de techo del salón principal", descripcion: "El techo presenta filtraciones que afectan las clases en temporada de lluvias", categoria: "infraestructura", prioridad: "Alta", monto_requerido: 15000, monto_recaudado: 3000, estado: "En progreso" },
  { id_necesidad: 4, id_escuela: 3, titulo: "Material didáctico de matemáticas", descripcion: "Juegos y materiales manipulables para enseñanza de matemáticas", categoria: "material", prioridad: "Media", monto_requerido: 4500, monto_recaudado: 4500, estado: "Completada" },
  { id_necesidad: 5, id_escuela: 3, titulo: "Capacitación docente en lectoescritura", descripcion: "Taller de lectoescritura para los 15 maestros del plantel", categoria: "formacion", prioridad: "Media", monto_requerido: 12000, monto_recaudado: 0, estado: "Pendiente" },
  { id_necesidad: 6, id_escuela: 7, titulo: "Construcción de sanitarios dignos", descripcion: "Los baños actuales no están en condiciones mínimas de higiene", categoria: "infraestructura", prioridad: "Alta", monto_requerido: 35000, monto_recaudado: 10000, estado: "En progreso" },
  { id_necesidad: 7, id_escuela: 10, titulo: "Atención psicológica estudiantil", descripcion: "Sesiones de apoyo emocional para estudiantes en situación de vulnerabilidad", categoria: "salud", prioridad: "Alta", monto_requerido: 18000, monto_recaudado: 6000, estado: "En progreso" },
];

// ===== RESPUESTAS DE DONADORES (datos de ejemplo) =====
const respuestas = [
  { id: 1, nombre: "Carlos Martínez", correo: "carlos@empresaabc.com", telefono: "3312345678", empresa: "Empresa ABC", id_escuela: 1, nombre_escuela: "Francisco Rojas González", tipo_apoyo: "material", mensaje: "Estamos interesados en donar útiles escolares para los alumnos.", fecha: "2025-03-15" },
  { id: 2, nombre: "Sofía Herrera", correo: "sofia.herrera@gmail.com", telefono: "3387654321", empresa: "", id_escuela: 3, nombre_escuela: "Miguel Hidalgo y Costilla", tipo_apoyo: "formacion", mensaje: "Soy maestra jubilada y puedo apoyar con talleres de lectura.", fecha: "2025-03-20" },
  { id: 3, nombre: "Grupo Industrial Norte", correo: "contacto@gin.mx", telefono: "3301234567", empresa: "Grupo Industrial Norte", id_escuela: null, nombre_escuela: null, tipo_apoyo: "infraestructura", mensaje: "Queremos apoyar con materiales de construcción para escuelas de Zapopan.", fecha: "2025-04-02" },
  { id: 4, nombre: "Ana Laura Vega", correo: "alavega@hotmail.com", telefono: "", empresa: "Fundación Educar", id_escuela: 7, nombre_escuela: "Carlos de Icaza", tipo_apoyo: "salud", mensaje: "Podemos enviar un psicólogo una vez por semana durante el ciclo escolar.", fecha: "2025-04-10" },
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
  const { usuario, contraseña } = req.body;

  const usuarioEncontrado = usuariosDB.find((u) => {
    return u.usuario === usuario && u.password === contraseña;
  });

  if (usuarioEncontrado) {

    const token = jwt.sign(
      { usuario: usuarioEncontrado.usuario },
      SECRET_KEY,
      { expiresIn: "8h" }
    );

    res.status(200).json({
      mensaje: "Login OK",
      token: token
    });

  } else {
    res.status(401).json({ mensaje: "Error en credenciales" });
  }
});


app.put('/api/escuelas/:id', authenticateToken, (req, res) => {

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

app.delete('/api/escuelas/:id', authenticateToken, (req, res) => {
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

// ===== ENDPOINTS NECESIDADES =====

app.get('/api/necesidades', (req, res) => {
  res.json(necesidades);
});

app.get('/api/necesidades/escuela/:id_escuela', (req, res) => {
  const id = parseInt(req.params.id_escuela);
  res.json(necesidades.filter(n => n.id_escuela === id));
});

app.post('/api/necesidades', authenticateToken, (req, res) => {
  const { id_escuela, titulo, descripcion, categoria, prioridad, monto_requerido, monto_recaudado, estado } = req.body;
  if (!titulo || !id_escuela) {
    return res.status(400).json({ mensaje: "titulo e id_escuela son requeridos" });
  }
  const maxId = necesidades.length > 0 ? Math.max(...necesidades.map(n => n.id_necesidad)) : 0;
  const nueva = {
    id_necesidad: maxId + 1,
    id_escuela: parseInt(id_escuela),
    titulo,
    descripcion: descripcion || "",
    categoria: categoria || "material",
    prioridad: prioridad || "Media",
    monto_requerido: parseFloat(monto_requerido) || 0,
    monto_recaudado: parseFloat(monto_recaudado) || 0,
    estado: estado || "Pendiente",
  };
  necesidades.push(nueva);
  res.status(201).json({ mensaje: "Necesidad creada", necesidad: nueva });
});

app.put('/api/necesidades/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const idx = necesidades.findIndex(n => n.id_necesidad === id);
  if (idx === -1) return res.status(404).json({ mensaje: "Necesidad no encontrada" });
  necesidades[idx] = { ...necesidades[idx], ...req.body, id_necesidad: id };
  res.json({ mensaje: "Necesidad actualizada", necesidad: necesidades[idx] });
});

app.delete('/api/necesidades/:id', authenticateToken, (req, res) => {
  const id = parseInt(req.params.id);
  const idx = necesidades.findIndex(n => n.id_necesidad === id);
  if (idx === -1) return res.status(404).json({ mensaje: "Necesidad no encontrada" });
  necesidades.splice(idx, 1);
  res.json({ mensaje: "Necesidad eliminada" });
});


// ===== ENDPOINTS RESPUESTAS =====

app.get('/api/respuestas', authenticateToken, (req, res) => {
  res.json(respuestas);
});

app.post('/api/respuestas', (req, res) => {
  const { nombre, correo, telefono, empresa, id_escuela, nombre_escuela, tipo_apoyo, mensaje } = req.body;
  if (!nombre || !correo) {
    return res.status(400).json({ mensaje: "nombre y correo son requeridos" });
  }
  const maxId = respuestas.length > 0 ? Math.max(...respuestas.map(r => r.id)) : 0;
  const nueva = {
    id: maxId + 1,
    nombre,
    correo,
    telefono: telefono || "",
    empresa: empresa || "",
    id_escuela: id_escuela ? parseInt(id_escuela) : null,
    nombre_escuela: nombre_escuela || null,
    tipo_apoyo: tipo_apoyo || "otro",
    mensaje: mensaje || "",
    fecha: new Date().toISOString().split("T")[0],
  };
  respuestas.push(nueva);
  res.status(201).json({ mensaje: "Respuesta registrada", respuesta: nueva });
});


// ===== IMPORTAR EXCEL =====

app.post('/api/importar/escuelas', authenticateToken, (req, res) => {
  const { escuelas: nuevas } = req.body;
  if (!Array.isArray(nuevas) || !nuevas.length) {
    return res.status(400).json({ mensaje: "No se recibieron datos válidos" });
  }
  const insertadas = [];
  const errores = [];
  nuevas.forEach((e, i) => {
    if (!e.nombre || !e.municipio || !e.cct) {
      errores.push(`Fila ${i + 2}: faltan campos obligatorios (nombre, municipio, cct)`);
      return;
    }
    const maxId = escuelas.length > 0 ? Math.max(...escuelas.map(e => e.id_escuela)) : 0;
    const nueva = {
      id_escuela: maxId + insertadas.length + 1,
      nombre: String(e.nombre),
      plantel: String(e.plantel || e.nombre),
      municipio: String(e.municipio),
      direccion: String(e.direccion || ""),
      ubicacion: String(e.ubicacion || ""),
      cct: String(e.cct),
      personal_escolar: parseInt(e.personal_escolar) || 0,
      estudiantes: parseInt(e.estudiantes) || 0,
      nivelEducativo: String(e.nivelEducativo || "Primaria"),
      modalidad: String(e.modalidad || "SEP-General"),
      turno: String(e.turno || "Matutino"),
      sostenimiento: String(e.sostenimiento || "Federal"),
      categoria: e.categoria
        ? String(e.categoria).split(",").map(c => c.trim()).filter(Boolean)
        : [],
    };
    escuelas.push(nueva);
    insertadas.push(nueva);
  });
  res.json({
    mensaje: `${insertadas.length} escuela(s) importada(s)`,
    insertadas: insertadas.length,
    errores,
  });
});

app.post('/api/importar/necesidades', authenticateToken, (req, res) => {
  const { necesidades: nuevas } = req.body;
  if (!Array.isArray(nuevas) || !nuevas.length) {
    return res.status(400).json({ mensaje: "No se recibieron datos válidos" });
  }
  const insertadas = [];
  const errores = [];
  nuevas.forEach((n, i) => {
    if (!n.titulo || !n.id_escuela) {
      errores.push(`Fila ${i + 2}: faltan campos obligatorios (titulo, id_escuela)`);
      return;
    }
    const maxId = necesidades.length > 0 ? Math.max(...necesidades.map(n => n.id_necesidad)) : 0;
    const nueva = {
      id_necesidad: maxId + insertadas.length + 1,
      id_escuela: parseInt(n.id_escuela),
      titulo: String(n.titulo),
      descripcion: String(n.descripcion || ""),
      categoria: String(n.categoria || "material"),
      prioridad: String(n.prioridad || "Media"),
      monto_requerido: parseFloat(n.monto_requerido) || 0,
      monto_recaudado: parseFloat(n.monto_recaudado) || 0,
      estado: String(n.estado || "Pendiente"),
    };
    necesidades.push(nueva);
    insertadas.push(nueva);
  });
  res.json({
    mensaje: `${insertadas.length} necesidad(es) importada(s)`,
    insertadas: insertadas.length,
    errores,
  });
});


app.listen(PORT, () => {
    console.log(`Listening in Port: ${PORT}`)
})

