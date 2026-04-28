/**
 * Run once to create the first admin user:
 *   node crear-admin.js admin@ejemplo.com MiContraseña123
 */
require('dotenv').config();
const mysql   = require('mysql2/promise');
const bcrypt  = require('bcryptjs');

const [,, correo, password] = process.argv;

if (!correo || !password) {
  console.error('Uso: node crear-admin.js <correo> <contraseña>');
  process.exit(1);
}

(async () => {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'mi_escuela_primero',
    port:     parseInt(process.env.DB_PORT) || 3306,
    ssl: { rejectUnauthorized: false },
  });

  const hash = await bcrypt.hash(password, 10);
  await conn.query(
    'INSERT INTO Administrador (correo, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = ?',
    [correo.toLowerCase(), hash, hash]
  );
  console.log(`✓ Admin "${correo}" creado/actualizado correctamente.`);
  await conn.end();
})();
