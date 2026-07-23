(function () {
  'use strict';

  var portal = window.ReadingPortal;

  function renderComics(container) {
    var comics = portal.comics;
    container.innerHTML = '';

    if (!comics || !comics.length) {
      container.appendChild(
        portal.createEmpty('section-soon', 'Альбом скоро пополнится новыми работами. Твори и делись своими историями!')
      );
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

      var title = document.createElement('h3');
      title.className = 'comic-card__title';
      title.textContent = comic.title;
      card.appendChild(title);

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
