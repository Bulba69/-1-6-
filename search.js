// ===== ПОИСК В ШАПКЕ =====
(function () {
  const input = document.querySelector('.search input');
  const btn = document.querySelector('.search button');

  if (!input || !btn) return;

  function doSearch() {
    const query = input.value.trim();
    if (!query) return;
    window.location.href = 'schedule.html?search=' + encodeURIComponent(query);
  }

  btn.addEventListener('click', doSearch);

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') doSearch();
  });
})();
