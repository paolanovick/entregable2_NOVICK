// Array de paquetes turísticos
const paquetesTuristicos = [
  {
    id: 1,
    nombre: "Escapada a la playa",
    descripcion:
      "Disfrutá de una semana de sol y arena en las mejores playas del país.",
    precio: 299.99,
    imagen: "images/cruta.jpg",
    fechas: { desde: "2025-01-01", hasta: "2025-12-31" },
  },
  {
    id: 2,
    nombre: "Aventura en la montaña",
    descripcion:
      "Explorá los paisajes más imponentes y hacé trekking en plena naturaleza.",
    precio: 399.99,
    imagen: "images/rocas.webp",
    fechas: { desde: "2025-01-01", hasta: "2025-12-31" },
  },
  {
    id: 3,
    nombre: "Recorrido cultural en la ciudad",
    descripcion:
      "Conocé museos, historia y gastronomía en una escapada urbana.",
    precio: 199.99,
    imagen: "images/ruta2.jpg",
    fechas: { desde: "2025-01-01", hasta: "2025-12-31" },
  },
  {
    id: 4,
    nombre: "Safari en la selva",
    descripcion: "Viví la aventura con guías expertos y fauna exótica.",
    precio: 499.99,
    imagen: "images/unnamed.jpg",
    fechas: { desde: "2025-01-01", hasta: "2025-12-31" },
  },
];

// DOM elements
const contenedor = document.getElementById("cards-container");
const input = document.getElementById("buscador");
const btnBuscar = document.getElementById("buscar-btn");
const fechaDesdeInput = document.getElementById("fechaDesde");
const fechaHastaInput = document.getElementById("fechaHasta");
const cantidadInput = document.getElementById("cantidadPaquetes");

// Obtener carrito de localStorage o crear uno nuevo
function obtenerCarrito() {
  let carrito = JSON.parse(localStorage.getItem("carrito"));
  if (!carrito) {
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
  return carrito;
}

// Guardar carrito actualizado
function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Agregar paquete al carrito con cantidad elegida
function agregarAlCarrito(paquete, cantidadElegida = 1) {
  const carrito = obtenerCarrito();
  const index = carrito.findIndex((item) => item.id === paquete.id);

  if (index !== -1) {
    carrito[index].cantidad += cantidadElegida;
  } else {
    carrito.push({ ...paquete, cantidad: cantidadElegida });
  }

  guardarCarrito(carrito);
  mostrarTarjetaConfirmacion(paquete, cantidadElegida);
}

// Mostrar tarjeta de confirmación de compra (con la imagen)
function mostrarTarjetaConfirmacion(paquete, cantidad) {
  const tarjeta = document.getElementById("tarjeta-compra");
  tarjeta.innerHTML = `
    <h2>Has agregado un viaje a ${paquete.nombre}</h2>
    <div class="imagen-producto">
      <img src="${paquete.imagen}" alt="${paquete.nombre}" />
    </div>
    <p>Precio unitario: $${paquete.precio}</p>
    <p>Cantidad: ${cantidad}</p>
    <p><strong>Total: $${(paquete.precio * cantidad).toFixed(2)}</strong></p>
    <a href="carrito.html"><button>Ver carrito completo</button></a>
  `;
  tarjeta.classList.remove("oculto");
}


// Mostrar paquetes filtrados
function mostrarPaquete(nombre, fechaDesde, fechaHasta) {
  contenedor.innerHTML = "";

  const paquetesFiltrados = paquetesTuristicos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(nombre.toLowerCase()) &&
      (!fechaDesde || new Date(p.fechas.hasta) >= new Date(fechaDesde)) &&
      (!fechaHasta || new Date(p.fechas.desde) <= new Date(fechaHasta))
  );

  if (paquetesFiltrados.length > 0) {
    paquetesFiltrados.forEach((p) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <img src="${p.imagen}" alt="${p.nombre}">
        <div class="card-content">
          <h3>${p.nombre}</h3>
          <p>${p.descripcion}</p>
          <p><strong>Precio:</strong> $${p.precio}</p>
          <button id="btnAgregar${p.id}">Agregar al carrito</button>
        </div>
      `;
      contenedor.appendChild(card);

           document
             .getElementById(`btnAgregar${p.id}`)
             .addEventListener("click", () => {
               const cantidad = parseInt(cantidadInput.value) || 1;
               agregarAlCarrito(p, cantidad);
             });

           // 👉 Agregar botón "SEGUIR COMPRANDO"
           const seguirBtn = document.createElement("button");
           seguirBtn.textContent = "SEGUIR COMPRANDO";
           seguirBtn.className = "btn-seguir";
           seguirBtn.addEventListener("click", () => {
             location.href = "index.html"; // cambia si querés ir a otro lugar
           });
           card.appendChild(seguirBtn);

    });
  } else {
    contenedor.innerHTML =
      "<p>No se encontró el paquete solicitado para esas fechas.</p>";
  }
}

// Buscar con botón
btnBuscar.addEventListener("click", () => {
  const nombre = input.value.trim();
  const fechaDesde = fechaDesdeInput.value;
  const fechaHasta = fechaHastaInput.value;

  if (nombre || fechaDesde || fechaHasta) {
    mostrarPaquete(nombre, fechaDesde, fechaHasta);
  } else {
    contenedor.innerHTML =
      "<p>Por favor, ingrese un nombre o fechas para buscar.</p>";
  }
});
