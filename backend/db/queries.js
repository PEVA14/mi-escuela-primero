const pool = require('./connection');


async function getOrCreate(table, idCol, nameCol, value) {
  if (!value) return null;
  const val = String(value).trim();
  const [rows] = await pool.query(
    `SELECT \`${idCol}\` FROM \`${table}\` WHERE \`${nameCol}\` = ?`,
    [val]
  );
  if (rows.length > 0) return rows[0][idCol];
  const [result] = await pool.query(
    `INSERT INTO \`${table}\` (\`${nameCol}\`) VALUES (?)`,
    [val]
  );
  return result.insertId;
}

async function getOrCreateSubcategoria(categoriaName) {
  if (!categoriaName) return null;
  const name = String(categoriaName).trim();
  const id_categoria = await getOrCreate('Categoria', 'id_categoria', 'nombre_categoria', name);
  const [rows] = await pool.query(
    'SELECT id_subcategoria FROM Subcategoria WHERE nombre_subcategoria = ? AND id_categoria = ?',
    [name, id_categoria]
  );
  if (rows.length > 0) return rows[0].id_subcategoria;
  const [result] = await pool.query(
    'INSERT INTO Subcategoria (nombre_subcategoria, id_categoria) VALUES (?, ?)',
    [name, id_categoria]
  );
  return result.insertId;
}


async function setNivelEducativo(id_escuela, nivelValue) {
  await pool.query('DELETE FROM Escuela_NivelEducativo WHERE id_escuela = ?', [id_escuela]);
  const niveles = Array.isArray(nivelValue)
    ? nivelValue
    : nivelValue ? [String(nivelValue)] : [];
  for (const nivel of niveles.filter(Boolean)) {
    const id_nivel = await getOrCreate(
      'NivelEducativo', 'id_nivelEducativo', 'nombre_nivelEducativo', nivel
    );
    await pool.query(
      'INSERT IGNORE INTO Escuela_NivelEducativo (id_escuela, id_nivelEducativo) VALUES (?, ?)',
      [id_escuela, id_nivel]
    );
  }
}


function formatEscuela(row) {
  return {
    id_escuela:       row.id_escuela,
    nombre:           row.nombre           || '',
    plantel:          row.plantel          || '',
    municipio:        row.municipio        || '',
    direccion:        row.direccion        || '',
    ubicacion:        '',  // Not stored in DB schema — kept for frontend compatibility
    cct:              row.cct              || '',
    personal_escolar: row.personal_escolar || 0,
    estudiantes:      row.estudiantes      || 0,
    nivelEducativo:   row.nivelEducativo   || '',
    modalidad:        row.modalidad        || '',
    turno:            row.turno            || '',
    sostenimiento:    row.sostenimiento    || '',
    // Derived from the school's Propuestas via a subquery
    categoria: row.categoria
      ? row.categoria.split(',').map(c => c.trim()).filter(Boolean)
      : [],
  };
}

function formatPropuesta(row) {
  return {
    id_necesidad:    row.id_necesidad,
    id_escuela:      row.id_escuela,
    // Propuesta.detalles is used as the title (schema has no separate titulo column)
    titulo:          row.detalles          || '',
    descripcion:     row.detalles          || '',
    categoria:       row.categoria         || 'material',
    prioridad:       'Media',   // Not in DB schema — default value
    monto_requerido: row.cantidad          || 0,
    monto_recaudado: 0,         // Not in DB schema — default value
    estado:          row.estado            || 'Pendiente',
  };
}

function formatRespuesta(row) {
  return {
    id:             row.id_respuesta,
    nombre:         row.nombre_donate      || '',
    correo:         '',                    // Not in DB schema
    telefono:       row.telefono           || '',
    empresa:        row.nombre_instancia   || '',
    id_escuela:     row.id_escuela         || null,
    nombre_escuela: row.nombre_escuela     || null,
    tipo_apoyo:     row.tipo_donacion      || '',
    mensaje:        row.municipio_donante  || '',
    fecha:          row.fecha_envio
      ? new Date(row.fecha_envio).toISOString().split('T')[0]
      : '',
  };
}

const ESCUELA_SELECT = `
  SELECT
    e.id_escuela,
    e.nombre,
    e.plantel,
    e.direccion,
    e.cct,
    e.personal_escolar,
    e.estudiantes,
    m.nombre_municipio        AS municipio,
    mo.nombre_modalidad       AS modalidad,
    t.nombre_turno            AS turno,
    s.nombre_sostenimiento    AS sostenimiento,
    GROUP_CONCAT(
      DISTINCT ne.nombre_nivelEducativo
      ORDER BY ne.nombre_nivelEducativo
      SEPARATOR ','
    ) AS nivelEducativo,
    (
      SELECT GROUP_CONCAT(DISTINCT c2.nombre_categoria SEPARATOR ',')
      FROM   Propuesta p2
      JOIN   Subcategoria sc2 ON p2.id_subcategoria = sc2.id_subcategoria
      JOIN   Categoria    c2  ON sc2.id_categoria   = c2.id_categoria
      WHERE  p2.id_escuela = e.id_escuela
    ) AS categoria
  FROM Escuela e
  LEFT JOIN Municipio          m  ON e.id_municipio    = m.id_municipio
  LEFT JOIN Modalidad          mo ON e.id_modalidad    = mo.id_modalidad
  LEFT JOIN Turno              t  ON e.id_turno        = t.id_turno
  LEFT JOIN Sostenimiento      s  ON e.id_sostenimiento = s.id_sostenimiento
  LEFT JOIN Escuela_NivelEducativo ene ON e.id_escuela = ene.id_escuela
  LEFT JOIN NivelEducativo     ne ON ene.id_nivelEducativo = ne.id_nivelEducativo
`;

async function getAllEscuelas() {
  const [rows] = await pool.query(
    ESCUELA_SELECT + ' GROUP BY e.id_escuela ORDER BY e.id_escuela'
  );
  return rows.map(formatEscuela);
}

async function getEscuelaById(id) {
  const [rows] = await pool.query(
    ESCUELA_SELECT + ' WHERE e.id_escuela = ? GROUP BY e.id_escuela',
    [id]
  );
  if (!rows.length) return null;
  return formatEscuela(rows[0]);
}

async function createEscuela(data) {
  const {
    nombre, plantel, direccion, cct,
    personal_escolar, estudiantes,
    municipio, modalidad, turno, sostenimiento, nivelEducativo,
  } = data;

  const [id_municipio, id_modalidad, id_turno, id_sostenimiento] = await Promise.all([
    getOrCreate('Municipio',     'id_municipio',     'nombre_municipio',     municipio),
    getOrCreate('Modalidad',     'id_modalidad',     'nombre_modalidad',     modalidad),
    getOrCreate('Turno',         'id_turno',         'nombre_turno',         turno),
    getOrCreate('Sostenimiento', 'id_sostenimiento', 'nombre_sostenimiento', sostenimiento),
  ]);

  const [result] = await pool.query(
    `INSERT INTO Escuela
       (nombre, plantel, direccion, cct, personal_escolar, estudiantes,
        id_municipio, id_modalidad, id_turno, id_sostenimiento)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nombre,
      plantel || nombre,
      direccion  || '',
      cct        || '',
      parseInt(personal_escolar) || 0,
      parseInt(estudiantes)      || 0,
      id_municipio,
      id_modalidad,
      id_turno,
      id_sostenimiento,
    ]
  );

  await setNivelEducativo(result.insertId, nivelEducativo);
  return result.insertId;
}

async function updateEscuela(id, data) {
  const {
    nombre, plantel, direccion, cct,
    personal_escolar, estudiantes,
    municipio, modalidad, turno, sostenimiento, nivelEducativo,
  } = data;

  const updates = {};
  if (nombre           !== undefined) updates.nombre           = nombre;
  if (plantel          !== undefined) updates.plantel          = plantel;
  if (direccion        !== undefined) updates.direccion        = direccion;
  if (cct              !== undefined) updates.cct              = cct;
  if (personal_escolar !== undefined) updates.personal_escolar = parseInt(personal_escolar) || 0;
  if (estudiantes      !== undefined) updates.estudiantes      = parseInt(estudiantes)      || 0;

  // Resolve FK values in parallel
  const fkEntries = [];
  if (municipio)     fkEntries.push(['id_municipio',     getOrCreate('Municipio',     'id_municipio',     'nombre_municipio',     municipio)]);
  if (modalidad)     fkEntries.push(['id_modalidad',     getOrCreate('Modalidad',     'id_modalidad',     'nombre_modalidad',     modalidad)]);
  if (turno)         fkEntries.push(['id_turno',         getOrCreate('Turno',         'id_turno',         'nombre_turno',         turno)]);
  if (sostenimiento) fkEntries.push(['id_sostenimiento', getOrCreate('Sostenimiento', 'id_sostenimiento', 'nombre_sostenimiento', sostenimiento)]);

  const fkResults = await Promise.all(fkEntries.map(([, p]) => p));
  fkEntries.forEach(([col], i) => { updates[col] = fkResults[i]; });

  if (Object.keys(updates).length > 0) {
    const set = Object.keys(updates).map(k => `\`${k}\` = ?`).join(', ');
    await pool.query(
      `UPDATE Escuela SET ${set} WHERE id_escuela = ?`,
      [...Object.values(updates), id]
    );
  }

  if (nivelEducativo !== undefined) {
    await setNivelEducativo(id, nivelEducativo);
  }
}

async function deleteEscuela(id) {
  await pool.query('DELETE FROM Escuela WHERE id_escuela = ?', [id]);
}

// ─────────────────────────────────────────────────────────────────────────────
// PROPUESTAS  (called "necesidades" in the frontend)
// ─────────────────────────────────────────────────────────────────────────────

const PROPUESTA_SELECT = `
  SELECT
    p.id_propuesta  AS id_necesidad,
    p.id_escuela,
    p.detalles,
    p.cantidad,
    COALESCE(c.nombre_categoria, sc.nombre_subcategoria, 'material') AS categoria,
    ep.nombre_estado  AS estado,
    u.nombre_unidad   AS unidad
  FROM Propuesta p
  LEFT JOIN Subcategoria   sc ON p.id_subcategoria    = sc.id_subcategoria
  LEFT JOIN Categoria       c ON sc.id_categoria      = c.id_categoria
  LEFT JOIN EstadoPropuesta ep ON p.id_estadoPropuesta = ep.id_estadoPropuesta
  LEFT JOIN Unidad           u ON p.id_unidad          = u.id_unidad
`;

async function getAllPropuestas() {
  const [rows] = await pool.query(
    PROPUESTA_SELECT + ' ORDER BY p.id_escuela, p.id_propuesta'
  );
  return rows.map(formatPropuesta);
}

async function getPropuestasByEscuela(id_escuela) {
  const [rows] = await pool.query(
    PROPUESTA_SELECT + ' WHERE p.id_escuela = ? ORDER BY p.id_propuesta',
    [id_escuela]
  );
  return rows.map(formatPropuesta);
}

async function createPropuesta(data) {
  const { id_escuela, titulo, descripcion, categoria, estado, monto_requerido } = data;

  const [id_subcategoria, id_estadoPropuesta] = await Promise.all([
    getOrCreateSubcategoria(categoria || 'General'),
    getOrCreate('EstadoPropuesta', 'id_estadoPropuesta', 'nombre_estado', estado || 'Pendiente'),
  ]);

  const [result] = await pool.query(
    `INSERT INTO Propuesta (detalles, cantidad, id_escuela, id_subcategoria, id_estadoPropuesta)
     VALUES (?, ?, ?, ?, ?)`,
    [
      titulo || descripcion || '',
      parseInt(monto_requerido) || 0,
      id_escuela,
      id_subcategoria,
      id_estadoPropuesta,
    ]
  );
  return result.insertId;
}

async function updatePropuesta(id, data) {
  const { titulo, descripcion, categoria, estado, monto_requerido, id_escuela } = data;
  const updates = {};

  if (titulo !== undefined || descripcion !== undefined) {
    updates.detalles = titulo || descripcion || '';
  }
  if (monto_requerido !== undefined) updates.cantidad = parseInt(monto_requerido) || 0;
  if (id_escuela      !== undefined) updates.id_escuela = id_escuela;

  if (categoria) {
    updates.id_subcategoria = await getOrCreateSubcategoria(categoria);
  }
  if (estado) {
    updates.id_estadoPropuesta = await getOrCreate(
      'EstadoPropuesta', 'id_estadoPropuesta', 'nombre_estado', estado
    );
  }

  if (Object.keys(updates).length > 0) {
    const set = Object.keys(updates).map(k => `\`${k}\` = ?`).join(', ');
    await pool.query(
      `UPDATE Propuesta SET ${set} WHERE id_propuesta = ?`,
      [...Object.values(updates), id]
    );
  }
}

async function deletePropuesta(id) {
  await pool.query('DELETE FROM Propuesta WHERE id_propuesta = ?', [id]);
}

// ─────────────────────────────────────────────────────────────────────────────
// RESPUESTAS DE DONADORES
// ─────────────────────────────────────────────────────────────────────────────

async function getAllRespuestas() {
  const [rows] = await pool.query(`
    SELECT r.*, e.nombre AS nombre_escuela
    FROM   RespuestaFormulario r
    LEFT JOIN Escuela e ON r.id_escuela = e.id_escuela
    ORDER BY r.fecha_envio DESC
  `);
  return rows.map(formatRespuesta);
}

async function createRespuesta(data) {
  const {
    nombre, telefono, empresa, instancia_donante,
    municipio_donante, estado_donante,
    tipo_apoyo, tipo_donacion, cantidad,
    id_escuela, id_propuesta,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO RespuestaFormulario
       (nombre_donate, telefono, nombre_instancia, instancia_donante,
        municipio_donante, estado_donante, tipo_donacion, cantidad,
        id_escuela, id_propuesta)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nombre             || '',
      telefono           || '',
      empresa            || '',
      instancia_donante  || '',
      municipio_donante  || '',
      estado_donante     || '',
      tipo_apoyo || tipo_donacion || '',
      cantidad           || '',
      id_escuela         || null,
      id_propuesta       || null,
    ]
  );
  return result.insertId;
}

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTAR EXCEL
// ─────────────────────────────────────────────────────────────────────────────

async function importarEscuelas(rows) {
  const errores = [];
  let insertadas = 0;
  for (const [i, row] of rows.entries()) {
    if (!row.nombre || !row.municipio || !row.cct) {
      errores.push(`Fila ${i + 2}: faltan campos obligatorios (nombre, municipio, cct)`);
      continue;
    }
    try {
      await createEscuela(row);
      insertadas++;
    } catch (err) {
      errores.push(`Fila ${i + 2}: ${err.message}`);
    }
  }
  return { insertadas, errores };
}

async function importarPropuestas(rows) {
  const errores = [];
  let insertadas = 0;
  for (const [i, row] of rows.entries()) {
    if (!row.titulo || !row.id_escuela) {
      errores.push(`Fila ${i + 2}: faltan campos obligatorios (titulo, id_escuela)`);
      continue;
    }
    try {
      await createPropuesta(row);
      insertadas++;
    } catch (err) {
      errores.push(`Fila ${i + 2}: ${err.message}`);
    }
  }
  return { insertadas, errores };
}

// ─────────────────────────────────────────────────────────────────────────────
module.exports = {
  getAllEscuelas,
  getEscuelaById,
  createEscuela,
  updateEscuela,
  deleteEscuela,
  getAllPropuestas,
  getPropuestasByEscuela,
  createPropuesta,
  updatePropuesta,
  deletePropuesta,
  getAllRespuestas,
  createRespuesta,
  importarEscuelas,
  importarPropuestas,
};
