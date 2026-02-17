"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.initDB = initDB;
const sqlite3_1 = __importDefault(require("sqlite3"));
exports.db = new sqlite3_1.default.Database("library.db");
function initDB() {
    exports.db.serialize(() => {
        // ================= TABLAS =================
        exports.db.run(`
      CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL,
        telefono TEXT UNIQUE NOT NULL
      )
    `);
        exports.db.run(`
      CREATE TABLE IF NOT EXISTS books(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        genero TEXT NOT NULL,
        available INTEGER NOT NULL
      )
    `);
        exports.db.run(`
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
        exports.db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
            if (row.count === 0) {
                console.log("Insertando datos de prueba...");
                // ---- Usuarios ----
                exports.db.run(`INSERT INTO users(nombre,email,telefono) VALUES
          ('Juan Pérez','juan@test.com','1111'),
          ('Ana López','ana@test.com','2222')
        `);
                // ---- Libros ----
                exports.db.run(`INSERT INTO books(titulo,genero,available) VALUES
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
                exports.db.run(`
          INSERT INTO loans(userId,bookId,fechaPrestamo,fechaLimite,fechaDevolucion)
          VALUES(1,3,'${fechaPasada.toISOString()}','${fechaLimiteVencida.toISOString()}',NULL)
        `);
                // Préstamo activo
                exports.db.run(`
          INSERT INTO loans(userId,bookId,fechaPrestamo,fechaLimite,fechaDevolucion)
          VALUES(2,2,'${fechaHoy.toISOString()}','${fechaLimiteActiva.toISOString()}',NULL)
        `);
            }
        });
    });
}
