(function () {
  'use strict';

  var portal = window.ReadingPortal;

  function renderComics(container) {
    var comics = portal.comics || [];
    container.innerHTML = '';

    var intro = document.createElement('section');
    intro.className = 'comics-intro';
    intro.innerHTML =
      '<h2 class="section-title">Комиксы читателей</h2>' +
      '<p class="page-intro">Здесь со временем появятся истории, созданные участниками книжных экспедиций.</p>' +
      '<p class="page-intro"><strong>А пока посмотри, каким может быть книжный комикс.</strong></p>';
    container.appendChild(intro);

    if (!comics.length) {
      container.appendChild(
        portal.createEmpty('section-soon', 'Примеры скоро появятся.')
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
        img.alt = comic.title || 'Пример комикса';
        img.loading = 'lazy';
        card.appendChild(img);
      }

      var comicTitle = document.createElement('h3');
      comicTitle.className = 'comic-card__title';
      comicTitle.textContent = comic.isExample ? 'Пример для вдохновения' : comic.title;
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
