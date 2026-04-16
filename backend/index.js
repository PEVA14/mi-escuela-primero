require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const jwt     = require('jsonwebtoken');

const initDatabase = require('./db/init');
const queries      = require('./db/queries');

const app        = express();
const PORT       = process.env.PORT       || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'pachandini';

app.use(cors());
app.use(express.json());


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


app.get('/api/escuelas', async (req, res) => {
  const escuelas = await queries.getAllEscuelas();
  res.json(escuelas);
});

app.get('/api/escuelas/:id', async (req, res) => {
  const escuela = await queries.getEscuelaById(parseInt(req.params.id));
  if (!escuela) return res.status(404).json({ mensaje: 'Escuela no encontrada' });
  res.json(escuela);
});

app.post('/api/escuelas', authenticateToken, async (req, res) => {
  const id     = await queries.createEscuela(req.body);
  const nueva  = await queries.getEscuelaById(id);
  res.status(201).json({ mensaje: 'Escuela registrada con éxito', escuela: nueva });
});

app.put('/api/escuelas/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id);
  const existe = await queries.getEscuelaById(id);
  if (!existe) return res.status(404).json({ mensaje: 'Escuela no encontrada' });
  await queries.updateEscuela(id, req.body);
  const actualizada = await queries.getEscuelaById(id);
  res.json({ mensaje: 'Escuela actualizada', escuela: actualizada });
});

app.delete('/api/escuelas/:id', authenticateToken, async (req, res) => {
  const id = parseInt(req.params.id);
  const existe = await queries.getEscuelaById(id);
  if (!existe) return res.status(404).json({ mensaje: 'Escuela no encontrada' });
  await queries.deleteEscuela(id);
  res.json({ mensaje: 'Escuela eliminada con éxito', id });
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
  const { escuelas } = req.body;
  if (!Array.isArray(escuelas) || !escuelas.length) {
    return res.status(400).json({ mensaje: 'No se recibieron datos válidos' });
  }
  const result = await queries.importarEscuelas(escuelas);
  res.json({ mensaje: `${result.insertadas} escuela(s) importada(s)`, ...result });
});

app.post('/api/importar/necesidades', authenticateToken, async (req, res) => {
  const { necesidades } = req.body;
  if (!Array.isArray(necesidades) || !necesidades.length) {
    return res.status(400).json({ mensaje: 'No se recibieron datos válidos' });
  }
  const result = await queries.importarPropuestas(necesidades);
  res.json({ mensaje: `${result.insertadas} necesidad(es) importada(s)`, ...result });
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
