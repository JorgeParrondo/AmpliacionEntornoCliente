/* =====================================================
   IMPORTACIONES
===================================================== */

// Framework principal para crear el servidor HTTP
import express from "express";

// Permite que el frontend pueda hacer peticiones al backend
import cors from "cors";

// Base de datos SQLite y función de inicialización
import { db, initDB } from "./db";

// Clases del modelo
import { Socio } from "../Clases/Socio";
import { Libro } from "../Clases/Libro";
import { Prestamo } from "../Clases/Prestamo";

// Para servir archivos estáticos (HTML)
import path from "path";

/* =====================================================
   CONFIGURACIÓN INICIAL DEL SERVIDOR
===================================================== */

const app = express();

// Habilita CORS
app.use(cors());

// Permite recibir JSON en las peticiones
app.use(express.json());

// Sirve archivos estáticos (por ejemplo index.html)
app.use(express.static(path.join(__dirname, "../../")));

// Inicializa la base de datos y crea tablas si no existen
initDB();

/* =====================================================
   FUNCIÓN AUXILIAR PARA RESPUESTAS DE ERROR
   Centraliza el manejo de errores para evitar repetir código
===================================================== */

function handleError(res: any, error: any, status = 500) {
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
    db.run(
      "INSERT INTO users(nombre,email,telefono) VALUES(?,?,?)",
      [nombre, email, telefono],
      function (err) {

        if (err) return handleError(res, err, 400);

        // Se crea el objeto Socio con el id generado
        const socio = new Socio(this.lastID, nombre, email, telefono);

        return res.json(socio);
      }
    );

  } catch (error) {
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

    db.run(
      "UPDATE users SET nombre=?, email=? WHERE telefono=?",
      [nombre, email, telefono],
      function (err) {

        if (err) return handleError(res, err);

        if (this.changes === 0)
          return handleError(res, "Socio no encontrado", 404);

        return res.json({ message: "Socio actualizado correctamente" });
      }
    );

  } catch (error) {
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

    db.get(
      "SELECT * FROM users WHERE telefono=?",
      [req.params.telefono],
      function (err, row: any) {

        if (err) return handleError(res, err);

        if (!row) return handleError(res, "No encontrado", 404);

        const socio = new Socio(row.id, row.nombre, row.email, row.telefono);

        return res.json(socio);
      }
    );

  } catch (error) {
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

    db.run(
      "INSERT INTO books(titulo,genero,available) VALUES(?,?,1)",
      [titulo, genero],
      function (err) {

        if (err) return handleError(res, err, 400);

        const libro = new Libro(this.lastID, titulo, genero, true);

        return res.json(libro);
      }
    );

  } catch (error) {
    return handleError(res, error);
  }
});

/* =====================================================
   CONSULTAR LIBROS POR GÉNERO
   Endpoint: GET /libros/genero/:genero
===================================================== */

app.get("/libros/genero/:genero", async (req, res) => {
  try {

    db.all(
      "SELECT * FROM books WHERE genero=?",
      [req.params.genero],
      function (err, rows: any[]) {

        if (err) return handleError(res, err);

        const libros = rows.map(
          row => new Libro(row.id, row.titulo, row.genero, row.available === 1)
        );

        return res.json(libros);
      }
    );

  } catch (error) {
    return handleError(res, error);
  }
});

/* =====================================================
   CONSULTAR DISPONIBILIDAD DE UN LIBRO
   Endpoint: GET /libros/disponible/:titulo
===================================================== */

app.get("/libros/disponible/:titulo", async (req, res) => {
  try {

    db.get(
      "SELECT * FROM books WHERE titulo=?",
      [req.params.titulo],
      function (err, row: any) {

        if (err) return handleError(res, err);

        if (!row) return handleError(res, "Libro no encontrado", 404);

        return res.json({
          titulo: row.titulo,
          disponible: row.available === 1
        });
      }
    );

  } catch (error) {
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
    db.get("SELECT * FROM users WHERE telefono=?", [telefono], function (e1, user: any) {

      if (e1) return handleError(res, e1);
      if (!user) return handleError(res, "Socio no encontrado", 404);

      // Buscar libro
      db.get("SELECT * FROM books WHERE titulo=?", [titulo], function (e2, book: any) {

        if (e2) return handleError(res, e2);
        if (!book) return handleError(res, "Libro no encontrado", 404);

        if (book.available === 0)
          return handleError(res, "Libro no disponible", 400);

        const fechaPrestamo = new Date();

        db.run(
          `INSERT INTO loans(userId,bookId,fechaPrestamo,fechaLimite,fechaDevolucion)
           VALUES(?,?,?,?,NULL)`,
          [
            user.id,
            book.id,
            fechaPrestamo.toISOString(),
            new Date(fechaLimite).toISOString()
          ],
          function (err) {

            if (err) return handleError(res, err);

            // Marcar libro como no disponible
            db.run("UPDATE books SET available=0 WHERE id=?", [book.id]);

            const prestamo = new Prestamo(
              this.lastID,
              user.id,
              book.id,
              fechaPrestamo,
              new Date(fechaLimite),
              null
            );

            return res.json(prestamo);
          }
        );

      });
    });

  } catch (error) {
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

    db.get("SELECT * FROM users WHERE telefono=?", [req.params.telefono], function (e1, user: any) {

      if (e1) return handleError(res, e1);
      if (!user) return handleError(res, "Socio no encontrado", 404);

      db.all("SELECT * FROM loans WHERE userId=?", [user.id], function (e2, loans: any[]) {

        if (e2) return handleError(res, e2);

        const prestamos = loans.map(
          loan =>
            new Prestamo(
              loan.id,
              loan.userId,
              loan.bookId,
              loan.fechaPrestamo,
              loan.fechaLimite,
              loan.fechaDevolucion
            )
        );

        return res.json(prestamos);
      });

    });

  } catch (error) {
    return handleError(res, error);
  }
});
/* =====================================================
   DEVOLVER LIBRO
===================================================== */

app.post("/devoluciones", (req, res) => {
  try {
    const { telefono, titulo } = req.body;

    if (!telefono || !titulo) {
      return res.status(400).json({
        error: true,
        message: "Datos incompletos"
      });
    }

    db.get(
      "SELECT * FROM users WHERE telefono=?",
      [telefono],
      (errUser: any, user: any) => {

        if (errUser) {
          return res.status(500).json({ error: true, message: errUser.message });
        }

        if (!user) {
          return res.status(404).json({
            error: true,
            message: "Socio no encontrado"
          });
        }

        db.get(
          "SELECT * FROM books WHERE titulo=?",
          [titulo],
          (errBook: any, book: any) => {

            if (errBook) {
              return res.status(500).json({ error: true, message: errBook.message });
            }

            if (!book) {
              return res.status(404).json({
                error: true,
                message: "Libro no encontrado"
              });
            }

            db.get(
              `SELECT * FROM loans 
               WHERE userId=? AND bookId=? AND fechaDevolucion IS NULL`,
              [user.id, book.id],
              (errLoan: any, loan: any) => {

                if (errLoan) {
                  return res.status(500).json({ error: true, message: errLoan.message });
                }

                if (!loan) {
                  return res.status(400).json({
                    error: true,
                    message: "No existe préstamo activo"
                  });
                }

                const fechaDevolucion = new Date().toISOString();

                db.run(
                  "UPDATE loans SET fechaDevolucion=? WHERE id=?",
                  [fechaDevolucion, loan.id],
                  function (errUpdate: any) {

                    if (errUpdate) {
                      return res.status(500).json({
                        error: true,
                        message: errUpdate.message
                      });
                    }

                    db.run(
                      "UPDATE books SET available=1 WHERE id=?",
                      [book.id]
                    );

                    return res.json({
                      message: "Libro devuelto correctamente"
                    });
                  }
                );
              }
            );
          }
        );
      }
    );

  } catch (error: any) {
    return res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

/* =====================================================
   MIDDLEWARE GLOBAL DE ERRORES
   Captura cualquier error no manejado
===================================================== */

app.use((err: any, req: any, res: any, next: any) => {
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

