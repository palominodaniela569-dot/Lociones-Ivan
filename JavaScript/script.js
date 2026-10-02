// ==========================================
// PILLI AROMAS - script.js
// ==========================================

// ==========================================
// MENU MOVIL
// ==========================================

function activarMenuMovil() {
  const botonMenu = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");

  if (!botonMenu || !menu) return;

  botonMenu.addEventListener("click", () => {
    menu.classList.toggle("activo");
    botonMenu.classList.toggle("fa-bars");
    botonMenu.classList.toggle("fa-xmark");
  });
}

// ==========================================
// FILTROS POR CATEGORIA (hombres.html / mujeres.html)
// ==========================================

function activarFiltros() {
  const botones = document.querySelectorAll(".filtro-btn");
  if (!botones.length) return;

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      botones.forEach((b) => b.classList.remove("activo"));
      boton.classList.add("activo");

      const filtro = boton.dataset.filtro;
      const productos = document.querySelectorAll(".producto");

      productos.forEach((producto) => {
        if (filtro === "todos") {
          producto.style.display = "";
          return;
        }
        const categorias = (producto.dataset.categoria || "").split(" ");
        producto.style.display = categorias.includes(filtro) ? "" : "none";
      });
    });
  });
}

// ==========================================
// CARRITO DE COMPRAS (con cantidad)
// ==========================================

const CLAVE_CARRITO = "carrito";

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  actualizarContador();
}

// AGREGAR PRODUCTO (si ya existe, suma cantidad)
function agregarCarrito(nombre, imagen, precio, descripcion = "") {
  const carrito = obtenerCarrito();
  const existente = carrito.find((item) => item.nombre === nombre);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({
      nombre: nombre,
      imagen: imagen,
      precio: Number(precio),
      descripcion: descripcion,
      cantidad: 1,
    });
  }

  guardarCarrito(carrito);
  mostrarAviso(nombre + " agregado al carrito 🛒");
  mostrarCarrito();
}

// CAMBIAR CANTIDAD (+1 / -1)
function cambiarCantidad(index, delta) {
  const carrito = obtenerCarrito();
  const item = carrito[index];
  if (!item) return;

  item.cantidad += delta;

  if (item.cantidad <= 0) {
    carrito.splice(index, 1);
  }

  guardarCarrito(carrito);
  mostrarCarrito();
}

// ELIMINAR PRODUCTO
function eliminarProducto(index) {
  const carrito = obtenerCarrito();
  carrito.splice(index, 1);
  guardarCarrito(carrito);
  mostrarCarrito();
}

// ACTUALIZAR NUMERO DEL CARRITO (suma de cantidades, en todas las páginas)
function actualizarContador() {
  const carrito = obtenerCarrito();
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
  document.querySelectorAll("#contador-carrito").forEach((contador) => {
    contador.textContent = totalItems;
  });
}

// MOSTRAR PRODUCTOS EN carrito.html
function mostrarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalTexto = document.getElementById("total-carrito");

  if (!lista) return; // no estamos en carrito.html

  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    lista.innerHTML = `
      <p class="carrito-vacio">
        Tu carrito está vacío. Explora nuestra
        <a href="index.html">colección</a>.
      </p>
    `;
    if (totalTexto) totalTexto.textContent = "Total estimado: $0";
    return;
  }

  let total = 0;
  lista.innerHTML = "";

  carrito.forEach((producto, index) => {
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;

    lista.innerHTML += `
      <div class="item-carrito">

        <img src="${producto.imagen}" alt="${producto.nombre}">

        <div class="item-info">
          <h3>${producto.nombre}</h3>
          <p>$${producto.precio.toLocaleString("es-CO")} c/u</p>

          <div class="item-cantidad">
            <button class="cantidad-btn" onclick="cambiarCantidad(${index}, -1)">-</button>
            <span>${producto.cantidad}</span>
            <button class="cantidad-btn" onclick="cambiarCantidad(${index}, 1)">+</button>
          </div>
        </div>

        <div class="item-subtotal">
          $${subtotal.toLocaleString("es-CO")}
        </div>

        <button
          class="btn-eliminar"
          onclick="eliminarProducto(${index})">
          Eliminar
        </button>

      </div>
    `;
  });

  if (totalTexto) {
    totalTexto.textContent = "Total estimado: $" + total.toLocaleString("es-CO");
  }
}

// COMPRAR POR WHATSAPP
function comprarWhatsApp() {
  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  let mensaje = "Hola PILLI AROMAS, quiero realizar este pedido:%0A%0A";
  let total = 0;

  carrito.forEach((producto) => {
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;
    mensaje +=
      "- " +
      encodeURIComponent(producto.nombre) +
      " x" + producto.cantidad +
      ": $" + subtotal.toLocaleString("es-CO") +
      "%0A";
  });

  mensaje += "%0ATotal estimado: $" + total.toLocaleString("es-CO");
  mensaje += "%0A(Por favor confirmarme el valor final)";

  window.open("https://wa.me/573332524719?text=" + mensaje, "_blank");
}

// ==========================================
// AVISO VISUAL AL AGREGAR UN PRODUCTO
// ==========================================

function mostrarAviso(texto) {
  const aviso = document.createElement("div");
  aviso.className = "aviso-carrito";
  aviso.textContent = texto;
  document.body.appendChild(aviso);

  requestAnimationFrame(() => aviso.classList.add("visible"));

  setTimeout(() => {
    aviso.classList.remove("visible");
    setTimeout(() => aviso.remove(), 300);
  }, 2200);
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  activarMenuMovil();
  activarFiltros();
  actualizarContador();
  mostrarCarrito();
});