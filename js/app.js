//Como typescript no trabaja directamente con el navegador, utilizamos app.js para
//hacer peticiones con fetch al servidor y recupera los datos para mostrarlos en un alert
async function safeFetch(url, options = {}) {

  // Realiza la petición al servidor
  const res = await fetch(url, options);

  // Leemos siempre la respuesta como texto primero
  // Esto evita errores si el servidor devuelve texto en vez de JSON
  const raw = await res.text();

  let data;

  try {
    // Intentamos convertir la respuesta a JSON
    // Si no hay contenido, devolvemos un objeto vacío
    data = raw ? JSON.parse(raw) : {};
  } catch {
    // Si falla el JSON no es valido, mostramos directamente el texto recibido
    throw new Error(raw);
  }

  // Si el código HTTP no es correcto (400, 404, 500...)
  // lanzamos un error con el mensaje recibido
  if (!res.ok) {
    throw new Error(data.message || "Error en la petición");
  }

  // Si todo va bien, devolvemos los datos
  return data;
}


// ======================================
// ================= SOCIOS =============
// ======================================

// Crea un nuevo socio enviando los datos al backend
async function crearSocio() {
  try {
    // Obtenemos valores del formulario
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;

    // Enviamos petición POST al servidor
    const data = await safeFetch("/socios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, telefono })
    });

    // Mostramos el ID generado
    alert("Socio creado ID: " + data.id);

  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Modifica los datos de un socio existente
async function modificarSocio() {
  try {
    const telefono = document.getElementById("telefonoModificar").value;
    const nombre = document.getElementById("nuevoNombre").value;
    const email = document.getElementById("nuevoEmail").value;

    // Petición PUT para actualizar datos
    const data = await safeFetch("/socios/" + telefono, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email })
    });

    alert(data.message);

  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Consulta un socio por teléfono
async function consultarSocio() {
  try {
    const telefono = document.getElementById("telefonoConsulta").value;

    // Petición GET
    const data = await safeFetch("/socios/" + telefono);

    // Mostramos los datos formateados
    alert(JSON.stringify(data, null, 2));

  } catch (error) {
    alert("Error: " + error.message);
  }
}


// ======================================
// ================= LIBROS =============
// ======================================

// Crea un nuevo libro
async function crearLibro() {
  try {
    const titulo = document.getElementById("titulo").value;
    const genero = document.getElementById("genero").value;

    const data = await safeFetch("/libros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, genero })
    });

    alert("Libro ID: " + data.id);

  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Busca libros por género
async function buscarPorGenero() {
  try {
    const genero = document.getElementById("generoConsulta").value;

    const data = await safeFetch("/libros/genero/" + genero);

    alert(JSON.stringify(data, null, 2));

  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Consulta si un libro está disponible
async function verDisponibilidad() {
  try {
    const titulo = document.getElementById("tituloDisponibilidad").value;

    const data = await safeFetch("/libros/disponible/" + titulo);

    // Mostramos mensaje según disponibilidad
    alert(data.disponible ? "Disponible" : "No disponible");

  } catch (error) {
    alert("Error: " + error.message);
  }
}


// ======================================
// ============= DEVOLUCIONES ===========
// ======================================

// Devuelve un libro previamente prestado
function devolverLibro() {

  // Obtenemos datos del formulario
  const telefono = document.getElementById("telefonoDevolucion").value;
  const titulo = document.getElementById("libroDevolucion").value;

  // Enviamos petición POST al endpoint de devoluciones
  fetch("/devoluciones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telefono, titulo })
  })
    .then(r => r.json()) // Convertimos respuesta a JSON
    .then(d => {
      // Si el backend devuelve error
      if (d.error) {
        alert("Error: " + d.message);
      } else {
        alert("Libro devuelto correctamente");
      }
    })
    .catch(err => alert("Error: " + err));
}


// ======================================
// =============== PRESTAMOS ============
// ======================================

// Crea un nuevo préstamo
async function crearPrestamo() {
  try {
    const telefono = document.getElementById("telefonoPrestamo").value;
    const titulo = document.getElementById("libroPrestamo").value;
    const fechaLimite = document.getElementById("fechaLimite").value;

    const data = await safeFetch("/prestamos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telefono, titulo, fechaLimite })
    });

    alert("Préstamo ID: " + data.id);

  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Muestra todos los préstamos de un socio
async function verPrestamos() {
  try {
    const telefono = document.getElementById("telefonoPrestamos").value;

    const data = await safeFetch("/prestamos/" + telefono);

    alert(JSON.stringify(data, null, 2));

  } catch (error) {
    alert("Error: " + error.message);
  }
}
