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
  return value == null ? "Consultar precio" : `S/ ${value.toFixed(2)}`;
}

function renderProducts(list = PRODUCTS) {
  grid.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image">
        <span class="badge">${p.badge}</span>
        <img src="${p.image}" alt="${p.brand} ${p.name}" loading="lazy">
      </div>
      <div class="product-info">
        <div class="brand">${p.brand}</div>
        <h3>${p.name}</h3>
        <div class="size">${p.size}</div>
        <div class="price-row">
          <strong>${money(p.price)}</strong>
        </div>
        <button class="product-btn" onclick="addToCart(${p.id})">
          ${p.price == null ? "Consultar producto" : "Agregar al carrito"}
        </button>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) existing.qty += 1;
  else cart.push({...product, qty: 1});
  renderCart();
  cartDrawer.classList.add("open");
}

function changeQty(id, delta) {
  const item = cart.find(p => p.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(p => p.id !== id);
  renderCart();
}

function renderCart() {
  cartCount.textContent = cart.reduce((sum, p) => sum + p.qty, 0);
  if (!cart.length) {
    cartItems.innerHTML = `<div class="empty-cart">Tu carrito está vacío.</div>`;
    cartTotal.textContent = "Consultar";
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="">
      <div>
        <b>${item.name}</b>
        <small>${item.size}</small>
        <div class="qty">
          <button onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
    </div>
  `).join("");

  cartTotal.textContent = cart.some(p => p.price == null)
    ? "Consultar precio"
    : money(cart.reduce((sum, p) => sum + p.price * p.qty, 0));
}

document.querySelectorAll(".category-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".category-chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    const cat = chip.dataset.category;
    renderProducts(cat === "Todos" ? PRODUCTS : PRODUCTS.filter(p => p.category === cat));
  });
});

search.addEventListener("input", e => {
  const q = e.target.value.toLowerCase().trim();
  renderProducts(PRODUCTS.filter(p =>
    `${p.brand} ${p.name} ${p.category}`.toLowerCase().includes(q)
  ));
});

cartButton.addEventListener("click", () => cartDrawer.classList.add("open"));
closeCart.addEventListener("click", () => cartDrawer.classList.remove("open"));
document.getElementById("overlay").addEventListener("click", () => cartDrawer.classList.remove("open"));

document.getElementById("consultButton").addEventListener("click", () => {
  alert("Los precios y el stock se mostrarán aquí próximamente. También podremos conectar WhatsApp cuando confirmes tu número.");
});

renderProducts();
renderCart();
