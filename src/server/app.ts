import express from 'express';
import { db, initDB } from './db';
import { Socio } from '../Clases/Socio';
import { Libro } from '../Clases/Libro';
import { Prestamo } from '../Clases/Prestamo';
import { Devolucion } from '../Clases/Devolucion';

const app = express();
app.use(express.json());

initDB();


// =====================
//      SOCIOS
// =====================

app.post('/socios', (req, res) => {

    const { nombre, email, telefono } = req.body;

    if (!nombre || !email || !telefono)
        return res.status(400).send("Datos incompletos");

    db.run(
        'INSERT INTO users(name,email) VALUES(?,?)',
        [nombre, email],
        function (err) {

            if (err) return res.status(500).send(err);

            const socio = new Socio(this.lastID, nombre, email, telefono);
            res.send(socio);
        }
    );
});

app.get('/socios/:id', (req, res) => {

    db.get('SELECT * FROM users WHERE id=?',
        [req.params.id],
        (err, row: any) => {

            if (!row) return res.status(404).send("Socio no encontrado");

            const socio = new Socio(row.id, row.name, row.email, "");
            res.send(socio);
        });
});


// =====================
//      LIBROS
// =====================

app.post('/libros', (req, res) => {

    const { titulo, autor, genero } = req.body;

    db.run(
        'INSERT INTO books(title,genre,available) VALUES(?,?,1)',
        [titulo, genero],
        function (err) {

            if (err) return res.status(500).send(err);

            const libro = new Libro(this.lastID, titulo, autor, genero, true);
            res.send(libro);
        });
});

app.get('/libros/:id', (req, res) => {

    db.get('SELECT * FROM books WHERE id=?',
        [req.params.id],
        (err, row: any) => {

            if (!row) return res.status(404).send("Libro no encontrado");

            const libro = new Libro(
                row.id,
                row.title,
                "",
                row.genre,
                row.available === 1
            );

            res.send(libro);
        });
});


// =====================
//      PRESTAMOS
// =====================

app.post('/prestamos', (req, res) => {

    const { socioId, libroId, fechaLimite } = req.body;

    db.get('SELECT * FROM users WHERE id=?', [socioId], (e1, socioRow: any) => {

        if (!socioRow) return res.status(404).send("Socio no encontrado");

        const socio = new Socio(socioRow.id, socioRow.name, socioRow.email, "");

        db.get('SELECT * FROM books WHERE id=?', [libroId], (e2, libroRow: any) => {

            if (!libroRow) return res.status(404).send("Libro no encontrado");

            if (libroRow.available === 0)
                return res.status(400).send("Libro no disponible");

            const libro = new Libro(
                libroRow.id,
                libroRow.title,
                "",
                libroRow.genre,
                false
            );

            const fechaPrestamo = new Date();

            db.run(
                `INSERT INTO loans(userId,bookId,fechaPrestamo,fechaLimite,fechaDevolucion)
                 VALUES(?,?,?,?,NULL)`,
                [socioId, libroId, fechaPrestamo.toISOString(), fechaLimite],
                function (err) {

                    db.run('UPDATE books SET available=0 WHERE id=?', [libroId]);

                    const prestamo = new Prestamo(
                        this.lastID,
                        socio,
                        libro,
                        fechaPrestamo,
                        new Date(fechaLimite),
                        null
                    );

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

    db.get('SELECT * FROM loans WHERE id=?',
        [req.params.id],
        (err, loanRow: any) => {

            if (!loanRow) return res.status(404).send("Prestamo no encontrado");

            db.get('SELECT * FROM users WHERE id=?',
                [loanRow.userId],
                (e1, socioRow: any) => {

                    db.get('SELECT * FROM books WHERE id=?',
                        [loanRow.bookId],
                        (e2, libroRow: any) => {

                            const socio = new Socio(socioRow.id, socioRow.name, socioRow.email, "");

                            const libro = new Libro(
                                libroRow.id,
                                libroRow.title,
                                "",
                                libroRow.genre,
                                true
                            );

                            const prestamo = new Prestamo(
                                loanRow.id,
                                socio,
                                libro,
                                new Date(loanRow.fechaPrestamo),
                                new Date(loanRow.fechaLimite),
                                fechaDevolucion
                            );

                            db.run(
                                'UPDATE loans SET fechaDevolucion=? WHERE id=?',
                                [fechaDevolucion.toISOString(), req.params.id]
                            );

                            db.run(
                                'UPDATE books SET available=1 WHERE id=?',
                                [libroRow.id]
                            );

                            const devolucion = new Devolucion(
                                Date.now(),
                                prestamo,
                                fechaDevolucion
                            );

                            res.send(devolucion);
                        });
                });
        });
});


app.listen(3000, () => console.log("Server running"));
