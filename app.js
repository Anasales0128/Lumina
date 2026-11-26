const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

menuToggle.addEventListener("click", () => {
  const opened = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(opened));
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

// Conteúdos educativos demonstrativos
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
    document.querySelector("#dialogText").textContent = article.text;
    infoDialog.showModal();
  });
});
document.querySelector("#closeDialog").addEventListener("click", () => infoDialog.close());

// Calendário demonstrativo: os registros ficam somente na memória da página.
let displayedMonth = new Date();
let periodDates = [];
const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const weekDays = ["D","S","T","Q","Q","S","S"];
const calendarGrid = document.querySelector("#calendarGrid");

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
function renderCalendar() {
  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();
  document.querySelector("#calendarTitle").textContent = `${monthNames[month]} de ${year}`;
  calendarGrid.innerHTML = "";
  weekDays.forEach(day => {
    const el = document.createElement("div");
    el.className = "calendar-day";
    el.textContent = day;
    calendarGrid.appendChild(el);
  });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement("div");
    calendarGrid.appendChild(blank);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const current = new Date(year, month, day);
    const key = dateKey(current);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "calendar-date";
    button.textContent = day;
    if (key === dateKey(new Date())) button.classList.add("today");
    if (periodDates.includes(key)) button.classList.add("period");
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
  document.querySelector("#calendarMessage").textContent = "Data adicionada nesta demonstração. Ela será perdida quando a página for recarregada.";
  displayedMonth = new Date(`${value}T12:00:00`);
  renderCalendar();
});
renderCalendar();

// Pesquisa simples no conteúdo disponível nesta versão.
const searchableItems = [
  ["Saúde feminina", "Ciclo menstrual, menstruação, ovulação, TPM, saúde íntima, gravidez e menopausa."],
  ["Calendário menstrual", "Registro demonstrativo de datas e visualização do calendário."],
  ["Maquiagem", "Tutoriais, preparação da pele e dicas de maquiagem."],
  ["Cabelos", "Cuidados capilares, cabelos cacheados, crespos, lisos, ondulados, finalizações e tranças."],
  ["Moda e estilo", "Inspirações de looks, combinações e acessórios."],
  ["Profissionais e clínicas", "Divulgação de profissionais parceiros e links externos oficiais."],
  ["Comunidade feminina", "Espaço de troca de experiências com respeito e moderação."]
];
function runSearch() {
  const query = document.querySelector("#siteSearch").value.trim().toLocaleLowerCase("pt-BR");
  const results = document.querySelector("#searchResults");
  if (!query) {
    results.textContent = "Digite um assunto para pesquisar.";
    return;
  }
  const matches = searchableItems.filter(item => `${item[0]} ${item[1]}`.toLocaleLowerCase("pt-BR").includes(query));
  results.innerHTML = "";
  if (!matches.length) {
    results.textContent = "Nenhum conteúdo encontrado nesta demonstração.";
    return;
  }
  matches.forEach(item => {
    const result = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = `${item[0]}: `;
    result.append(strong, document.createTextNode(item[1]));
    results.appendChild(result);
  });
}
document.querySelector("#searchBtn").addEventListener("click", runSearch);
document.querySelector("#siteSearch").addEventListener("keydown", event => {
  if (event.key === "Enter") runSearch();
});

// Modais de conta: interface demonstrativa, sem autenticação real.
const accountDialog = document.querySelector("#accountDialog");
const accountTitle = document.querySelector("#accountTitle");
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
  document.querySelector("#accountMessage").textContent = "Demonstração concluída. O cadastro real será conectado quando o backend seguro for desenvolvido.";
});
document.querySelector("#communityBtn").addEventListener("click", () => {
  alert("A comunidade está apresentada como protótipo. Publicações, comentários e moderação precisam de backend e autenticação.");
});