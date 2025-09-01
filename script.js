/* ====== Utilities ====== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const SCREENS = {
  login: $("#screen-login"),
  home: $("#screen-home"),
  prices: $("#screen-prices"),
  products: $("#screen-products"),
};

const CART_KEY = "69lpg_cart";
const THEME_KEY = "69lpg_theme";
const PROMO_END_KEY = "69lpg_promo_end";

/* ====== Theme ====== */
function applyStoredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light") document.body.classList.add("light");
  else if (saved === "dark") document.body.classList.remove("light");
  // default is dark (no .light). Toggle control reflects via CSS.
}
function toggleTheme() {
  const isLight = document.body.classList.toggle("light");
  localStorage.setItem(THEME_KEY, isLight ? "light" : "dark");
}

/* ====== Navigation / Screens ====== */
function showScreen(name) {
  Object.entries(SCREENS).forEach(([k, el]) => el.classList.toggle("visible", k === name));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function bindNav() {
  $$(".nav .nav-link").forEach(btn => {
    btn.addEventListener("click", () => showScreen(btn.dataset.screen));
  });
}

/* ====== Drawer ====== */
function bindDrawer() {
  $("#hamburger").addEventListener("click", () => $("#drawer").classList.add("open"));
  $("#drawerClose").addEventListener("click", () => $("#drawer").classList.remove("open"));
}

/* ====== Floating WhatsApp Neon reacts to scroll ====== */
function bindNeonScroll() {
  const fab = $("#fabWhatsApp");
  const max = 1.0;
  window.addEventListener("scroll", () => {
    const p = Math.min(1, (window.scrollY % 600) / 600);
    fab.style.setProperty("--halo", (p * max).toFixed(3));
  }, { passive: true });
}

/* ====== Login ====== */
function bindLogin() {
  $("#guestLogin").addEventListener("click", () => {
    showScreen("home");
  });
}

/* ====== Footer year ====== */
function setYear() {
  const y = new Date().getFullYear();
  $("#year").textContent = y;
  $("#year2").textContent = y;
}

/* ====== Promo Timer (10 days) ====== */
let promoTimerInterval;
function initPromoTimer() {
  let end = localStorage.getItem(PROMO_END_KEY);
  if (!end) {
    // 10 days from first view
    end = Date.now() + 10 * 24 * 60 * 60 * 1000;
    localStorage.setItem(PROMO_END_KEY, String(end));
  } else {
    end = Number(end);
  }

  const timerEl = $("#promoTimer");
  if (promoTimerInterval) clearInterval(promoTimerInterval);

  promoTimerInterval = setInterval(() => {
    const now = Date.now();
    let ms = end - now;
    if (ms <= 0) {
      timerEl.textContent = "00:00:00:000";
      clearInterval(promoTimerInterval);
      return;
    }
    const hours = Math.floor(ms / 3_600_000);
    ms -= hours * 3_600_000;
    const mins = Math.floor(ms / 60_000);
    ms -= mins * 60_000;
    const secs = Math.floor(ms / 1_000);
    ms -= secs * 1_000;
    timerEl.textContent = `${String(hours).padStart(2,"0")}:${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}:${String(ms).padStart(3,"0")}`;
  }, 33); // ~30fps for smooth ms
}

/* ====== Products & Cart ====== */
let PRODUCTS = [];
function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
  catch { return []; }
}
function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartCount();
}
function updateCartCount() {
  const count = loadCart().reduce((a, it) => a + it.qty, 0);
  $("#cartCount").textContent = count;
}

function renderProducts() {
  const grid = $("#productsGrid");
  grid.innerHTML = "";
  PRODUCTS.forEach((p, idx) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <h4>${p.name}</h4>
      <p>${p.desc}</p>
      <div class="price">$${Number(p.price).toFixed(2)}</div>
      <div class="card-actions">
        <button class="btn outline" data-idx="${idx}" data-act="details">Details</button>
        <button class="btn primary" data-idx="${idx}" data-act="add">Add to cart</button>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const p = PRODUCTS[Number(btn.dataset.idx)];
    if (btn.dataset.act === "add") {
      const cart = loadCart();
      const existing = cart.find(it => it.id === p.id);
      if (existing) existing.qty += 1;
      else cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
      saveCart(cart);
    } else if (btn.dataset.act === "details") {
      alert(`${p.name}\n\n${p.desc}\n\nPrice: $${Number(p.price).toFixed(2)}`);
    }
  }, { once: true }); // set once to avoid multiple bindings; reattached on re-render if needed
}

function composeWhatsApp() {
  const cart = loadCart();
  if (cart.length === 0) {
    alert("Your cart is empty. Please add items first.");
    return;
  }
  const lines = cart.map((it, i) => `${i+1}. ${it.name} x${it.qty} - $${(it.price * it.qty).toFixed(2)}`);
  const total = cart.reduce((a, it) => a + it.price * it.qty, 0);
  const message = `I'd like to buy these items ${lines.join(" | ")} for $amount and total of $${total.toFixed(2)} where do i make the payment and pickup ?`;
  const url = "https://wa.me/263782404426?text=" + encodeURIComponent(message);
  window.open(url, "_blank", "noopener");
}

/* ====== Data fetch ====== */
async function loadProducts() {
  try {
    const res = await fetch("product.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load products");
    PRODUCTS = await res.json();
    renderProducts();
  } catch (err) {
    console.error(err);
    $("#productsGrid").innerHTML = `<p style="opacity:.8">Unable to load products right now.</p>`;
  }
}

/* ====== Init ====== */
document.addEventListener("DOMContentLoaded", () => {
  applyStoredTheme();
  bindNav();
  bindDrawer();
  bindNeonScroll();
  bindLogin();
  $("#themeToggle").addEventListener("click", toggleTheme);
  $("#buyNow").addEventListener("click", composeWhatsApp);

  setYear();
  initPromoTimer();
  loadProducts();
  updateCartCount();

  // Start at login screen; after guest login, Home becomes visible
  showScreen("login");
});
