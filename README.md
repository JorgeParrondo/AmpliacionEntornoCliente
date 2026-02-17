##AUTORES: Jorge Parrondo, Ernesto Ramirez.

Aplicación web para la gestión de una biblioteca desarrollada con TypeScript, Node.js, Express y SQLite.

Permite gestionar socios, libros y préstamos mediante una API REST y una interfaz web sencilla.
-->Tecnologías utilizadas

  TypeScript – Lenguaje principal del backend.

  Node.js – Entorno de ejecución.

  Express – Framework para crear la API REST.

  SQLite – Base de datos ligera para la persistencia.

  HTML + CSS + JavaScript – Frontend.

  GitHub – Control de versiones del proyecto.

ESTRUCTURA DEL PROYECTO
BIBLIOTECA-APP
│
├── css/
│   └── styles.css
│
├── dist/                # Código compilado de TypeScript a JavaScript
│   ├── Clases/
│   ├── server/
│   └── Tipos/
│
├── js/
│   └── app.js           # Lógica del frontend (peticiones fetch)
│
├── node_modules/
│
├── src/                 # Código fuente en TypeScript
│   ├── Clases/
│   │   ├── Devolucion.ts
│   │   ├── Libro.ts
│   │   ├── Prestamo.ts
│   │   └── Socio.ts
│   │
│   ├── server/         #TODO EL MANEJO DE LA BBDD
│   │   ├── app.ts  
│   │   └── db.ts
│   │
│   └── Tipos/
│
├── Index.html           # Interfaz principal
├── library.db           # Base de datos SQLite
├── package.json
├── package-lock.json
└── tsconfig.json
