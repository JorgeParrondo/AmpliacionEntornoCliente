DROP DATABASE IF EXISTS biblioteca;

CREATE DATABASE biblioteca;
USE biblioteca;

-- =========================
-- CREACIÓN DE TABLAS
-- =========================

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL
);

CREATE TABLE libros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    genero VARCHAR(50) NOT NULL,
    disponible BOOLEAN DEFAULT TRUE
);

CREATE TABLE prestamos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    libro_id INT NOT NULL,
    fecha_prestamo DATE NOT NULL,
    fecha_devolucion DATE NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (libro_id) REFERENCES libros(id) ON DELETE CASCADE
);

-- =========================
-- INSERCIONES
-- =========================

INSERT INTO usuarios (nombre, email) VALUES
('Carlos Martínez', 'carlos.martinez@email.com'),
('Laura Gómez', 'laura.gomez@email.com'),
('David Sánchez', 'david.sanchez@email.com'),
('Ana Torres', 'ana.torres@email.com'),
('Miguel Fernández', 'miguel.fernandez@email.com');

INSERT INTO libros (titulo, autor, genero, disponible) VALUES
('1984', 'George Orwell', 'Distopía', TRUE),
('Cien años de soledad', 'Gabriel García Márquez', 'Realismo mágico', FALSE),
('El Hobbit', 'J.R.R. Tolkien', 'Fantasía', FALSE),
('Don Quijote de la Mancha', 'Miguel de Cervantes', 'Clásico', TRUE),
('La Sombra del Viento', 'Carlos Ruiz Zafón', 'Misterio', TRUE),
('Clean Code', 'Robert C. Martin', 'Programación', FALSE),
('El Principito', 'Antoine de Saint-Exupéry', 'Infantil', TRUE);

INSERT INTO prestamos (usuario_id, libro_id, fecha_prestamo, fecha_devolucion) VALUES
-- Préstamo activo
(1, 2, '2026-02-01', NULL),

-- Préstamo devuelto
(2, 5, '2026-01-10', '2026-01-20'),

-- Préstamo activo
(3, 3, '2026-02-08', NULL),

-- Préstamo antiguo devuelto
(4, 1, '2025-12-01', '2025-12-15'),

-- Préstamo activo
(5, 6, '2026-02-05', NULL);
