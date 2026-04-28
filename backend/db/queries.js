const pool = require('./connection');


async function getOrCreate(table, idCol, nameCol, value) {
  if (!value) return null;
  const val = String(value).trim();
  if (!val) return null;
  const [rows] = await pool.query(
    `SELECT \`${idCol}\` FROM \`${table}\` WHERE \`${nameCol}\` = ?`,
    [val]
  );
  if (rows.length > 0) return rows[0][idCol];
  const [result] = await pool.query(
    `INSERT IGNORE INTO \`${table}\` (\`${nameCol}\`) VALUES (?)`,
    [val]
  );
  if (result.insertId) return result.insertId;
  // Race condition: another insert beat us, fetch again
  const [rows2] = await pool.query(
    `SELECT \`${idCol}\` FROM \`${table}\` WHERE \`${nameCol}\` = ?`,
    [val]
  );
  return rows2[0][idCol];
}

async function getOrCreateSubcategoria(categoriaName, subcategoriaName) {
  if (!categoriaName) return null;
  const catName = String(categoriaName).trim();
  const subName = subcategoriaName ? String(subcategoriaName).trim() : catName;
  const id_categoria = await getOrCreate('Categoria', 'id_categoria', 'nombre_categoria', catName);
  const [rows] = await pool.query(
    'SELECT id_subcategoria FROM Subcategoria WHERE nombre_subcategoria = ? AND id_categoria = ?',
    [subName, id_categoria]
  );
  if (rows.length > 0) return rows[0].id_subcategoria;
  const [result] = await pool.query(
    'INSERT INTO Subcategoria (nombre_subcategoria, id_categoria) VALUES (?, ?)',
    [subName, id_categoria]
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
    ubicacion:        row.ubicacion        || '',
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
    // Filled in by the caller via a second query (see attachFotos).
    fotos: [],
  };
}

/*
 * BASE_URL is the public address of this backend server.
 * It is used to build the photo URLs that the frontend puts in <img src>.
 * In production set the BASE_URL environment variable to your Railway URL.
 * e.g.  BASE_URL=https://mi-escuela.railway.app
 */
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

/*
 * attachFotos
 * ───────────────────────────────────────────────────────────────────────────
 * Called after every school query to populate the `fotos` array on each
 * school object before it is sent to the frontend.
 *
 * IMPORTANT: we do NOT select foto_data here.  Loading every image's binary
 * bytes for every school in a listing would be enormous (imagine 50 schools
 * × 5 photos × 2 MB = 500 MB transferred for a single page load).
 *
 * Instead we only fetch id_foto and id_escuela, then build a URL that points
 * to GET /api/fotos/:id.  When the browser renders <img src="…/api/fotos/7">
 * it makes a separate, cacheable HTTP request for that one image.
 *
 * Each element of the fotos array is  { id_foto, url }  so the frontend
 * has the ID available when it needs to delete a specific photo.
 */
async function attachFotos(escuelas) {
  if (!escuelas.length) return escuelas;
  /*
   * Safety net: if the FotosEscuelas table is missing expected columns
   * (e.g. the database was created before the migration ran), we don't
   * want that to block every single school query and save.  We catch the
   * error here, log it, and return schools with empty fotos arrays so the
   * rest of the application keeps working.
   *
   * WHERE foto_data IS NOT NULL filters out stale rows that were inserted
   * by the old link-based system and never had binary data.  Those rows
   * would cause GET /api/fotos/:id to return a broken response (empty body)
   * which makes <img> tags show as broken images in the browser.
   */
  try {
    const [rows] = await pool.query(
      'SELECT id_foto, id_escuela FROM FotosEscuelas WHERE foto_data IS NOT NULL ORDER BY id_foto'
    );
    const byId = new Map();
    for (const r of rows) {
      if (!byId.has(r.id_escuela)) byId.set(r.id_escuela, []);
      byId.get(r.id_escuela).push({
        id_foto: r.id_foto,
        url: `${BASE_URL}/api/fotos/${r.id_foto}`,
      });
    }
    for (const e of escuelas) {
      e.fotos = byId.get(e.id_escuela) || [];
    }
  } catch (err) {
    console.error('attachFotos: could not load photos, returning empty arrays:', err.message);
    for (const e of escuelas) { e.fotos = []; }
  }
  return escuelas;
}

/*
 * saveFoto
 * ───────────────────────────────────────────────────────────────────────────
 * Persists a single uploaded file to the database.
 *
 * `file` is the object that multer creates when it processes a multipart
 * request.  With memoryStorage() it looks like:
 *   {
 *     originalname: "patio.jpg",   ← filename from the user's computer
 *     mimetype:     "image/jpeg",  ← detected MIME type
 *     buffer:       <Buffer …>,    ← the actual image bytes in RAM
 *   }
 *
 * We insert those three fields plus the school ID into FotosEscuelas.
 * MySQL stores the Buffer as MEDIUMBLOB bytes automatically.
 */
async function saveFoto(id_escuela, file) {
  const [result] = await pool.query(
    'INSERT INTO FotosEscuelas (id_escuela, foto_nombre, foto_mime, foto_data) VALUES (?, ?, ?, ?)',
    [id_escuela, file.originalname, file.mimetype, file.buffer]
  );
  return result.insertId;
}

/*
 * getFotoById
 * ───────────────────────────────────────────────────────────────────────────
 * Fetches the full row for a single photo including its binary data.
 * This is the only place we read foto_data — called exclusively by the
 * GET /api/fotos/:id route that streams the image to the browser.
 */
async function getFotoById(id_foto) {
  const [rows] = await pool.query(
    'SELECT foto_mime, foto_data, foto_nombre FROM FotosEscuelas WHERE id_foto = ?',
    [id_foto]
  );
  return rows[0] || null;
}

/*
 * deleteFotoById
 * ───────────────────────────────────────────────────────────────────────────
 * Removes a single photo row.  When an entire school is deleted, the
 * ON DELETE CASCADE on the foreign key removes all its photos automatically
 * without needing to call this function.
 */
async function deleteFotoById(id_foto) {
  await pool.query('DELETE FROM FotosEscuelas WHERE id_foto = ?', [id_foto]);
}

function formatPropuesta(row) {
  return {
    id_necesidad:    row.id_necesidad,
    id_escuela:      row.id_escuela,
    nombre_escuela:  row.nombre_escuela    || '',
    municipio:       row.municipio         || '',
    titulo:          row.propuesta         || '',
    descripcion:     row.detalles          || '',
    categoria:       row.categoria         || '',
    subcategoria:    row.subcategoria      || '',
    unidad:          row.unidad            || '',
    monto_requerido: row.cantidad          || 0,
    monto_recaudado: 0,
    estado:          row.estado            || 'Pendiente',
  };
}

function formatRespuesta(row) {
  return {
    id:               row.id_respuesta,
    nombre:           row.nombre_donate    || '',
    correo:           row.correo           || '',
    telefono:         row.telefono         || '',
    instancia:        row.instancia_donante|| '',
    empresa:          row.nombre_instancia || '',
    municipio:        row.municipio_donante|| '',
    tipo_apoyo:       row.tipo_donacion    || '',
    cantidad:         row.cantidad         || '',
    detalles:         row.detalles         || '',
    mensaje:          row.mensaje          || '',
    id_escuela:       row.id_escuela       || null,
    nombre_escuela:   row.nombre_escuela   || null,
    fecha:            row.fecha_envio
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
    e.ubicacion,
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
  return attachFotos(rows.map(formatEscuela));
}

async function getEscuelaById(id) {
  const [rows] = await pool.query(
    ESCUELA_SELECT + ' WHERE e.id_escuela = ? GROUP BY e.id_escuela',
    [id]
  );
  if (!rows.length) return null;
  const [esc] = await attachFotos([formatEscuela(rows[0])]);
  return esc;
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
       (nombre, plantel, direccion, ubicacion, cct, personal_escolar, estudiantes,
        id_municipio, id_modalidad, id_turno, id_sostenimiento)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nombre,
      plantel || '',
      direccion  || '',
      data.ubicacion || '',
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
    nombre, plantel, direccion, ubicacion, cct,
    personal_escolar, estudiantes,
    municipio, modalidad, turno, sostenimiento, nivelEducativo,
  } = data;

  const updates = {};
  if (nombre           !== undefined) updates.nombre           = nombre;
  if (plantel          !== undefined) updates.plantel          = plantel;
  if (direccion        !== undefined) updates.direccion        = direccion;
  if (ubicacion        !== undefined) updates.ubicacion        = ubicacion;
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
    p.id_propuesta         AS id_necesidad,
    p.id_escuela,
    e.nombre               AS nombre_escuela,
    m.nombre_municipio     AS municipio,
    p.propuesta,
    p.detalles,
    p.cantidad,
    c.nombre_categoria     AS categoria,
    sc.nombre_subcategoria AS subcategoria,
    ep.nombre_estado       AS estado,
    u.nombre_unidad        AS unidad
  FROM Propuesta p
  LEFT JOIN Escuela        e  ON p.id_escuela          = e.id_escuela
  LEFT JOIN Municipio      m  ON e.id_municipio         = m.id_municipio
  LEFT JOIN Subcategoria   sc ON p.id_subcategoria     = sc.id_subcategoria
  LEFT JOIN Categoria       c ON sc.id_categoria       = c.id_categoria
  LEFT JOIN EstadoPropuesta ep ON p.id_estadoPropuesta = ep.id_estadoPropuesta
  LEFT JOIN Unidad           u ON p.id_unidad           = u.id_unidad
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
  const { id_escuela, titulo, descripcion, categoria, subcategoria, unidad, estado, monto_requerido } = data;

  const [id_subcategoria, id_estadoPropuesta, id_unidad] = await Promise.all([
    getOrCreateSubcategoria(categoria || 'General', subcategoria),
    getOrCreate('EstadoPropuesta', 'id_estadoPropuesta', 'nombre_estado', estado || 'Pendiente'),
    unidad ? getOrCreate('Unidad', 'id_unidad', 'nombre_unidad', unidad) : Promise.resolve(null),
  ]);

  const [result] = await pool.query(
    `INSERT INTO Propuesta (propuesta, detalles, cantidad, id_escuela, id_subcategoria, id_estadoPropuesta, id_unidad)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      titulo || '',
      descripcion || '',
      parseInt(monto_requerido) || 0,
      id_escuela,
      id_subcategoria,
      id_estadoPropuesta,
      id_unidad,
    ]
  );
  return result.insertId;
}

async function updatePropuesta(id, data) {
  const { titulo, descripcion, categoria, estado, monto_requerido, id_escuela } = data;
  const updates = {};

  if (titulo      !== undefined) updates.propuesta = titulo;
  if (descripcion !== undefined) updates.detalles  = descripcion;
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
    nombre, correo, telefono, empresa, instancia_donante,
    municipio_donante, tipo_apoyo, tipo_donacion,
    cantidad, detalles, mensaje,
    id_escuela, id_propuesta,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO RespuestaFormulario
       (nombre_donate, correo, telefono, nombre_instancia, instancia_donante,
        municipio_donante, tipo_donacion, cantidad, detalles, mensaje,
        id_escuela, id_propuesta)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nombre             || '',
      correo             || '',
      telefono           || '',
      empresa            || '',
      instancia_donante  || '',
      municipio_donante  || '',
      tipo_apoyo || tipo_donacion || '',
      cantidad           || '',
      detalles           || '',
      mensaje            || '',
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
  let actualizadas = 0;
  for (const [i, row] of rows.entries()) {
    if (!row.nombre || !row.municipio || !row.cct) {
      errores.push(`Fila ${i + 2}: faltan campos obligatorios (nombre, municipio, cct)`);
      continue;
    }
    try {
      const [existing] = await pool.query(
        'SELECT id_escuela FROM Escuela WHERE cct = ? AND nombre = ?',
        [String(row.cct).trim(), String(row.nombre).trim()]
      );
      if (existing.length > 0) {
        await updateEscuela(existing[0].id_escuela, row);
        actualizadas++;
      } else {
        await createEscuela(row);
        insertadas++;
      }
    } catch (err) {
      errores.push(`Fila ${i + 2}: ${err.message}`);
    }
  }
  return { insertadas, actualizadas, errores };
}

async function importarPropuestas(rows) {
  const errores = [];
  let insertadas  = 0;
  let actualizadas = 0;

  for (const [i, row] of rows.entries()) {
    if (!row.titulo) {
      errores.push(`Fila ${i + 2}: falta el nombre de la propuesta`);
      continue;
    }
    try {
      let id_escuela = row.id_escuela;
      let escuelasDestino = [];

      if (!id_escuela && row.nombre_escuela) {
        const nombreBuscar   = String(row.nombre_escuela).trim();
        const municipioBuscar = row.municipio ? String(row.municipio).trim() : null;

        /*
         * Find schools by plantel or name (exact / partial LIKE).
         *
         * The municipio filter used to be injected as raw string interpolation,
         * which risked SQL syntax errors for names with special characters and
         * opened a SQL-injection vector.  We now use a LEFT JOIN + parameterised
         * WHERE condition so every value is properly escaped by mysql2.
         *
         * Logic:
         *   - If municipioBuscar is provided: also require the school's municipio
         *     to match (via LEFT JOIN so schools with no municipio are still
         *     returned when the JOIN column is NULL, but filtered by the WHERE).
         *   - If municipioBuscar is NULL / empty: skip the municipio check.
         */
        let [found] = await pool.query(
          `SELECT e.id_escuela, e.plantel, e.id_municipio
           FROM   Escuela e
           LEFT JOIN Municipio m ON e.id_municipio = m.id_municipio
           WHERE (e.plantel = ? OR e.nombre = ? OR e.nombre LIKE ? OR ? LIKE CONCAT('%', e.nombre, '%'))
             AND (? IS NULL OR m.nombre_municipio = ?)`,
          [
            nombreBuscar, nombreBuscar, `%${nombreBuscar}%`, nombreBuscar,
            municipioBuscar, municipioBuscar,
          ]
        );

        // Last resort: if municipio filter produced no results, retry without it.
        if (!found.length && municipioBuscar) {
          [found] = await pool.query(
            `SELECT id_escuela, plantel, id_municipio FROM Escuela
             WHERE plantel = ? OR nombre = ? OR nombre LIKE ? OR ? LIKE CONCAT('%', nombre, '%')`,
            [nombreBuscar, nombreBuscar, `%${nombreBuscar}%`, nombreBuscar]
          );
        }

        if (!found.length) {
          errores.push(`Fila ${i + 2}: plantel/escuela "${nombreBuscar}" no encontrado`);
          continue;
        }

        // Expand: pull in every school that shares a non-empty plantel with any
        // matched school (restricted to the same municipio to avoid collisions).
        const idsSet = new Set(found.map(r => r.id_escuela));
        const plantelsByMunicipio = new Map();
        for (const r of found) {
          const plantel = r.plantel ? String(r.plantel).trim() : '';
          if (!plantel) continue;
          const key = r.id_municipio ?? 'null';
          if (!plantelsByMunicipio.has(key)) plantelsByMunicipio.set(key, new Set());
          plantelsByMunicipio.get(key).add(plantel);
        }
        for (const [muniKey, plantels] of plantelsByMunicipio) {
          const plist        = [...plantels];
          const placeholders = plist.map(() => '?').join(',');
          const muniClause   = muniKey === 'null' ? 'id_municipio IS NULL' : 'id_municipio = ?';
          const params       = muniKey === 'null' ? plist : [muniKey, ...plist];
          const [siblings]   = await pool.query(
            `SELECT id_escuela FROM Escuela
             WHERE ${muniClause} AND plantel IN (${placeholders})`,
            params
          );
          siblings.forEach(s => idsSet.add(s.id_escuela));
        }
        escuelasDestino = [...idsSet];

      } else if (id_escuela) {
        escuelasDestino = [id_escuela];
      } else {
        errores.push(`Fila ${i + 2}: falta id_escuela o nombre_escuela`);
        continue;
      }

      for (const esc_id of escuelasDestino) {
        const [existing] = await pool.query(
          'SELECT id_propuesta FROM Propuesta WHERE id_escuela = ? AND propuesta = ?',
          [esc_id, String(row.titulo).trim()]
        );
        if (existing.length > 0) {
          await updatePropuesta(existing[0].id_propuesta, { ...row, id_escuela: esc_id });
          actualizadas++;
        } else {
          await createPropuesta({ ...row, id_escuela: esc_id });
          insertadas++;
        }
      }
    } catch (err) {
      errores.push(`Fila ${i + 2}: ${err.message}`);
    }
  }
  return { insertadas, actualizadas, errores };
}

async function getStats() {
  const [[{ escuelas }]]    = await pool.query('SELECT COUNT(*) AS escuelas FROM Escuela');
  const [[{ necesidades }]] = await pool.query('SELECT COUNT(*) AS necesidades FROM Propuesta');
  const [[{ municipios }]]  = await pool.query('SELECT COUNT(DISTINCT id_municipio) AS municipios FROM Escuela WHERE id_municipio IS NOT NULL');
  return { escuelas, necesidades, municipios };
}

// ─────────────────────────────────────────────────────────────────────────────
module.exports = {
  getAllEscuelas,
  getEscuelaById,
  createEscuela,
  updateEscuela,
  deleteEscuela,
  saveFoto,
  getFotoById,
  deleteFotoById,
  getAllPropuestas,
  getPropuestasByEscuela,
  createPropuesta,
  updatePropuesta,
  deletePropuesta,
  getAllRespuestas,
  createRespuesta,
  importarEscuelas,
  importarPropuestas,
  getStats,
};
