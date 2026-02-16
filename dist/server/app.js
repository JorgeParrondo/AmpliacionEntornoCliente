"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const Socio_1 = require("../Clases/Socio");
const Libro_1 = require("../Clases/Libro");
const Prestamo_1 = require("../Clases/Prestamo");
const Devolucion_1 = require("../Clases/Devolucion");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, db_1.initDB)();
// =====================
//      SOCIOS
// =====================
app.post('/socios', (req, res) => {
    const { nombre, email, telefono } = req.body;
    if (!nombre || !email || !telefono)
        return res.status(400).send("Datos incompletos");
    db_1.db.run('INSERT INTO users(name,email) VALUES(?,?)', [nombre, email], function (err) {
        if (err)
            return res.status(500).send(err);
        const socio = new Socio_1.Socio(this.lastID, nombre, email, telefono);
        res.send(socio);
    });
});
app.get('/socios/:id', (req, res) => {
    db_1.db.get('SELECT * FROM users WHERE id=?', [req.params.id], (err, row) => {
        if (!row)
            return res.status(404).send("Socio no encontrado");
        const socio = new Socio_1.Socio(row.id, row.name, row.email, "");
        res.send(socio);
    });
});
// =====================
//      LIBROS
// =====================
app.post('/libros', (req, res) => {
    const { titulo, autor, genero } = req.body;
    db_1.db.run('INSERT INTO books(title,genre,available) VALUES(?,?,1)', [titulo, genero], function (err) {
        if (err)
            return res.status(500).send(err);
        const libro = new Libro_1.Libro(this.lastID, titulo, autor, genero, true);
        res.send(libro);
    });
});
app.get('/libros/:id', (req, res) => {
    db_1.db.get('SELECT * FROM books WHERE id=?', [req.params.id], (err, row) => {
        if (!row)
            return res.status(404).send("Libro no encontrado");
        const libro = new Libro_1.Libro(row.id, row.title, "", row.genre, row.available === 1);
        res.send(libro);
    });
});
// =====================
//      PRESTAMOS
// =====================
app.post('/prestamos', (req, res) => {
    const { socioId, libroId, fechaLimite } = req.body;
    db_1.db.get('SELECT * FROM users WHERE id=?', [socioId], (e1, socioRow) => {
        if (!socioRow)
            return res.status(404).send("Socio no encontrado");
        const socio = new Socio_1.Socio(socioRow.id, socioRow.name, socioRow.email, "");
        db_1.db.get('SELECT * FROM books WHERE id=?', [libroId], (e2, libroRow) => {
            if (!libroRow)
                return res.status(404).send("Libro no encontrado");
            if (libroRow.available === 0)
                return res.status(400).send("Libro no disponible");
            const libro = new Libro_1.Libro(libroRow.id, libroRow.title, "", libroRow.genre, false);
            const fechaPrestamo = new Date();
            db_1.db.run(`INSERT INTO loans(userId,bookId,fechaPrestamo,fechaLimite,fechaDevolucion)
                 VALUES(?,?,?,?,NULL)`, [socioId, libroId, fechaPrestamo.toISOString(), fechaLimite], function (err) {
                db_1.db.run('UPDATE books SET available=0 WHERE id=?', [libroId]);
                const prestamo = new Prestamo_1.Prestamo(this.lastID, socio, libro, fechaPrestamo, new Date(fechaLimite), null);
                res.send(prestamo);
            });
        });
    });
});
// =====================
//      DEVOLUCION
// =====================
app.post('/devoluciones/:id', (req, res) => {
    const fechaDevolucion = new Date();
    db_1.db.get('SELECT * FROM loans WHERE id=?', [req.params.id], (err, loanRow) => {
        if (!loanRow)
            return res.status(404).send("Prestamo no encontrado");
        db_1.db.get('SELECT * FROM users WHERE id=?', [loanRow.userId], (e1, socioRow) => {
            db_1.db.get('SELECT * FROM books WHERE id=?', [loanRow.bookId], (e2, libroRow) => {
                const socio = new Socio_1.Socio(socioRow.id, socioRow.name, socioRow.email, "");
                const libro = new Libro_1.Libro(libroRow.id, libroRow.title, "", libroRow.genre, true);
                const prestamo = new Prestamo_1.Prestamo(loanRow.id, socio, libro, new Date(loanRow.fechaPrestamo), new Date(loanRow.fechaLimite), fechaDevolucion);
                db_1.db.run('UPDATE loans SET fechaDevolucion=? WHERE id=?', [fechaDevolucion.toISOString(), req.params.id]);
                db_1.db.run('UPDATE books SET available=1 WHERE id=?', [libroRow.id]);
                const devolucion = new Devolucion_1.Devolucion(Date.now(), prestamo, fechaDevolucion);
                res.send(devolucion);
            });
        });
    });
});
app.listen(3000, () => console.log("Server running"));
