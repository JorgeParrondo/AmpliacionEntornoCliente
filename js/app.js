// ======================================
// FUNCION AUXILIAR SEGURA PARA FETCH
// ======================================

async function safeFetch(url, options = {}) {
  const res = await fetch(url, options);

  // Leemos SIEMPRE como texto primero
  const raw = await res.text();

  let data;

  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error(raw); // Si no es JSON, mostramos el texto tal cual
  }

  if (!res.ok) {
    throw new Error(data.message || "Error en la petición");
  }

  return data;
}


// ======================================
// ================= SOCIOS =============
// ======================================

async function crearSocio() {
  try {
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;

    const data = await safeFetch("/socios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, telefono })
    });

    alert("Socio creado ID: " + data.id);

  } catch (error) {
    alert("Error: " + error.message);
  }
}

async function modificarSocio() {
  try {
    const telefono = document.getElementById("telefonoModificar").value;
    const nombre = document.getElementById("nuevoNombre").value;
    const email = document.getElementById("nuevoEmail").value;

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

async function consultarSocio() {
  try {
    const telefono = document.getElementById("telefonoConsulta").value;

    const data = await safeFetch("/socios/" + telefono);

    alert(JSON.stringify(data, null, 2));

  } catch (error) {
    alert("Error: " + error.message);
  }
}

// ======================================
// ================= LIBROS =============
// ======================================

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

async function buscarPorGenero() {
  try {
    const genero = document.getElementById("generoConsulta").value;

    const data = await safeFetch("/libros/genero/" + genero);

    alert(JSON.stringify(data, null, 2));

  } catch (error) {
    alert("Error: " + error.message);
  }
}

async function verDisponibilidad() {
  try {
    const titulo = document.getElementById("tituloDisponibilidad").value;

    const data = await safeFetch("/libros/disponible/" + titulo);

    alert(data.disponible ? "Disponible" : "No disponible");

  } catch (error) {
    alert("Error: " + error.message);
  }
}

function devolverLibro() {
  const telefono = document.getElementById("telefonoDevolucion").value;
  const titulo = document.getElementById("libroDevolucion").value;

  fetch("/devoluciones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telefono, titulo })
  })
    .then(r => r.json())
    .then(d => {
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

async function verPrestamos() {
  try {
    const telefono = document.getElementById("telefonoPrestamos").value;

    const data = await safeFetch("/prestamos/" + telefono);

    alert(JSON.stringify(data, null, 2));

  } catch (error) {
    alert("Error: " + error.message);
  }
}
