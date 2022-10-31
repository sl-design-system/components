const searchInput = document.querySelector('.ds-search');

document.querySelector('.ds-search').addEventListener('focus', () => {
  const searchText = searchInput.textContent;
  console.log(searchInput, searchText, searchInput.value);
});
