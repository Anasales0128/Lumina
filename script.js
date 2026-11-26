/* ============================================================
   LUMINA – script.js
   Toda a lógica front-end: menu, artigos, calendário, busca,
   modais de conta, loja simulada (carrinho + checkout).
   Sem dependências externas – vanilla JS ES6+
   ============================================================ */

/* ——————————————————————————————————
   1. MENU MOBILE
—————————————————————————————————— */
const menuToggle = document.querySelector("#menuToggle");
const mainNav    = document.querySelector("#mainNav");

menuToggle.addEventListener("click", () => {
  const opened = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(opened));
});
mainNav.querySelectorAll("a").forEach(link =>
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  })
);

/* ——————————————————————————————————
   2. ARTIGOS EDUCATIVOS (modal)
—————————————————————————————————— */
const articles = {
  ciclo: {
    title: "Entenda as fases do ciclo menstrual",
    text: "O ciclo menstrual envolve mudanças hormonais e pode variar de pessoa para pessoa. De forma geral, inclui a menstruação, a fase folicular, a ovulação e a fase lútea. A duração e os sintomas podem variar. Se houver mudanças importantes, dor intensa ou dúvidas, procure orientação de um profissional de saúde."
  },
  prevencao: {
    title: "Cuidados e prevenção",
    text: "Conhecer o próprio corpo, manter acompanhamento de saúde adequado à sua idade e situação, e buscar orientação diante de sintomas são atitudes importantes. Evite receitas caseiras ou tratamentos sem orientação profissional."
  },
  menopausa: {
    title: "Conheça a menopausa",
    text: "A menopausa é uma etapa natural da vida marcada pelo fim permanente das menstruações. A transição pode envolver mudanças no ciclo, ondas de calor, alterações no sono e outros sintomas. Cada pessoa vivencia essa fase de maneira diferente."
  }
};

const infoDialog = document.querySelector("#infoDialog");
document.querySelectorAll("[data-article]").forEach(button => {
  button.addEventListener("click", () => {
    const article = articles[button.dataset.article];
    document.querySelector("#dialogTitle").textContent = article.title;
    document.querySelector("#dialogText").textContent  = article.text;
    infoDialog.showModal();
  });
});
document.querySelector("#closeDialog").addEventListener("click", () => infoDialog.close());

/* ——————————————————————————————————
   3. CALENDÁRIO MENSTRUAL (demonstrativo)
—————————————————————————————————— */
let displayedMonth = new Date();
let periodDates    = [];
const monthNames   = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho",
                      "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const weekDays     = ["D","S","T","Q","Q","S","S"];
const calendarGrid = document.querySelector("#calendarGrid");

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
function renderCalendar() {
  const year  = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();
  document.querySelector("#calendarTitle").textContent = `${monthNames[month]} de ${year}`;
  calendarGrid.innerHTML = "";
  weekDays.forEach(day => {
    const el = document.createElement("div");
    el.className   = "calendar-day";
    el.textContent = day;
    calendarGrid.appendChild(el);
  });
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < firstDay; i++) calendarGrid.appendChild(document.createElement("div"));
  for (let day = 1; day <= daysInMonth; day++) {
    const current = new Date(year, month, day);
    const key     = dateKey(current);
    const button  = document.createElement("button");
    button.type      = "button";
    button.className = "calendar-date";
    button.textContent = day;
    if (key === dateKey(new Date())) button.classList.add("today");
    if (periodDates.includes(key))   button.classList.add("period");
    button.title = periodDates.includes(key) ? "Data registrada nesta demonstração" : key;
    calendarGrid.appendChild(button);
  }
}
document.querySelector("#prevMonth").addEventListener("click", () => {
  displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth()-1, 1);
  renderCalendar();
});
document.querySelector("#nextMonth").addEventListener("click", () => {
  displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth()+1, 1);
  renderCalendar();
});
document.querySelector("#periodForm").addEventListener("submit", event => {
  event.preventDefault();
  const value = document.querySelector("#periodDate").value;
  if (!value) return;
  if (!periodDates.includes(value)) periodDates.push(value);
  document.querySelector("#calendarMessage").textContent =
    "Data adicionada nesta demonstração. Ela será perdida quando a página for recarregada.";
  displayedMonth = new Date(`${value}T12:00:00`);
  renderCalendar();
});
renderCalendar();

/* ——————————————————————————————————
   5. MODAIS DE CONTA (demonstrativo)
—————————————————————————————————— */
const accountDialog = document.querySelector("#accountDialog");
const accountTitle  = document.querySelector("#accountTitle");
document.querySelector("#loginBtn").addEventListener("click", () => {
  accountTitle.textContent = "Acessar conta";
  accountDialog.showModal();
});
document.querySelector("#registerBtn").addEventListener("click", () => {
  accountTitle.textContent = "Criar conta";
  accountDialog.showModal();
});
document.querySelector("#closeAccount").addEventListener("click", () => accountDialog.close());
document.querySelector("#demoAccountForm").addEventListener("submit", event => {
  event.preventDefault();
  document.querySelector("#accountMessage").textContent =
    "Demonstração concluída. O cadastro real será conectado quando o backend seguro for desenvolvido.";
});
document.querySelector("#communityBtn").addEventListener("click", () => {
  alert("A comunidade está apresentada como protótipo. Publicações, comentários e moderação precisam de backend e autenticação.");
});

/* ============================================================
   6. LOJA LUMINA — SIMULAÇÃO COMPLETA (MVP)
   Sem backend. Dados mockados. Carrinho em localStorage.
   ============================================================ */

/* — 6.1  PRODUTOS MOCKADOS ————————————————————————————————— */
const PRODUCTS = [

  /* ── SKINCARE ─────────────────────────────────────────── */
  {
    id: 1, category: "skincare",
    name: "Sérum Facial Vitamina C",
    desc: "Ilumina, uniformiza o tom e protege contra radicais livres. Fórmula leve, de rápida absorção.",
    price: 89.90,
    img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "✦", iconBg: "#f8dfe8",
    tags: ["skincare","rosto","vitamina c","sérum","iluminador"],
    badge: "Mais vendido"
  },
  {
    id: 2, category: "skincare",
    name: "Hidratante Corporal Karité",
    desc: "Nutrição intensa para pele seca. Fragrância suave de baunilha e textura que não fica oleosa.",
    price: 48.50,
    img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "✧", iconBg: "#f8f0e6",
    tags: ["skincare","corpo","hidratante","karité","pele seca"]
  },
  {
    id: 3, category: "skincare",
    name: "Gel de Limpeza Facial",
    desc: "Remove impurezas e maquiagem sem ressecar. Com ácido hialurônico e extratos vegetais.",
    price: 39.90,
    img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "◎", iconBg: "#edf3ed",
    tags: ["skincare","limpeza","rosto","gel","pele"]
  },
  {
    id: 4, category: "skincare",
    name: "Protetor Solar FPS 50+",
    desc: "Proteção UVA/UVB com cor. Acabamento luminoso e sem textura pesada. Ideal para uso diário.",
    price: 64.90,
    img: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "☀", iconBg: "#fdf3dc",
    tags: ["skincare","protetor solar","fps","solar","proteção"],
    badge: "Essencial"
  },
  {
    id: 5, category: "skincare",
    name: "Tônico Facial com Rosas",
    desc: "Equilibra o pH, afina os poros e prepara a pele para a hidratação. Aroma suave de rosas.",
    price: 55.00,
    img: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "✿", iconBg: "#f9e8ee",
    tags: ["skincare","tônico","rosas","poros","rosto"]
  },

  /* ── CABELOS ──────────────────────────────────────────── */
  {
    id: 10, category: "cabelos",
    name: "Máscara Nutritiva Cachos",
    desc: "Hidratação profunda para cabelos cacheados e crespos. Reduz o frizz e define cachos.",
    price: 54.90,
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "✿", iconBg: "#eee7f4",
    tags: ["cabelos","hidratação","cachos","máscara","crespos"]
  },
  {
    id: 11, category: "cabelos",
    name: "Óleo Capilar Argan + Rícino",
    desc: "Finalização, brilho e controle do frizz. Para todos os tipos de cabelo.",
    price: 59.00,
    img: "https://images.unsplash.com/photo-1527799820374-87036083c58e?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "✺", iconBg: "#f9e8ee",
    tags: ["cabelos","óleo","argan","finalização","brilho","frizz"]
  },
  {
    id: 12, category: "cabelos",
    name: "Shampoo Low Poo Hidratante",
    desc: "Limpeza suave sem sulfatos. Mantém a umidade natural dos fios e reduz o frizz.",
    price: 42.90,
    img: "https://images.unsplash.com/photo-1626170733776-b39b08a1cbb2?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "◈", iconBg: "#f0eaf6",
    tags: ["cabelos","shampoo","low poo","sem sulfato","limpeza"],
    badge: "Novo"
  },
  {
    id: 13, category: "cabelos",
    name: "Leave-in Térmico Protetor",
    desc: "Protege os fios do calor até 230°C. Facilita a escovação e deixa o cabelo sedoso.",
    price: 47.50,
    img: "https://images.unsplash.com/photo-1515378791036-0648a814c963?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "☽", iconBg: "#edf3ed",
    tags: ["cabelos","leave-in","protetor térmico","calor","escova"]
  },
  {
    id: 14, category: "cabelos",
    name: "Condicionador Reconstrutor",
    desc: "Reconstrói os fios danificados pela química e pelo calor. Com queratina e proteínas.",
    price: 38.90,
    img: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "▦", iconBg: "#f8e9df",
    tags: ["cabelos","condicionador","reconstrução","queratina","danos"]
  },

  /* ── MAQUIAGEM ────────────────────────────────────────── */
  {
    id: 20, category: "maquiagem",
    name: "Blush em Pó Rosé",
    desc: "Tom rosé natural para todas as peles. Longa duração com acabamento acetinado.",
    price: 42.00,
    img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "◈", iconBg: "#f9e8ee",
    tags: ["maquiagem","blush","rosé","bochechas","cor"],
    badge: "Novo"
  },
  {
    id: 21, category: "maquiagem",
    name: "Batom Líquido Nude Rosado",
    desc: "Acabamento matte de longa duração. Cor versátil que combina com todos os tons de pele.",
    price: 36.90,
    img: "https://images.unsplash.com/photo-1583241800698-e8ab01830a24?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "♡", iconBg: "#f8e9df",
    tags: ["maquiagem","batom","nude","lábios","matte"]
  },
  {
    id: 22, category: "maquiagem",
    name: "Paleta de Sombras Rose Gold",
    desc: "12 tons entre mattes e cintilantes. Do dia a noite, fácil de blendear.",
    price: 78.00,
    img: "https://images.unsplash.com/photo-1631214499521-f697f5ac1f70?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "✦", iconBg: "#fdf3dc",
    tags: ["maquiagem","sombras","paleta","rose gold","olhos"],
    badge: "Favorito"
  },
  {
    id: 23, category: "maquiagem",
    name: "Base Líquida Cobertura Total",
    desc: "Alta cobertura com acabamento natural. Fórmula dermatologicamente testada. 30 tons.",
    price: 92.00,
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "☼", iconBg: "#f8f0e6",
    tags: ["maquiagem","base","cobertura","rosto","tons"]
  },
  {
    id: 24, category: "maquiagem",
    name: "Máscara de Cílios Volume Extremo",
    desc: "Amplia e alonga os cílios. Fórmula enriquecida sem ressecar. Resistente à água.",
    price: 49.90,
    img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "◎", iconBg: "#eee7f4",
    tags: ["maquiagem","máscara","cílios","rímel","olhos","volume"]
  },

  /* ── BEM-ESTAR ────────────────────────────────────────── */
  {
    id: 30, category: "bemestar",
    name: "Kit Aromaterapia Lavanda",
    desc: "Vela + roll-on de lavanda para relaxamento e bem-estar no dia a dia.",
    price: 69.90,
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "☽", iconBg: "#edf3ed",
    tags: ["bem-estar","aromaterapia","lavanda","relaxamento","vela"]
  },
  {
    id: 31, category: "bemestar",
    name: "Agenda de Autocuidado Lumina",
    desc: "Agenda anual temática com seções de saúde, metas e reflexões mensais.",
    price: 79.90,
    img: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "▦", iconBg: "#f0eaf6",
    tags: ["bem-estar","agenda","autocuidado","planejamento","metas"],
    badge: "Exclusivo"
  },
  {
    id: 32, category: "bemestar",
    name: "Vela Perfumada Vanilla & Rosas",
    desc: "Vela em cera de soja com 50h de duração. Fragrância suave de baunilha e rosas.",
    price: 54.90,
    img: "https://images.unsplash.com/photo-1602874801006-9e9f7e2d7e62?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "✦", iconBg: "#f8dfe8",
    tags: ["bem-estar","vela","aromaterapia","vanilla","rosas","soja"]
  },
  {
    id: 33, category: "bemestar",
    name: "Chá Relaxante 30 Sachês",
    desc: "Blend de camomila, melissa e lavanda. Ajuda a relaxar antes de dormir. 100% natural.",
    price: 32.00,
    img: "https://images.unsplash.com/photo-1565600556442-a04c5e45c38c?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "✧", iconBg: "#edf3ed",
    tags: ["bem-estar","chá","relaxante","camomila","sono","natural"]
  },
  {
    id: 34, category: "bemestar",
    name: "Kit Massagem Relaxante",
    desc: "Rolo de jade + óleo de amêndoas + sais de banho. Para rituais de autocuidado em casa.",
    price: 119.90,
    img: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "◈", iconBg: "#f9e8ee",
    tags: ["bem-estar","massagem","jade","relaxamento","banho","ritual"]
  },

  /* ── ROUPAS ───────────────────────────────────────────── */
  {
    id: 40, category: "roupas",
    name: "Conjunto de Linho Branco",
    desc: "Calça + camisa de linho premium. Elegante, fresca e versátil. Disponível em P, M e G.",
    price: 189.90,
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "✦", iconBg: "#f8f0e6",
    tags: ["roupas","linho","conjunto","branco","casual","elegante"],
    badge: "Novo"
  },
  {
    id: 41, category: "roupas",
    name: "Vestido Floral Midi",
    desc: "Estampa floral delicada em tecido fluido. Alças reguláveis e saia midi com volume.",
    price: 149.90,
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "✿", iconBg: "#f9e8ee",
    tags: ["roupas","vestido","floral","midi","flores","delicado"]
  },
  {
    id: 42, category: "roupas",
    name: "Blusa de Renda Off-White",
    desc: "Blusa com renda bordada. Levinha e sofisticada, perfeita para qualquer ocasião.",
    price: 89.90,
    img: "https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "◈", iconBg: "#fdf3dc",
    tags: ["roupas","blusa","renda","off-white","sofisticada"]
  },
  {
    id: 43, category: "roupas",
    name: "Calça Wide Leg Alfaiataria",
    desc: "Corte amplo e elegante. Cintura alta com elástico interno. Tecido com textura premium.",
    price: 169.00,
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4b2cca?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "▦", iconBg: "#eee7f4",
    tags: ["roupas","calça","wide leg","alfaiataria","cintura alta"],
    badge: "Favorito"
  },
  {
    id: 44, category: "roupas",
    name: "Kimono Estampado Premium",
    desc: "Tecido acetinado com estampa exclusiva. Manga longa, cinto incluso. Uso casual ou praia.",
    price: 129.00,
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "✺", iconBg: "#f8dfe8",
    tags: ["roupas","kimono","estampado","praia","casual","manga"]
  },
  {
    id: 45, category: "roupas",
    name: "Conjunto Cropped + Saia Plissada",
    desc: "Top cropped com alcinhas + saia midi plissada. Tecido com leve brilho para looks especiais.",
    price: 159.90,
    img: "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=480&h=300&fit=crop&auto=format&q=80",
    icon: "☼", iconBg: "#f9e8ee",
    tags: ["roupas","cropped","saia","plissada","conjunto","look"]
  }
];

/* — 6.2  CATEGORIAS ————————————————————————————————————————— */
const CATEGORIES = [
  { id: "todos",     label: "Todos"      },
  { id: "skincare",  label: "Skincare"   },
  { id: "cabelos",   label: "Cabelos"    },
  { id: "maquiagem", label: "Maquiagem"  },
  { id: "bemestar",  label: "Bem-estar"  },
  { id: "roupas",    label: "Roupas"     }
];

const FRETE_GRATIS_ACIMA = 150;
const FRETE_FIXO         = 14.90;
const CART_KEY           = "lumina_cart";

/* — 6.3  ESTADO DO CARRINHO (localStorage) ————————————————— */
function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

let cart = loadCart();

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}
function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}
function getFrete() {
  if (cart.length === 0) return 0;
  return getCartTotal() >= FRETE_GRATIS_ACIMA ? 0 : FRETE_FIXO;
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id, name: product.name, price: product.price,
      qty: 1, icon: product.icon, iconBg: product.iconBg,
      img: product.img || null
    });
  }
  saveCart(cart);
  updateCartBadge();
  showToast(`"${product.name}" adicionado ao carrinho ✿`);
  renderCartItems();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  updateCartBadge();
  renderCartItems();
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  updateCartBadge();
  renderCartItems();
}

/* — 6.4  BADGE DO CARRINHO NO HEADER ——————————————————————— */
function updateCartBadge() {
  const count = getCartCount();
  const badge = document.querySelector("#cartBadge");
  if (badge) badge.textContent = count > 0 ? count : "";
}

/* — 6.5  TOAST NOTIFICATION ———————————————————————————————— */
function showToast(msg) {
  const existing = document.querySelector(".lumina-toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className   = "lumina-toast";
  toast.textContent = msg;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("lumina-toast--show"));
  setTimeout(() => {
    toast.classList.remove("lumina-toast--show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/* — 6.6  HELPER: gera HTML de um card de produto ——————————— */
function productCardHTML(p, showAddBtn = true) {
  const catLabel = CATEGORIES.find(c => c.id === p.category)?.label || "";
  const artHTML = p.img
    ? `<div class="shop-card-art shop-card-art--img">
         <img src="${p.img}" alt="${p.name}"
              loading="lazy"
              onerror="this.closest('.shop-card-art').classList.remove('shop-card-art--img');this.closest('.shop-card-art').innerHTML='<span style=\\'font-size:52px\\'>${p.icon}</span>';this.closest('.shop-card-art').style.background='${p.iconBg}'">
       </div>`
    : `<div class="shop-card-art" style="background:${p.iconBg}">${p.icon}</div>`;

  return `
    <article class="shop-card" data-id="${p.id}">
      ${p.badge ? `<span class="shop-badge">${p.badge}</span>` : ""}
      ${artHTML}
      <div class="shop-card-body">
        <span class="tag">${catLabel}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="shop-card-footer">
          <strong class="shop-price">R$&nbsp;${p.price.toFixed(2).replace(".", ",")}</strong>
          ${showAddBtn
            ? `<button class="btn btn-primary shop-add-btn" data-id="${p.id}" aria-label="Adicionar ${p.name} ao carrinho">+ Carrinho</button>`
            : `<a class="btn btn-outline" href="#loja" style="font-size:11px">Ver na loja</a>`
          }
        </div>
      </div>
    </article>`;
}

/* — 6.7  CATÁLOGO DE PRODUTOS ————————————————————————————— */
let activeCategory = "todos";

function renderCatalog() {
  const grid = document.querySelector("#shopGrid");
  if (!grid) return;
  const filtered = activeCategory === "todos"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  grid.innerHTML = filtered.map(p => productCardHTML(p, true)).join("");

  grid.querySelectorAll(".shop-add-btn").forEach(btn => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
  });
}

function renderCategoryFilters() {
  const wrap = document.querySelector("#shopFilters");
  if (!wrap) return;
  wrap.innerHTML = CATEGORIES.map(c => `
    <button class="shop-filter-btn${c.id === activeCategory ? " active" : ""}" data-cat="${c.id}">
      ${c.label}
    </button>
  `).join("");
  wrap.querySelectorAll(".shop-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.cat;
      renderCategoryFilters();
      renderCatalog();
    });
  });
}

/* — 6.8  DRAWER DO CARRINHO ———————————————————————————————— */
function renderCartItems() {
  const list    = document.querySelector("#cartList");
  const summary = document.querySelector("#cartSummary");
  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = `<p class="cart-empty">Seu carrinho está vazio. <br><span>Que tal explorar nossa loja? ✿</span></p>`;
    if (summary) summary.innerHTML = "";
    return;
  }

  list.innerHTML = cart.map(item => {
    const thumbHTML = item.img
      ? `<img class="cart-item-thumb" src="${item.img}" alt="${item.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">`
      : "";
    const iconHTML = `<div class="cart-item-art" style="background:${item.iconBg};${item.img ? "display:none" : ""}">${item.icon}</div>`;
    return `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-media">
        ${thumbHTML}
        ${iconHTML}
      </div>
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>R$&nbsp;${item.price.toFixed(2).replace(".", ",")}</span>
      </div>
      <div class="cart-item-qty">
        <button class="cart-qty-btn" data-action="minus" data-id="${item.id}" aria-label="Diminuir quantidade">−</button>
        <span>${item.qty}</span>
        <button class="cart-qty-btn" data-action="plus" data-id="${item.id}" aria-label="Aumentar quantidade">+</button>
      </div>
      <button class="cart-remove-btn" data-id="${item.id}" aria-label="Remover ${item.name}">×</button>
    </div>`;
  }).join("");

  list.querySelectorAll(".cart-qty-btn").forEach(btn => {
    btn.addEventListener("click", () => changeQty(Number(btn.dataset.id), btn.dataset.action === "plus" ? 1 : -1));
  });
  list.querySelectorAll(".cart-remove-btn").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.id)));
  });

  const subtotal = getCartTotal();
  const frete    = getFrete();
  const total    = subtotal + frete;
  if (summary) {
    summary.innerHTML = `
      <div class="cart-summary-row"><span>Subtotal</span><span>R$&nbsp;${subtotal.toFixed(2).replace(".", ",")}</span></div>
      <div class="cart-summary-row">
        <span>Frete</span>
        <span class="${frete === 0 ? "cart-frete-gratis" : ""}">${frete === 0 ? "Grátis ✿" : "R$&nbsp;" + frete.toFixed(2).replace(".", ",")}</span>
      </div>
      ${frete > 0 ? `<p class="cart-frete-hint">Frete grátis acima de R$&nbsp;${FRETE_GRATIS_ACIMA.toFixed(2).replace(".", ",")}</p>` : ""}
      <div class="cart-summary-row cart-total-row"><strong>Total</strong><strong>R$&nbsp;${total.toFixed(2).replace(".", ",")}</strong></div>
      <button class="btn btn-primary cart-checkout-btn" id="goToCheckout">Finalizar pedido →</button>
    `;
    summary.querySelector("#goToCheckout").addEventListener("click", openCheckout);
  }
}

/* — 6.9  CHECKOUT SIMULADO ————————————————————————————————— */
function openCheckout() {
  if (cart.length === 0) { showToast("Adicione itens ao carrinho primeiro."); return; }
  closeCartDrawer();
  const dialog = document.querySelector("#checkoutDialog");
  if (!dialog) return;
  renderCheckoutItems();
  dialog.showModal();
}

function renderCheckoutItems() {
  const list = document.querySelector("#checkoutItemsList");
  if (!list) return;
  const subtotal = getCartTotal();
  const frete    = getFrete();
  const total    = subtotal + frete;
  list.innerHTML = cart.map(i =>
    `<div class="checkout-item">
      <span>${i.name} × ${i.qty}</span>
      <span>R$&nbsp;${(i.price * i.qty).toFixed(2).replace(".", ",")}</span>
    </div>`
  ).join("") + `
    <div class="checkout-item checkout-frete">
      <span>Frete</span>
      <span>${frete === 0 ? "Grátis ✿" : "R$ " + frete.toFixed(2).replace(".", ",")}</span>
    </div>
    <div class="checkout-item checkout-total-row">
      <strong>Total</strong>
      <strong>R$&nbsp;${total.toFixed(2).replace(".", ",")}</strong>
    </div>`;
}

function confirmOrder() {
  const name    = (document.querySelector("#checkoutName")?.value || "").trim();
  const email   = (document.querySelector("#checkoutEmail")?.value || "").trim();
  const address = (document.querySelector("#checkoutAddress")?.value || "").trim();
  const payment = document.querySelector("input[name='payment']:checked")?.value;

  if (!name || !email || !address) { showToast("Preencha todos os campos para continuar."); return; }
  if (!payment) { showToast("Escolha uma forma de pagamento."); return; }

  const btn = document.querySelector("#confirmOrderBtn");
  if (btn) { btn.disabled = true; btn.textContent = "Processando..."; }

  setTimeout(() => {
    document.querySelector("#checkoutDialog").close();
    cart = [];
    saveCart(cart);
    updateCartBadge();
    renderCartItems();
    document.querySelector("#successDialog").showModal();
    if (btn) { btn.disabled = false; btn.textContent = "Confirmar pedido"; }
  }, 1200);
}

/* — 6.10  DRAWER: ABRIR / FECHAR ——————————————————————————— */
function openCartDrawer() {
  const drawer  = document.querySelector("#cartDrawer");
  const overlay = document.querySelector("#cartOverlay");
  if (!drawer) return;
  renderCartItems();
  drawer.classList.add("open");
  overlay?.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeCartDrawer() {
  const drawer  = document.querySelector("#cartDrawer");
  const overlay = document.querySelector("#cartOverlay");
  drawer?.classList.remove("open");
  overlay?.classList.remove("open");
  document.body.style.overflow = "";
}

/* — 6.11  INICIALIZAÇÃO DA LOJA ————————————————————————————— */
function initShop() {
  document.querySelector("#cartBtn")?.addEventListener("click", openCartDrawer);
  document.querySelector("#closeCart")?.addEventListener("click", closeCartDrawer);
  document.querySelector("#cartOverlay")?.addEventListener("click", closeCartDrawer);
  document.querySelector("#closeCheckout")?.addEventListener("click", () =>
    document.querySelector("#checkoutDialog")?.close()
  );
  document.querySelector("#confirmOrderBtn")?.addEventListener("click", confirmOrder);
  document.querySelector("#closeSuccess")?.addEventListener("click", () =>
    document.querySelector("#successDialog")?.close()
  );
  renderCategoryFilters();
  renderCatalog();
  updateCartBadge();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initShop);
} else {
  initShop();
}

/* ——————————————————————————————————
   4. BUSCA NO SITE — retorna cards de produtos
—————————————————————————————————— */
function runSearch() {
  const query   = document.querySelector("#siteSearch").value.trim().toLocaleLowerCase("pt-BR");
  const results = document.querySelector("#searchResults");
  results.innerHTML = "";

  if (!query) {
    results.innerHTML = `<p class="search-hint">Digite um nome, categoria ou palavra-chave para encontrar produtos.</p>`;
    return;
  }

  // Busca nos produtos da loja
  const productMatches = PRODUCTS.filter(p => {
    const haystack = [p.name, p.desc, p.category, ...p.tags].join(" ").toLocaleLowerCase("pt-BR");
    return haystack.includes(query);
  });

  if (productMatches.length === 0) {
    results.innerHTML = `<p class="search-hint">Nenhum produto encontrado para "<strong>${query}</strong>". Tente outro termo.</p>`;
    return;
  }

  // Título do resultado
  const header = document.createElement("p");
  header.className = "search-results-header";
  header.innerHTML = `${productMatches.length} produto${productMatches.length > 1 ? "s" : ""} encontrado${productMatches.length > 1 ? "s" : ""} para "<strong>${query}</strong>"`;
  results.appendChild(header);

  // Grid de cards
  const grid = document.createElement("div");
  grid.className = "search-results-grid";
  grid.innerHTML  = productMatches.map(p => productCardHTML(p, true)).join("");
  results.appendChild(grid);

  // Ativa botões "Adicionar ao carrinho" nos cards de resultado
  grid.querySelectorAll(".shop-add-btn").forEach(btn => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.id)));
  });
}

document.querySelector("#searchBtn").addEventListener("click", runSearch);
document.querySelector("#siteSearch").addEventListener("keydown", e => {
  if (e.key === "Enter") runSearch();
});
// Busca em tempo real ao digitar (debounce 350ms)
let searchDebounce;
document.querySelector("#siteSearch").addEventListener("input", () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(runSearch, 350);
});
