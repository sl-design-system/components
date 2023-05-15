(function (window, document) {
  'use strict';

  const search = event => {
    const results = window.searchIndex.search(event.target.value, {
      fields: {
        title: { boost: 2 },
        content: { boost: 1 }
      },
      bool: 'OR',
      expand: true
    });

    const keyword = event.target.value;
    const regEx = new RegExp(keyword, 'ig');

    const resultsElement = document.getElementById('searchResults');
    const noResultsElement = document.getElementById('noResultsFound');

    event.target.value.length
      ? resultsElement.parentElement.classList.add('ds-sidebar-nav--searching')
      : resultsElement.parentElement.classList.remove('ds-sidebar-nav--searching');

    resultsElement.innerHTML = '';
    resultsElement.style.display = 'block';

    if (results.length) {
      noResultsElement.style.display = 'none';
      results.map(result => {
        let { id, title, content } = result.doc;
        const element = document.createElement('li');
        element.classList.add('ds-sidebar-nav__result-list');
        resultsElement.appendChild(element);

        const h3 = document.createElement('h3');
        element.appendChild(h3);

        const a = document.createElement('a');
        a.setAttribute('href', id);
        a.textContent = title;
        h3.appendChild(a);

        const pContent = document.createElement('p');
        if (content && keyword) {
          if (content.toLowerCase().includes(keyword.toLowerCase())) {
            content = content.replace(regEx, textPart => {
              return ' <mark>' + textPart + '</mark>';
            });
          }
          if (content.length > 100) {
            content = '...' + content.substring(0, content.indexOf('<mark>') + keyword.length + 55) + '...';
          }
        }
        pContent.innerHTML = content;
        element.appendChild(pContent);
      });
    } else if (!event.target.value.length) {
      noResultsElement.style.display = 'none';
      resultsElement.style.display = 'none';
    } else {
      noResultsElement.style.display = 'block';
      resultsElement.style.display = 'none';
    }
  };

  fetch('/search-index.json').then(async response =>
    response.json().then(rawIndex => {
      // eslint-disable-next-line no-undef
      elasticlunr.clearStopWords(); /** Remove default stop words, we can add customized stop words*/
      // eslint-disable-next-line no-undef
      window.searchIndex = elasticlunr.Index.load(rawIndex);
      document.getElementById('searchField').addEventListener('input', search);
    })
  );
})(window, document);
