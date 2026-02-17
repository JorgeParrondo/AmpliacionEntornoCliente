"use strict";
/* =====================================================
   IMPORTACIONES
===================================================== */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Framework principal para crear el servidor HTTP
const express_1 = __importDefault(require("express"));
// Permite que el frontend pueda hacer peticiones al backend
const cors_1 = __importDefault(require("cors"));
// Base de datos SQLite y función de inicialización
const db_1 = require("./db");
// Clases del modelo
const Socio_1 = require("../Clases/Socio");
const Libro_1 = require("../Clases/Libro");
const Prestamo_1 = require("../Clases/Prestamo");
// Para servir archivos estáticos (HTML)
const path_1 = __importDefault(require("path"));
/* =====================================================
   CONFIGURACIÓN INICIAL DEL SERVIDOR
===================================================== */
const app = (0, express_1.default)();
// Habilita CORS
app.use((0, cors_1.default)());
// Permite recibir JSON en las peticiones
app.use(express_1.default.json());
// Sirve archivos estáticos (por ejemplo index.html)
app.use(express_1.default.static(path_1.default.join(__dirname, "../../")));
// Inicializa la base de datos y crea tablas si no existen
(0, db_1.initDB)();
/* =====================================================
   FUNCIÓN AUXILIAR PARA RESPUESTAS DE ERROR
   Centraliza el manejo de errores para evitar repetir código
===================================================== */
function handleError(res, error, status = 500) {
    return res.status(status).json({
        error: true,
        message: error?.message || error
    });
}
/* =====================================================
   CREAR SOCIO
   Endpoint: POST /socios
   Recibe: nombre, email, telefono
   Inserta un nuevo socio en la base de datos
===================================================== */
app.post("/socios", async (req, res) => {
    try {
        const { nombre, email, telefono } = req.body;
        // Validación básica
        if (!nombre || !email || !telefono) {
            return handleError(res, "Todos los campos son obligatorios", 400);
        }
        // Inserta en la tabla users
        db_1.db.run("INSERT INTO users(nombre,email,telefono) VALUES(?,?,?)", [nombre, email, telefono], function (err) {
            if (err)
                return handleError(res, err, 400);
            // Se crea el objeto Socio con el id generado
            const socio = new Socio_1.Socio(this.lastID, nombre, email, telefono);
            return res.json(socio);
        });
    }
    catch (error) {
        return handleError(res, error);
    }
});
/* =====================================================
   MODIFICAR SOCIO
   Endpoint: PUT /socios/:telefono
   Modifica nombre y email de un socio existente
===================================================== */
app.put("/socios/:telefono", async (req, res) => {
    try {
        const { nombre, email } = req.body;
        const { telefono } = req.params;
        if (!nombre || !email) {
            return handleError(res, "Nombre y email son obligatorios", 400);
        }
        db_1.db.run("UPDATE users SET nombre=?, email=? WHERE telefono=?", [nombre, email, telefono], function (err) {
            if (err)
                return handleError(res, err);
            if (this.changes === 0)
                return handleError(res, "Socio no encontrado", 404);
            return res.json({ message: "Socio actualizado correctamente" });
        });
    }
    catch (error) {
        return handleError(res, error);
    }
});
/* =====================================================
   CONSULTAR SOCIO
   Endpoint: GET /socios/:telefono
   Devuelve los datos de un socio por teléfono
===================================================== */
app.get("/socios/:telefono", async (req, res) => {
    try {
        db_1.db.get("SELECT * FROM users WHERE telefono=?", [req.params.telefono], function (err, row) {
            if (err)
                return handleError(res, err);
            if (!row)
                return handleError(res, "No encontrado", 404);
            const socio = new Socio_1.Socio(row.id, row.nombre, row.email, row.telefono);
            return res.json(socio);
        });
    }
    catch (error) {
        return handleError(res, error);
    }
});
/* =====================================================
   CREAR LIBRO
   Endpoint: POST /libros
   Crea un libro nuevo y lo marca como disponible
===================================================== */
app.post("/libros", async (req, res) => {
    try {
        const { titulo, genero } = req.body;
        if (!titulo || !genero) {
            return handleError(res, "Titulo y genero son obligatorios", 400);
        }
        db_1.db.run("INSERT INTO books(titulo,genero,available) VALUES(?,?,1)", [titulo, genero], function (err) {
            if (err)
                return handleError(res, err, 400);
            const libro = new Libro_1.Libro(this.lastID, titulo, genero, true);
            return res.json(libro);
        });
    }
    catch (error) {
        return handleError(res, error);
    }
});
/* =====================================================
   CONSULTAR LIBROS POR GÉNERO
   Endpoint: GET /libros/genero/:genero
===================================================== */
app.get("/libros/genero/:genero", async (req, res) => {
    try {
        db_1.db.all("SELECT * FROM books WHERE genero=?", [req.params.genero], function (err, rows) {
            if (err)
                return handleError(res, err);
            const libros = rows.map(row => new Libro_1.Libro(row.id, row.titulo, row.genero, row.available === 1));
            return res.json(libros);
        });
    }
    catch (error) {
        return handleError(res, error);
    }
});
/* =====================================================
   CONSULTAR DISPONIBILIDAD DE UN LIBRO
   Endpoint: GET /libros/disponible/:titulo
===================================================== */
app.get("/libros/disponible/:titulo", async (req, res) => {
    try {
        db_1.db.get("SELECT * FROM books WHERE titulo=?", [req.params.titulo], function (err, row) {
            if (err)
                return handleError(res, err);
            if (!row)
                return handleError(res, "Libro no encontrado", 404);
            return res.json({
                titulo: row.titulo,
                disponible: row.available === 1
            });
        });
    }
    catch (error) {
        return handleError(res, error);
    }
});
/* =====================================================
   CREAR PRÉSTAMO
   Endpoint: POST /prestamos
   Verifica socio y libro
   Si el libro está disponible:
   - Crea el préstamo
   - Marca el libro como no disponible
===================================================== */
app.post("/prestamos", async (req, res) => {
    try {
        const { telefono, titulo, fechaLimite } = req.body;
        if (!telefono || !titulo || !fechaLimite) {
            return handleError(res, "Datos incompletos", 400);
        }
        // Buscar socio
        db_1.db.get("SELECT * FROM users WHERE telefono=?", [telefono], function (e1, user) {
            if (e1)
                return handleError(res, e1);
            if (!user)
                return handleError(res, "Socio no encontrado", 404);
            // Buscar libro
            db_1.db.get("SELECT * FROM books WHERE titulo=?", [titulo], function (e2, book) {
                if (e2)
                    return handleError(res, e2);
                if (!book)
                    return handleError(res, "Libro no encontrado", 404);
                if (book.available === 0)
                    return handleError(res, "Libro no disponible", 400);
                const fechaPrestamo = new Date();
                db_1.db.run(`INSERT INTO loans(userId,bookId,fechaPrestamo,fechaLimite,fechaDevolucion)
           VALUES(?,?,?,?,NULL)`, [
                    user.id,
                    book.id,
                    fechaPrestamo.toISOString(),
                    new Date(fechaLimite).toISOString()
                ], function (err) {
                    if (err)
                        return handleError(res, err);
                    // Marcar libro como no disponible
                    db_1.db.run("UPDATE books SET available=0 WHERE id=?", [book.id]);
                    const prestamo = new Prestamo_1.Prestamo(this.lastID, user.id, book.id, fechaPrestamo, new Date(fechaLimite), null);
                    return res.json(prestamo);
                });
            });
        });
    }
    catch (error) {
        return handleError(res, error);
    }
});
/* =====================================================
   VER PRÉSTAMOS DE UN SOCIO
   Endpoint: GET /prestamos/:telefono
   Devuelve todos los préstamos de un usuario
===================================================== */
app.get("/prestamos/:telefono", async (req, res) => {
    try {
        db_1.db.get("SELECT * FROM users WHERE telefono=?", [req.params.telefono], function (e1, user) {
            if (e1)
                return handleError(res, e1);
            if (!user)
                return handleError(res, "Socio no encontrado", 404);
            db_1.db.all("SELECT * FROM loans WHERE userId=?", [user.id], function (e2, loans) {
                if (e2)
                    return handleError(res, e2);
                const prestamos = loans.map(loan => new Prestamo_1.Prestamo(loan.id, loan.userId, loan.bookId, loan.fechaPrestamo, loan.fechaLimite, loan.fechaDevolucion));
                return res.json(prestamos);
            });
        });
    }
    catch (error) {
        return handleError(res, error);
    }
});
/* =====================================================
   MIDDLEWARE GLOBAL DE ERRORES
   Captura cualquier error no manejado
===================================================== */
app.use((err, req, res, next) => {
    console.error("Error no controlado:", err);
    res.status(500).json({
        error: true,
        message: err.message || "Error interno del servidor"
    });
});
/* =====================================================
   INICIO DEL SERVIDOR
===================================================== */
app.listen(3000, () => {
    console.log("Servidor funcionando en http://localhost:3000");
});
