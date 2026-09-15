let cart = [];

const grid = document.getElementById("productGrid");
const search = document.getElementById("searchInput");
const cartButton = document.getElementById("cartButton");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

function money(value) {
  return value == null
    ? "Consultar precio"
    : `S/ ${value.toFixed(2)}`;
}


/* =========================
   MOSTRAR PRODUCTOS
========================= */

function renderProducts(list = PRODUCTS) {
  if (!grid) return;

  grid.innerHTML = "";

  list.forEach(p => {

    const card = document.createElement("article");
    card.className = "product-card";

    const benefitsHTML = p.benefits
      ? `
        <div class="product-section">
          <h4>Beneficios</h4>
          <ul>
            ${p.benefits.map(item => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      `
      : "";

    const ingredientsHTML = p.ingredients
      ? `
        <div class="product-section">
          <h4>Ingredientes destacados</h4>
          <ul>
            ${p.ingredients.map(item => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      `
      : "";

    const idealForHTML = p.idealFor
      ? `
        <div class="product-section">
          <h4>Ideal para</h4>
          <p>${p.idealFor}</p>
        </div>
      `
      : "";

    const featuresHTML = p.features
      ? `
        <div class="product-section">
          <h4>Características</h4>
          <ul>
            ${p.features.map(item => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      `
      : "";

    card.innerHTML = `
      <div class="product-image">
        <span class="badge">${p.badge || ""}</span>

        <img
          src="${p.image}"
          alt="${p.brand} ${p.name}"
          loading="lazy"
        >
      </div>

      <div class="product-info">

        <div class="brand">${p.brand}</div>

        <h3>${p.name}</h3>

        <div class="size">${p.size}</div>

        <div class="price-row">
          <strong>${money(p.price)}</strong>
        </div>

        ${
          p.description
            ? `
              <div class="product-description">
                <h4>Descripción</h4>
                <p>${p.description}</p>
              </div>
            `
            : ""
        }

        ${benefitsHTML}

        ${ingredientsHTML}

        ${idealForHTML}

        ${featuresHTML}

        <button
          class="product-btn"
          onclick="addToCart(${p.id})"
        >
          ${
            p.price == null
              ? "Consultar producto"
              : "Agregar al carrito"
          }
        </button>

      </div>
    `;

    grid.appendChild(card);
  });
}


/* =========================
   AGREGAR AL CARRITO
========================= */

function addToCart(id) {

  const product = PRODUCTS.find(
    p => p.id === id
  );

  if (!product) return;

  const existing = cart.find(
    item => item.id === id
  );

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      ...product,
      qty: 1
    });
  }

  renderCart();

  if (cartDrawer) {
    cartDrawer.classList.add("open");
  }
}


/* =========================
   CAMBIAR CANTIDAD
========================= */

function changeQty(id, delta) {

  const item = cart.find(
    p => p.id === id
  );

  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    cart = cart.filter(
      p => p.id !== id
    );
  }

  renderCart();
}


/* =========================
   MOSTRAR CARRITO
========================= */

function renderCart() {

  if (
    !cartItems ||
    !cartCount ||
    !cartTotal
  ) {
    return;
  }

  cartCount.textContent =
    cart.reduce(
      (sum, p) => sum + p.qty,
      0
    );

  if (!cart.length) {

    cartItems.innerHTML = `
      <div class="empty-cart">
        Tu carrito está vacío.
      </div>
    `;

    cartTotal.textContent =
      "Consultar";

    return;
  }

  cartItems.innerHTML =
    cart.map(item => `

      <div class="cart-item">

        <img
          src="${item.image}"
          alt=""
        >

        <div>

          <b>${item.name}</b>

          <small>${item.size}</small>

          <div class="qty">

            <button
              onclick="changeQty(${item.id}, -1)"
            >
              −
            </button>

            <span>${item.qty}</span>

            <button
              onclick="changeQty(${item.id}, 1)"
            >
              +
            </button>

          </div>

        </div>

      </div>

    `).join("");


  const hasUnknownPrice =
    cart.some(
      p => p.price == null
    );


  if (hasUnknownPrice) {

    cartTotal.textContent =
      "Consultar precio";

  } else {

    const total =
      cart.reduce(
        (sum, p) =>
          sum + p.price * p.qty,
        0
      );

    cartTotal.textContent =
      money(total);
  }
}


/* =========================
   CATEGORÍAS
========================= */

document
  .querySelectorAll(".category-chip")
  .forEach(chip => {

    chip.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".category-chip")
          .forEach(c =>
            c.classList.remove("active")
          );

        chip.classList.add("active");

        const cat =
          chip.dataset.category;

        if (cat === "Todos") {

          renderProducts(PRODUCTS);

        } else {

          renderProducts(
            PRODUCTS.filter(
              p => p.category === cat
            )
          );

        }

      }
    );

  });


/* =========================
   BUSCADOR
========================= */

if (search) {

  search.addEventListener(
    "input",
    e => {

      const q =
        e.target.value
          .toLowerCase()
          .trim();

      renderProducts(

        PRODUCTS.filter(p =>

          `${p.brand}
           ${p.name}
           ${p.category}
           ${p.description || ""}
           ${(p.benefits || []).join(" ")}
           ${(p.ingredients || []).join(" ")}`
            .toLowerCase()
            .includes(q)

        )

      );

    }
  );

}


/* =========================
   ABRIR CARRITO
========================= */

if (cartButton) {

  cartButton.addEventListener(
    "click",
    () => {

      if (cartDrawer) {
        cartDrawer.classList.add(
          "open"
        );
      }

    }
  );

}


/* =========================
   CERRAR CARRITO
========================= */

if (closeCart) {

  closeCart.addEventListener(
    "click",
    () => {

      if (cartDrawer) {
        cartDrawer.classList.remove(
          "open"
        );
      }

    }
  );

}


/* =========================
   OVERLAY
========================= */

const overlay =
  document.getElementById("overlay");

if (overlay) {

  overlay.addEventListener(
    "click",
    () => {

      if (cartDrawer) {
        cartDrawer.classList.remove(
          "open"
        );
      }

    }
  );

}


/* =========================
   BOTÓN CONSULTAR
========================= */

const consultButton =
  document.getElementById(
    "consultButton"
  );

if (consultButton) {

  consultButton.addEventListener(
    "click",
    () => {

      alert(
        "Los precios y el stock se mostrarán aquí próximamente. También podremos conectar WhatsApp cuando confirmes tu número."
      );

    }
  );

}


/* =========================
   INICIAR TIENDA
========================= */

renderProducts();
renderCart();
