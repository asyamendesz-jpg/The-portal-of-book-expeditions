(function () {
  'use strict';

  var portal = window.ReadingPortal;

  function renderComics(container) {
    var comics = portal.comics;
    container.innerHTML = '';

    if (!comics || !comics.length) {
      var gallery = document.createElement('section');
      gallery.className = 'comics-soon';

      var title = document.createElement('h2');
      title.className = 'section-title';
      title.textContent = 'Галерея читателей';

      var text = document.createElement('p');
      text.className = 'page-intro';
      text.textContent =
        'Здесь появятся комиксы юных исследователей. Пока альбом пуст — твори свои истории по мотивам экспедиции.';

      var placeholders = document.createElement('ul');
      placeholders.className = 'comics-soon__grid';
      ['Кадр 1', 'Кадр 2', 'Кадр 3'].forEach(function (label) {
        var item = document.createElement('li');
        item.className = 'comics-soon__slot';
        item.innerHTML =
          '<div class="comics-soon__frame" aria-hidden="true"></div>' +
          '<p class="comics-soon__label">' + label + ' — скоро</p>';
        placeholders.appendChild(item);
      });

      gallery.appendChild(title);
      gallery.appendChild(text);
      gallery.appendChild(placeholders);
      container.appendChild(gallery);
      return;
    }

    var list = document.createElement('ul');
    list.className = 'comics-list';

    comics.forEach(function (comic) {
      var item = document.createElement('li');
      item.className = 'comics-list__item';

      var card = document.createElement('article');
      card.className = 'comic-card card';

      if (comic.image) {
        var img = document.createElement('img');
        img.className = 'comic-card__img';
        img.src = comic.image;
        img.alt = comic.title;
        img.loading = 'lazy';
        card.appendChild(img);
      }

      var comicTitle = document.createElement('h3');
      comicTitle.className = 'comic-card__title';
      comicTitle.textContent = comic.title;
      card.appendChild(comicTitle);

      item.appendChild(card);
      list.appendChild(item);
    });

    container.appendChild(list);
  }

  portal.onReady(function () {
    var container = document.querySelector('[data-comics-list]');
    if (container) renderComics(container);
  });
})();
