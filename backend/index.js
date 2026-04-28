require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const jwt     = require('jsonwebtoken');
const multer  = require('multer');

const initDatabase = require('./db/init');
const queries      = require('./db/queries');

/*
 * Multer — handles multipart/form-data file uploads.
 *
 * memoryStorage() means uploaded files are never written to disk.
 * Instead, multer reads the raw bytes from the incoming HTTP request and
 * exposes them as a Buffer on req.file.buffer (or req.files[i].buffer for
 * multiple files).  That Buffer is what we insert into the MEDIUMBLOB column.
 *
 * limits.fileSize caps each image at 10 MB so a huge file can't crash the DB.
 * fileFilter rejects anything whose MIME type is not an image, so admins
 * can't accidentally upload a PDF or executable.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten archivos de imagen'));
    }
    cb(null, true);
  },
});

const app        = express();
const PORT       = process.env.PORT       || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'pachandini';

app.use(cors());
app.use(express.json({ limit: '10mb' }));


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ mensaje: 'Token requerido' });
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ mensaje: 'Token inválido o expirado' });
    req.user = user;
    next();
  });
}


const usuariosDB = [
  { usuario: 'Lepe',   password: 'Hola' },
  { usuario: 'Nicole', password: 'cool' },
];

app.post('/api/login', (req, res) => {
  const { usuario, contraseña } = req.body;
  const found = usuariosDB.find(u => u.usuario === usuario && u.password === contraseña);
  if (!found) return res.status(401).json({ mensaje: 'Error en credenciales' });
  const token = jwt.sign({ usuario: found.usuario }, SECRET_KEY, { expiresIn: '8h' });
  res.json({ mensaje: 'Login OK', token });
});


app.get('/api/stats', async (req, res) => {
  try {
    const stats = await queries.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ mensaje: `Error al obtener estadísticas: ${err.message}` });
  }
});

app.get('/api/escuelas', async (req, res) => {
  try {
    const escuelas = await queries.getAllEscuelas();
    res.json(escuelas);
  } catch (err) {
    console.error('GET /api/escuelas:', err.message);
    res.status(500).json({ mensaje: `Error al obtener escuelas: ${err.message}` });
  }
});

app.get('/api/escuelas/:id', async (req, res) => {
  try {
    const escuela = await queries.getEscuelaById(parseInt(req.params.id));
    if (!escuela) return res.status(404).json({ mensaje: 'Escuela no encontrada' });
    res.json(escuela);
  } catch (err) {
    console.error('GET /api/escuelas/:id:', err.message);
    res.status(500).json({ mensaje: `Error al obtener escuela: ${err.message}` });
  }
});

app.post('/api/escuelas', authenticateToken, async (req, res) => {
  try {
    const id    = await queries.createEscuela(req.body);
    const nueva = await queries.getEscuelaById(id);
    res.status(201).json({ mensaje: 'Escuela registrada con éxito', escuela: nueva });
  } catch (err) {
    console.error('POST /api/escuelas:', err.message);
    res.status(500).json({ mensaje: `Error al crear escuela: ${err.message}` });
  }
});

app.put('/api/escuelas/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existe = await queries.getEscuelaById(id);
    if (!existe) return res.status(404).json({ mensaje: 'Escuela no encontrada' });
    await queries.updateEscuela(id, req.body);
    const actualizada = await queries.getEscuelaById(id);
    res.json({ mensaje: 'Escuela actualizada', escuela: actualizada });
  } catch (err) {
    console.error('PUT /api/escuelas/:id:', err.message);
    res.status(500).json({ mensaje: `Error al actualizar escuela: ${err.message}` });
  }
});

app.delete('/api/escuelas/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existe = await queries.getEscuelaById(id);
    if (!existe) return res.status(404).json({ mensaje: 'Escuela no encontrada' });
    await queries.deleteEscuela(id);
    res.json({ mensaje: 'Escuela eliminada con éxito', id });
  } catch (err) {
    console.error('DELETE /api/escuelas/:id:', err.message);
    res.status(500).json({ mensaje: `Error al eliminar escuela: ${err.message}` });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PHOTO ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/*
 * GET /api/fotos/:id  (public — no auth required)
 *
 * This is the URL that every <img src> in the frontend points to.
 * The browser requests it like any other image file.
 *
 * What happens here:
 *   1. We fetch the single FotosEscuelas row for this id_foto.
 *   2. We set Content-Type to whatever MIME the admin uploaded
 *      (e.g. "image/jpeg") so the browser knows how to render it.
 *   3. We send the raw Buffer as the response body.
 *
 * Cache-Control: 1 year — images never change once uploaded, so the browser
 * can cache them aggressively and avoid re-downloading on every page visit.
 */
app.get('/api/fotos/:id', async (req, res) => {
  try {
    const foto = await queries.getFotoById(parseInt(req.params.id));
    if (!foto) return res.status(404).json({ mensaje: 'Foto no encontrada' });

    /*
     * Guard against rows that were migrated from the old link-based schema
     * and never received binary data.  Without this check, res.send(null)
     * would send an empty body and the browser would render a broken image.
     */
    if (!foto.foto_data || !foto.foto_mime) {
      return res.status(404).json({ mensaje: 'Foto sin datos válidos' });
    }

    res.set('Content-Type', foto.foto_mime);
    res.set('Content-Disposition', `inline; filename="${foto.foto_nombre ?? 'foto'}"`);
    res.set('Cache-Control', 'public, max-age=31536000');
    res.send(foto.foto_data);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener la foto', error: err.message });
  }
});

/*
 * POST /api/escuelas/:id/fotos  (protected — JWT required)
 *
 * Receives up to 10 image files as multipart/form-data under the field "fotos".
 * multer's upload.array('fotos', 10) middleware intercepts the request before
 * our handler runs and populates req.files with the parsed file objects.
 *
 * For each file we call saveFoto() which inserts one row into FotosEscuelas.
 * We respond with the new IDs so the frontend can immediately reference them.
 */
app.post('/api/escuelas/:id/fotos', authenticateToken, upload.array('fotos', 10), async (req, res) => {
  try {
    const id_escuela = parseInt(req.params.id);
    const existe = await queries.getEscuelaById(id_escuela);
    if (!existe) return res.status(404).json({ mensaje: 'Escuela no encontrada' });
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ mensaje: 'No se recibió ningún archivo' });
    }
    const ids = [];
    for (const file of req.files) {
      const id = await queries.saveFoto(id_escuela, file);
      ids.push(id);
    }
    res.status(201).json({ mensaje: `${ids.length} foto(s) guardada(s)`, ids });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al guardar la foto', error: err.message });
  }
});

/*
 * DELETE /api/fotos/:id  (protected — JWT required)
 *
 * Removes a single photo row from FotosEscuelas.
 * The frontend calls this when the admin clicks the × on an existing thumbnail.
 */
app.delete('/api/fotos/:id', authenticateToken, async (req, res) => {
  try {
    await queries.deleteFotoById(parseInt(req.params.id));
    res.json({ mensaje: 'Foto eliminada' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar la foto', error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// NECESIDADES  (stored as Propuesta in the DB)
// Route /escuela/:id must come before /:id to avoid Express matching "escuela"
// as the :id parameter.
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/necesidades', async (req, res) => {
  const necesidades = await queries.getAllPropuestas();
  res.json(necesidades);
});

app.get('/api/necesidades/escuela/:id_escuela', async (req, res) => {
  const id = parseInt(req.params.id_escuela);
  const necesidades = await queries.getPropuestasByEscuela(id);
  res.json(necesidades);
});

app.post('/api/necesidades', authenticateToken, async (req, res) => {
  const id = await queries.createPropuesta(req.body);
  res.status(201).json({ mensaje: 'Necesidad creada', id_necesidad: id });
});

app.put('/api/necesidades/:id', authenticateToken, async (req, res) => {
  await queries.updatePropuesta(parseInt(req.params.id), req.body);
  res.json({ mensaje: 'Necesidad actualizada' });
});

app.delete('/api/necesidades/:id', authenticateToken, async (req, res) => {
  await queries.deletePropuesta(parseInt(req.params.id));
  res.json({ mensaje: 'Necesidad eliminada' });
});

app.get('/api/respuestas', authenticateToken, async (req, res) => {
  const respuestas = await queries.getAllRespuestas();
  res.json(respuestas);
});

app.post('/api/respuestas', async (req, res) => {
  const id = await queries.createRespuesta(req.body);
  res.status(201).json({ mensaje: 'Respuesta registrada', id });
});

app.post('/api/importar/escuelas', authenticateToken, async (req, res) => {
  try {
    const { escuelas } = req.body;
    if (!Array.isArray(escuelas) || !escuelas.length) {
      return res.status(400).json({ mensaje: 'No se recibieron datos válidos' });
    }
    const result = await queries.importarEscuelas(escuelas);
    res.json({ mensaje: `${result.insertadas} escuela(s) importada(s)`, ...result });
  } catch (err) {
    console.error('POST /api/importar/escuelas:', err.message);
    res.status(500).json({ mensaje: `Error al importar escuelas: ${err.message}` });
  }
});

app.post('/api/importar/necesidades', authenticateToken, async (req, res) => {
  try {
    const { necesidades } = req.body;
    if (!Array.isArray(necesidades) || !necesidades.length) {
      return res.status(400).json({ mensaje: 'No se recibieron datos válidos' });
    }
    const result = await queries.importarPropuestas(necesidades);
    res.json({ mensaje: `${result.insertadas} necesidad(es) importada(s)`, ...result });
  } catch (err) {
    console.error('POST /api/importar/necesidades:', err.message);
    res.status(500).json({ mensaje: `Error al importar necesidades: ${err.message}` });
  }
});


const dbConfig = {
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'mi_escuela_primero',
  port:     parseInt(process.env.DB_PORT) || 3306,
};

initDatabase(dbConfig)
  .then(() => {
    app.listen(PORT, () => console.log(`Listening on Port: ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to initialize database:', err.message);
    process.exit(1);
  });
