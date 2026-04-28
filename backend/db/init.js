const mysql = require("mysql2/promise");

async function initDatabase(config){
    const connection = await mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        port: config.port,
        ssl: {rejectUnauthorized: false}
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);
    await connection.query(`USE \`${config.database}\`;`);

    try{
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Municipio(
                id_municipio INT AUTO_INCREMENT PRIMARY KEY,
                nombre_municipio VARCHAR(100) NOT NULL UNIQUE
            ); 
        `);
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Administrador(
                id_admin INT AUTO_INCREMENT PRIMARY KEY,
                correo VARCHAR(150) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL
            );
        `);
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Categoria (
                id_categoria INT AUTO_INCREMENT PRIMARY KEY,
                nombre_categoria VARCHAR(100) NOT NULL UNIQUE
            );
        `);
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Subcategoria(
                id_subcategoria INT AUTO_INCREMENT PRIMARY KEY,
                nombre_subcategoria VARCHAR(100) NOT NULL,
                id_categoria INT,
                FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria)
                ON DELETE CASCADE ON UPDATE CASCADE
            );
        `)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Modalidad (
                id_modalidad INT AUTO_INCREMENT PRIMARY KEY,
                nombre_modalidad VARCHAR(100) NOT NULL UNIQUE
            );
            `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Turno (
                id_turno INT AUTO_INCREMENT PRIMARY KEY,
                nombre_turno VARCHAR(50) NOT NULL UNIQUE
            );
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Sostenimiento (
                id_sostenimiento INT AUTO_INCREMENT PRIMARY KEY,
                nombre_sostenimiento VARCHAR(50) NOT NULL UNIQUE
            );
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS NivelEducativo (
                id_nivelEducativo INT AUTO_INCREMENT PRIMARY KEY,
                nombre_nivelEducativo VARCHAR(100) NOT NULL UNIQUE
            );
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS EstadoPropuesta (
                id_estadoPropuesta INT AUTO_INCREMENT PRIMARY KEY,
                nombre_estado VARCHAR(50) NOT NULL UNIQUE
            );
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Unidad (
                id_unidad INT AUTO_INCREMENT PRIMARY KEY,
                nombre_unidad VARCHAR(50) NOT NULL UNIQUE
            );
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Escuela (
                id_escuela INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(150) NOT NULL,
                plantel VARCHAR(100),
                direccion VARCHAR(255),
                ubicacion VARCHAR(255),
                cct VARCHAR(20),
                personal_escolar INT,
                estudiantes INT,
                id_municipio INT,
                id_modalidad INT,
                id_turno INT,
                id_sostenimiento INT,
                FOREIGN KEY (id_municipio) REFERENCES Municipio(id_municipio)
                ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (id_modalidad) REFERENCES Modalidad(id_modalidad)
                ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (id_turno) REFERENCES Turno(id_turno)
                ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (id_sostenimiento) REFERENCES Sostenimiento(id_sostenimiento)
                ON DELETE SET NULL ON UPDATE CASCADE
            );
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Escuela_NivelEducativo (
                id_escuela INT,
                id_nivelEducativo INT,
                PRIMARY KEY (id_escuela, id_nivelEducativo),
                FOREIGN KEY (id_escuela) REFERENCES Escuela(id_escuela)
                ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (id_nivelEducativo) REFERENCES NivelEducativo(id_nivelEducativo)
                ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Propuesta (
                id_propuesta INT AUTO_INCREMENT PRIMARY KEY,
                propuesta VARCHAR(255) NOT NULL,
                cantidad INT,
                detalles TEXT,
                id_escuela INT,
                id_subcategoria INT,
                id_estadoPropuesta INT,
                id_unidad INT,
                FOREIGN KEY (id_escuela) REFERENCES Escuela(id_escuela)
                ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (id_subcategoria) REFERENCES Subcategoria(id_subcategoria)
                ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (id_estadoPropuesta) REFERENCES EstadoPropuesta(id_estadoPropuesta)
                ON UPDATE CASCADE,
                FOREIGN KEY (id_unidad) REFERENCES Unidad(id_unidad)
                ON UPDATE CASCADE
            );
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS RespuestaFormulario (
                id_respuesta INT AUTO_INCREMENT PRIMARY KEY,
                nombre_donate VARCHAR(150),
                correo VARCHAR(150),
                telefono VARCHAR(20),
                instancia_donante VARCHAR(150),
                nombre_instancia VARCHAR(150),
                municipio_donante VARCHAR(150),
                tipo_donacion VARCHAR(255),
                cantidad VARCHAR(50),
                detalles TEXT,
                mensaje TEXT,
                id_escuela INT NULL,
                id_propuesta INT NULL,
                fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_escuela) REFERENCES Escuela(id_escuela)
                ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (id_propuesta) REFERENCES Propuesta(id_propuesta)
                ON DELETE SET NULL ON UPDATE CASCADE
            );
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS FotosEscuelas (
                id_foto     INT AUTO_INCREMENT PRIMARY KEY,
                foto_nombre VARCHAR(255),
                foto_mime   VARCHAR(100),
                foto_data   MEDIUMBLOB NOT NULL,
                id_escuela  INT,
                FOREIGN KEY (id_escuela) REFERENCES Escuela(id_escuela)
                ON DELETE CASCADE ON UPDATE CASCADE
            );
        `);

        const [existingCols] = await connection.query(`
            SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME   = 'FotosEscuelas'
        `);
        const colNames = existingCols.map(r => r.COLUMN_NAME);

        if (!colNames.includes('foto_nombre'))
            await connection.query(`ALTER TABLE FotosEscuelas ADD COLUMN foto_nombre VARCHAR(255)`);
        if (!colNames.includes('foto_mime'))
            await connection.query(`ALTER TABLE FotosEscuelas ADD COLUMN foto_mime VARCHAR(100)`);
        if (!colNames.includes('foto_data'))
            await connection.query(`ALTER TABLE FotosEscuelas ADD COLUMN foto_data MEDIUMBLOB`);
        if (colNames.includes('foto_link'))
            await connection.query(`ALTER TABLE FotosEscuelas DROP COLUMN foto_link`);

        await connection.query(`DELETE FROM FotosEscuelas WHERE foto_data IS NULL`);

    console.log("Database was successfully created :DDD");
    }catch(err){
        console.error("Database couldn't be initialized: ", err);
    } finally{
        await connection.end();
    }
}
module.exports = initDatabase;
