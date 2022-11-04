(function (window, document) {
  'use strict';

  const search = (e) => {
    const results = window.searchIndex.search(e.target.value, {
      bool: 'OR',
      expand: true,
    });

    const kw = e.target.value;
    const regEx = new RegExp(kw, 'ig');

    const resEl = document.getElementById('searchResults');
    const noResultsEl = document.getElementById('noResultsFound');

    if (e.target.value.length > 0) {
      resEl.parentElement.classList.add('ds-sidebar--searching');
    } else {
      resEl.parentElement.classList.remove('ds-sidebar--searching');
    }

    // if (e.target.value.length === 0) {
    //   resEl.parentElement.classList.remove('ds-sidebar--searching');
    // }

    resEl.innerHTML = '';
    console.log(
      'results',
      results,
      e.target.value,
      kw,
      regEx,
      window.searchIndex,
      results.length,
      e.target.value.length,
      // window.searchIndex.search(e.target.value),
    );
    resEl.style.display = 'block';
    if (results.length) {
      noResultsEl.style.display = 'none';
      results.map((r) => {
        console.log('r is result', r);
        let { id, title, description, content } = r.doc;
        const el = document.createElement('li');
        el.classList.add('ds-search-results-element');
        resEl.appendChild(el);

        const h3 = document.createElement('h3');
        el.appendChild(h3);

        const a = document.createElement('a');
        a.setAttribute('href', id);
        a.textContent = title;
        h3.appendChild(a);

        const p = document.createElement('p');
        p.textContent = description;
        el.appendChild(p);

        console.log('content', content);
        console.log('content222', content.replace(/<[^>]+>/g, ''));

        // content = content.replace(/<[^>]+>/g, '');

        const pContent = document.createElement('p');
        if (content && kw) {
          if (content.toLowerCase().includes(kw.toLowerCase())) {
            content = content.replace(regEx, function (x) {
              console.log('x part', x);
              return ' <mark>' + x + '</mark>';
            });
          }
          // if (content.indexOf('<mark>') > 10) {
          //   content = '...' + content.substring(content.indexOf('<mark>') - 10);
          // }
          // too long content or content
          // -- uncomment below if search on full content
          if (content.length > 100) {
            content = '...' + content.substring(0, content.indexOf('<mark>') + kw.length + 55) + '...';
          }
        }
        pContent.innerHTML = content;
        el.appendChild(pContent);
      });
    } else if (!e.target.value.length) {
      noResultsEl.style.display = 'none';
      resEl.style.display = 'none';
    } else {
      noResultsEl.style.display = 'block';
      resEl.style.display = 'none';
    }
  };

  fetch('/search-index.json').then((response) =>
    response.json().then((rawIndex) => {
      // eslint-disable-next-line no-undef
      elasticlunr.clearStopWords();
      // eslint-disable-next-line no-undef
      window.searchIndex = elasticlunr.Index.load(rawIndex);
      console.log('window.searchIndex', window.searchIndex);
      document.getElementById('searchField').addEventListener('input', search);
    }),
  );
})(window, document);
