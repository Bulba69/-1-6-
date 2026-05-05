// ===== ЭЛЕМЕНТЫ =====
const trainBtns = document.querySelectorAll('.filter-btn');
const timeBtns = document.querySelectorAll('.time-btn');
const cards = document.querySelectorAll('.train-card');
const resultCount = document.getElementById('result-count');
const searchInput = document.getElementById('searchInput');
 
// ===== СОСТОЯНИЕ =====
let currentType = 'all';
let currentTime = 'all';
 
// ===== ФИЛЬТР ПО ТИПУ =====
trainBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    trainBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentType = btn.dataset.type;
    filterCards();
  });
});
 
// ===== ФИЛЬТР ПО ВРЕМЕНИ =====
timeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    timeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTime = btn.dataset.time;
    filterCards();
  });
});
 
// ===== ФИЛЬТРАЦИЯ =====
function filterCards() {
  let visibleCount = 0;
  const searchValue = searchInput ? searchInput.value.toLowerCase() : "";
 
  cards.forEach(card => {
    const type = card.dataset.type;
    const time = card.dataset.time;
 
    const from = (card.dataset.from || "").toLowerCase();
    const to = (card.dataset.to || "").toLowerCase();
    const number = (card.dataset.number || "").toLowerCase();
 
    const typeMatch = currentType === 'all' || currentType === type;
    const timeMatch = currentTime === 'all' || currentTime === time;
 
    const searchMatch =
      !searchValue ||
      from.includes(searchValue) ||
      to.includes(searchValue) ||
      number.includes(searchValue);
 
    if (typeMatch && timeMatch && searchMatch) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
 
  if (resultCount) {
    resultCount.textContent = `Найдено рейсов: ${visibleCount}`;
  }
}
 
// ===== ЖИВОЙ ПОИСК В ФИЛЬТРЕ =====
if (searchInput) {
  searchInput.addEventListener('input', filterCards);
}
 
// ===== ПЕРЕХОД НА СТРАНИЦУ ПОЕЗДА ПО КЛИКУ =====
document.querySelectorAll('.train-card').forEach(card => {
  card.addEventListener('click', () => {
    const number = card.dataset.number;
    window.location.href = `ticket.html?train=${encodeURIComponent(number)}`;
  });
});
 
// ===== АВТОЗАПОЛНЕНИЕ ИЗ URL (?search=...) =====
// Срабатывает когда пользователь пришёл со страницы с поиском в шапке
(function () {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('search');
 
  if (query && searchInput) {
    searchInput.value = query;
 
    // Также заполняем поиск в шапке чтобы было видно что искали
    const headerInput = document.querySelector('.search input');
    if (headerInput) headerInput.value = query;
 
    filterCards();
 
    // Плавно скроллим к результатам
    setTimeout(() => {
      const trainsSection = document.querySelector('.trains');
      if (trainsSection) {
        trainsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
})();
 