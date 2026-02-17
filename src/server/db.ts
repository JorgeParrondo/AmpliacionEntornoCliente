import sqlite3 from "sqlite3";

export const db = new sqlite3.Database("library.db");

export function initDB() {

  db.serialize(() => {

    // ================= TABLAS =================

    db.run(`
      CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL,
        telefono TEXT UNIQUE NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS books(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        genero TEXT NOT NULL,
        available INTEGER NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS loans(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        bookId INTEGER,
        fechaPrestamo TEXT,
        fechaLimite TEXT,
        fechaDevolucion TEXT,
        FOREIGN KEY(userId) REFERENCES users(id),
        FOREIGN KEY(bookId) REFERENCES books(id)
      )
    `);

    // ================= DATOS DE PRUEBA =================

    db.get("SELECT COUNT(*) as count FROM users", (err, row: any) => {
      if (row.count === 0) {

        console.log("Insertando datos de prueba...");

        // ---- Usuarios ----
        db.run(`INSERT INTO users(nombre,email,telefono) VALUES
          ('Juan Pérez','juan@test.com','1111'),
          ('Ana López','ana@test.com','2222')
        `);

        // ---- Libros ----
        db.run(`INSERT INTO books(titulo,genero,available) VALUES
          ('El Quijote','Novela',1),
          ('1984','Distopía',1),
          ('Clean Code','Programación',0),
          ('Cien Años de Soledad','Realismo mágico',1)
        `);

        // ---- Préstamos ----
        const fechaHoy = new Date();
        const fechaPasada = new Date();
        fechaPasada.setDate(fechaPasada.getDate() - 10);

        const fechaLimiteVencida = new Date();
        fechaLimiteVencida.setDate(fechaLimiteVencida.getDate() - 2);

        const fechaLimiteActiva = new Date();
        fechaLimiteActiva.setDate(fechaLimiteActiva.getDate() + 5);

        // Préstamo vencido
        db.run(`
          INSERT INTO loans(userId,bookId,fechaPrestamo,fechaLimite,fechaDevolucion)
          VALUES(1,3,'${fechaPasada.toISOString()}','${fechaLimiteVencida.toISOString()}',NULL)
        `);

        // Préstamo activo
        db.run(`
          INSERT INTO loans(userId,bookId,fechaPrestamo,fechaLimite,fechaDevolucion)
          VALUES(2,2,'${fechaHoy.toISOString()}','${fechaLimiteActiva.toISOString()}',NULL)
        `);

      }
    });

  });
}
