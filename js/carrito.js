// Obtener carrito desde localStorage
function obtenerCarrito() {
  let carrito = JSON.parse(localStorage.getItem("carrito"));
  if (!carrito) {
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }
  return carrito;
}

// Mostrar los productos en el carrito
function mostrarCarrito() {
  const carrito = obtenerCarrito();
  const cartItemsContainer = document.getElementById("cart-items");
  const totalAmount = document.getElementById("total-amount");

  // Si el carrito está vacío
  if (carrito.length === 0) {
    cartItemsContainer.innerHTML = "<p>No hay productos en tu carrito.</p>";
    document.getElementById("carrito-vacio").style.display = "block";
    document.getElementById("finalizar-compra").disabled = true;
    return;
  } else {
    document.getElementById("carrito-vacio").style.display = "none";
    document.getElementById("finalizar-compra").disabled = false;
  }

  // Limpiar contenedor de productos
  cartItemsContainer.innerHTML = "";

  let total = 0;

  carrito.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");
    itemElement.innerHTML = `
    <div class="card-content">
    <img src="${item.imagen}" alt="${item.nombre}" />
    
      <h3>${item.nombre}</h3>
      <p>Precio: $${item.precio}</p>
      <p>Cantidad: ${item.cantidad}</p>
      <p><strong>Total: $${(item.precio * item.cantidad).toFixed(
        2
      )}</strong></p>
      <button class="btn-eliminar" data-id="${item.id}">Eliminar</button>
    </div>
  `;
    cartItemsContainer.appendChild(itemElement);

    total += item.precio * item.cantidad;

    // Agregar evento para eliminar producto
    itemElement.querySelector(".btn-eliminar").addEventListener("click", () => {
      eliminarDelCarrito(item.id);
    });
  });

  // Mostrar total
  totalAmount.textContent = total.toFixed(2);
}

// Eliminar producto del carrito
function eliminarDelCarrito(id) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter((item) => item.id !== id);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito(); // Actualizamos la vista del carrito
}

document.getElementById("finalizar-compra").addEventListener("click", () => {
  const carrito = obtenerCarrito(); // Asegúrate de que esta función obtenga el carrito desde el localStorage o una variable global
  const mensajeError = document.getElementById("mensaje-error");

  // Si el carrito tiene productos, proceder con la compra
  if (carrito.length > 0) {
    localStorage.removeItem("carrito"); // Limpiar carrito después de la compra
    mostrarCompraExitosa(); // Mostrar mensaje de compra exitosa
    mensajeError.style.display = "none";
    setTimeout(() => {
      location.href = "index.html";
    }, 3000);
  } else {
    // Si el carrito está vacío, mostrar el mensaje de error
    mensajeError.textContent =
      "Tu carrito está vacío. No puedes finalizar la compra."; // Agregar el mensaje
    mensajeError.style.display = "block"; // Mostrar el mensaje
  }
});




function mostrarCompraExitosa() {
  const exitoDiv = document.getElementById("compra-exitosa");
   exitoDiv.innerHTML = "";
  exitoDiv.classList.remove("oculto");

  // Mensaje personalizado
  const mensaje = document.createElement("p");
  mensaje.textContent = "¡Gracias por tu compra! Esperamos verte pronto.";
  mensaje.style.fontWeight = "bold";
  mensaje.style.marginBottom = "1em";
  exitoDiv.appendChild(mensaje);

  // Crear botón de volver al inicio
  const volverBtn = document.createElement("button");
  volverBtn.textContent = "VOLVER AL INICIO";
  volverBtn.className = "btn-volver";

  // Limpia el carrito y redirige
  volverBtn.addEventListener("click", () => {
    localStorage.removeItem("carrito"); // Limpia el carrito
    location.href = "index.html"; // Redirige
  });

  exitoDiv.appendChild(volverBtn);

  document.getElementById("finalizar-compra").style.display = "none";
  document.getElementById("cart-items").innerHTML = "";
  document.getElementById("total-amount").textContent = "0.00";
}

// Cargar carrito al cargar la página
document.addEventListener("DOMContentLoaded", mostrarCarrito);
