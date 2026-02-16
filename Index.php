<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Gestión de Biblioteca</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>

<header>
    <h1>Biblioteca Ernesto y Jorge</h1>
</header>

<nav>
    <button data-section="libros">Libros</button>
    <button data-section="usuarios">Usuarios</button>
    <button data-section="prestamos">Préstamos</button>
    <button data-section="consultas">Consultas</button>
</nav>

<main>

    <!-- SECCIÓN LIBROS -->
    <section id="libros" class="section">
        <h2>Gestión de Libros</h2>

        <form id="formLibro" method="get" action="AccesoDatos.php">
            <input type="text" placeholder="Título" required>
            <input type="text" placeholder="Autor" required>
            <input type="text" placeholder="Género" required>
            <button type="submit">Añadir Libro</button>
        </form>
    </section>

    <!-- SECCIÓN USUARIOS -->
    <section id="usuarios" class="section hidden">
        <h2>Gestión de Usuarios</h2>

        <form id="formUsuario">
            <input type="text" placeholder="Nombre" required>
            <input type="email" placeholder="Email" required>
            <button type="submit">Añadir Usuario</button>
        </form>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody id="tablaUsuarios">
            </tbody>
        </table>
    </section>

    <!-- SECCIÓN PRÉSTAMOS -->
    <section id="prestamos" class="section hidden">
        <h2>Gestión de Préstamos</h2>

        <form id="formPrestamo">
            <input type="number" placeholder="ID Usuario" required>
            <input type="number" placeholder="ID Libro" required>
            <input type="date" required>
            <button type="submit">Registrar Préstamo</button>
        </form>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Libro</th>
                    <th>Fecha Préstamo</th>
                    <th>Fecha Devolución</th>
                </tr>
            </thead>
            <tbody id="tablaPrestamos">
            </tbody>
        </table>
    </section>

    <!-- SECCIÓN CONSULTAS -->
    <section id="consultas" class="section hidden">
        <h2>Consultas</h2>

        <div class="consultas-container">
            <button>Libros por Género</button>
            <button>Préstamos Vencidos</button>
            <button>Préstamos No Vencidos</button>
            <button>Histórico por Usuario</button>
        </div>

        <div id="resultadoConsulta"></div>
    </section>

</main>

<footer>
    <p>Proyecto DAW - Gestión Biblioteca</p>
</footer>

<script src="dist/main.js"></script>

</body>
</html>
