document.addEventListener("DOMContentLoaded", () => {
    actualizarCarrito();

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            const producto = {
                nombre: button.dataset.nombre,
                precio: Number(button.dataset.precio),
                imagen: button.dataset.imagen || "",
                cantidad: 1
            };

            let carrito = JSON.parse(localStorage.getItem("carritoSanMarcos")) || [];
            const existente = carrito.find(p => p.nombre === producto.nombre);

            if (existente) existente.cantidad++;
            else carrito.push(producto);

            localStorage.setItem("carritoSanMarcos", JSON.stringify(carrito));
            actualizarCarrito();

            const original = button.innerHTML;
            button.innerHTML = '<i class="bi bi-check-lg"></i> Agregado';
            setTimeout(() => button.innerHTML = original, 900);
        });
    });

    const buscarProducto = document.getElementById("buscarProducto");
    const filtroProducto = document.getElementById("filtroProducto");

    if (buscarProducto || filtroProducto) {
        const filtrarProductos = () => {
            const texto = (buscarProducto?.value || "").toLowerCase();
            const categoria = filtroProducto?.value || "";

            document.querySelectorAll(".product-item").forEach(item => {
                const contenido = item.textContent.toLowerCase();
                const coincideTexto = contenido.includes(texto);
                const coincideCategoria = !categoria || item.dataset.category === categoria;
                item.style.display = coincideTexto && coincideCategoria ? "" : "none";
            });
        };
        buscarProducto?.addEventListener("input", filtrarProductos);
        filtroProducto?.addEventListener("change", filtrarProductos);
    }

    const buscarServicio = document.getElementById("buscarServicio");
    const filtroServicio = document.getElementById("filtroServicio");

    if (buscarServicio || filtroServicio) {
        const filtrarServicios = () => {
            const texto = (buscarServicio?.value || "").toLowerCase();
            const categoria = filtroServicio?.value || "";

            document.querySelectorAll(".service-row").forEach(row => {
                const contenido = row.textContent.toLowerCase();
                const coincideTexto = contenido.includes(texto);
                const coincideCategoria = !categoria || row.dataset.category === categoria;
                row.style.display = coincideTexto && coincideCategoria ? "" : "none";
            });
        };
        buscarServicio?.addEventListener("input", filtrarServicios);
        filtroServicio?.addEventListener("change", filtrarServicios);
    }

    const formLogin = document.getElementById("formLogin");
    if (formLogin) {
        formLogin.addEventListener("submit", e => {
            e.preventDefault();
            alert("Inicio de sesión simulado correctamente.");
            window.location.href = "index.html";
        });
    }

    const formRegistro = document.getElementById("formRegistro");
    if (formRegistro) {
        formRegistro.addEventListener("submit", e => {
            e.preventDefault();
            const clave = document.getElementById("clave").value;
            const clave2 = document.getElementById("clave2").value;

            if (clave !== clave2) {
                alert("Las contraseñas no coinciden.");
                return;
            }

            alert("Registro simulado correctamente.");
            window.location.href = "login.html";
        });
    }

    renderizarCarrito();
});

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carritoSanMarcos")) || [];
}

function actualizarCarrito() {
    const carrito = obtenerCarrito();
    const cantidad = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    document.querySelectorAll(".cart-number").forEach(el => el.textContent = cantidad);
}

function renderizarCarrito() {
    const contenedor = document.getElementById("carritoContenido");
    if (!contenedor) return;

    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="empty-cart">
                <i class="bi bi-cart3"></i>
                <h3 class="mt-3 fw-bold">Tu carrito está vacío</h3>
                <p class="text-secondary">Agrega productos desde nuestro catálogo.</p>
                <a href="productos.html" class="btn btn-success">Ver productos</a>
            </div>`;
        return;
    }

    let total = 0;

    const items = carrito.map((producto, indice) => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        return `
        <div class="cart-item">
            <div class="row align-items-center g-3">
                <div class="col-md-5">
                    <div class="d-flex align-items-center gap-3">
                        <div class="cart-item-image">
                            ${producto.imagen ? `<img src="${producto.imagen}" alt="${producto.nombre}">` : `<i class="bi bi-capsule"></i>`}
                        </div>
                        <div>
                            <strong>${producto.nombre}</strong>
                            <small class="d-block text-secondary">$${formatear(producto.precio)} c/u</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">$${formatear(producto.precio)}</div>
                <div class="col-md-3">
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-outline-success btn-sm" onclick="cambiarCantidad(${indice},-1)">−</button>
                        <strong>${producto.cantidad}</strong>
                        <button class="btn btn-outline-success btn-sm" onclick="cambiarCantidad(${indice},1)">+</button>
                    </div>
                </div>
                <div class="col-md-2 text-md-end">
                    <strong>$${formatear(subtotal)}</strong>
                    <button class="btn btn-outline-danger btn-sm ms-2" onclick="eliminarProducto(${indice})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>`;
    }).join("");

    contenedor.innerHTML = `
        <div class="cart-panel">
            <div class="row fw-bold border-bottom pb-3 d-none d-md-flex">
                <div class="col-md-5">Producto</div>
                <div class="col-md-2">Precio</div>
                <div class="col-md-3">Cantidad</div>
                <div class="col-md-2 text-end">Subtotal</div>
            </div>
            ${items}
            <div class="row justify-content-end mt-4">
                <div class="col-md-5">
                    <div class="border rounded-4 p-4">
                        <div class="d-flex justify-content-between mb-3">
                            <span>Total</span>
                            <strong class="fs-4 text-success">$${formatear(total)}</strong>
                        </div>
                        <button class="btn btn-success w-100" onclick="finalizarCompra()">Finalizar compra</button>
                        <button class="btn btn-outline-danger w-100 mt-2" onclick="vaciarCarrito()">Vaciar carrito</button>
                    </div>
                </div>
            </div>
        </div>`;
}

function cambiarCantidad(indice, cambio) {
    const carrito = obtenerCarrito();
    carrito[indice].cantidad += cambio;
    if (carrito[indice].cantidad <= 0) carrito.splice(indice, 1);
    localStorage.setItem("carritoSanMarcos", JSON.stringify(carrito));
    actualizarCarrito();
    renderizarCarrito();
}

function eliminarProducto(indice) {
    const carrito = obtenerCarrito();
    carrito.splice(indice, 1);
    localStorage.setItem("carritoSanMarcos", JSON.stringify(carrito));
    actualizarCarrito();
    renderizarCarrito();
}

function vaciarCarrito() {
    localStorage.removeItem("carritoSanMarcos");
    actualizarCarrito();
    renderizarCarrito();
}

function finalizarCompra() {
    alert("Compra simulada correctamente. ¡Gracias por confiar en San Marcos!");
    vaciarCarrito();
}

function formatear(numero) {
    return new Intl.NumberFormat("es-CL").format(numero);
}
