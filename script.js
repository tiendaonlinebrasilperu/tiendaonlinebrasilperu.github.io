let cart=JSON.parse(localStorage.getItem("cart_mse")||"[]");
const money=n=>`S/ ${n.toFixed(2)}`;
function save(){localStorage.setItem("cart_mse",JSON.stringify(cart));}
function renderProducts(){
  const q=(document.getElementById("search").value||"").toLowerCase();
  const c=document.getElementById("cat").value;
  const list=PRODUCTS.filter(p=>(!q||(p.name+" "+p.brand+" "+p.category).toLowerCase().includes(q))&&(!c||p.category===c));
  document.getElementById("products").innerHTML=list.map(p=>`
  <article class="product">
    <div class="product-img">${p.image?`<img src="${p.image}" alt="${p.name}" onerror="this.style.display='none';this.parentElement.innerHTML='📦<br>Foto del producto'">`:"📦<br>Foto del producto"}</div>
    <div class="product-body"><div class="brand">${p.brand}</div><h3>${p.name}</h3><div><span class="price">${money(p.price)}</span>${p.oldPrice?`<span class="old">${money(p.oldPrice)}</span>`:""}</div><button class="btn primary add" onclick="add(${p.id})">Agregar al carrito</button></div>
  </article>`).join("")||"<p>No encontramos productos.</p>";
}
function add(id){const p=PRODUCTS.find(x=>x.id===id);const i=cart.find(x=>x.id===id);if(i)i.qty++;else cart.push({id,qty:1});save();updateCount();toast("Producto agregado al carrito");}
function updateCount(){document.getElementById("cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0)}
function openCart(){renderCart();document.getElementById("cartModal").classList.remove("hidden")}
function closeCart(){document.getElementById("cartModal").classList.add("hidden")}
function renderCart(){
 const box=document.getElementById("cartItems");
 if(!cart.length){box.innerHTML="<p>Tu carrito está vacío.</p>";document.getElementById("cartTotal").textContent=money(0);return}
 let total=0;
 box.innerHTML=cart.map(x=>{const p=PRODUCTS.find(y=>y.id===x.id);total+=p.price*x.qty;return `<div class="cart-row"><div><b>${p.name}</b><br><small>${p.brand}</small></div><div class="qty"><button onclick="change(${p.id},-1)">−</button> ${x.qty} <button onclick="change(${p.id},1)">+</button></div><b>${money(p.price*x.qty)}</b></div>`}).join("");
 document.getElementById("cartTotal").textContent=money(total);
}
function change(id,n){const i=cart.find(x=>x.id===id);if(!i)return;i.qty+=n;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);save();updateCount();renderCart();}
function sendOrder(){
 if(!cart.length){toast("Agrega productos primero");return}
 const name=document.getElementById("customerName").value.trim();
 const district=document.getElementById("customerDistrict").value.trim();
 const note=document.getElementById("customerNote").value.trim();
 if(!name){toast("Escribe tu nombre");return}
 let total=0, lines=cart.map(x=>{const p=PRODUCTS.find(y=>y.id===x.id);total+=p.price*x.qty;return `• ${p.name} x${x.qty} — ${money(p.price*x.qty)}`});
 const text=`Hola, quiero realizar este pedido en Mar y Sol Essence.%0A%0ACliente: ${encodeURIComponent(name)}%0AUbicación: ${encodeURIComponent(district)}%0A%0A${lines.join("%0A")}%0A%0ATotal: ${money(total)}%0AIndicaciones: ${encodeURIComponent(note)}`;
 window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`,"_blank");
}
function filterCat(c){document.getElementById("cat").value=c;document.getElementById("tienda").scrollIntoView();renderProducts();}
function toast(t){const e=document.getElementById("toast");e.textContent=t;e.style.display="block";setTimeout(()=>e.style.display="none",1800)}
document.getElementById("waContact").href=`https://wa.me/${WHATSAPP_NUMBER}`;
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();updateCount();