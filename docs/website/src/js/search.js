const searchInput = document.querySelector('.ds-search');

// console.log(searchInput);

document.querySelector('.ds-search').addEventListener('focus', () => {
  const searchText = searchInput.textContent;
  console.log(searchInput, searchText);
});
