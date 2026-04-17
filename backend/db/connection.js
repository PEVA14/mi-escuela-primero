const mysql = require('mysql2/promise');
require('dotenv').config();

// Single connection pool shared across the entire application.
// mysql2 pools are lazy — they don't connect until the first query is made,
// so it's safe to import this module before initDatabase() runs.
const pool = mysql.createPool({
  host:             process.env.DB_HOST,    
  user:             process.env.DB_USER,     
  password:         process.env.DB_PASSWORD,
  database:         process.env.DB_NAME,    
  port:             parseInt(process.env.DB_PORT) || 3306,
  ssl:              { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit:  10,
  decimalNumbers:   true,
});

module.exports = pool;
