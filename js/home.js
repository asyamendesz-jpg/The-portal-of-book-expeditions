(function () {
  'use strict';

  var portal = window.ReadingPortal;

  function renderExpedition(container) {
    var route = portal.expeditionRoute || [];

    var card = document.createElement('section');
    card.className = 'expedition-card card';

    var title = document.createElement('h2');
    title.className = 'expedition-card__title';
    title.textContent = '🚀 Экспедиция готова к старту';

    var subtitle = document.createElement('h3');
    subtitle.className = 'expedition-card__subtitle';
    subtitle.textContent = 'Маршрут экспедиции:';

    var list = document.createElement('ul');
    list.className = 'expedition-route';

    route.forEach(function (step) {
      var item = document.createElement('li');
      item.className = 'expedition-route__item';

      var link = document.createElement('a');
      link.className = 'expedition-route__link';
      link.href = step.href;
      link.innerHTML = '<span class="expedition-route__icon">' + step.icon + '</span> ' + step.text;

      item.appendChild(link);
      list.appendChild(item);
    });

    var cta = document.createElement('a');
    cta.className = 'btn btn--cta';
    cta.href = 'book-travel.html';
    cta.textContent = '🚀 НАЧАТЬ ЭКСПЕДИЦИЮ';

    card.appendChild(title);
    card.appendChild(subtitle);
    card.appendChild(list);
    card.appendChild(cta);
    container.appendChild(card);
  }

  function renderBooksSection(container) {
    var section = document.createElement('section');
    section.className = 'home-books';

    var heading = document.createElement('h2');
    heading.className = 'section-title';
    heading.textContent = 'Сегодня открыты экспедиции';

    var grid = document.createElement('div');
    grid.className = 'home-books__grid';

    section.appendChild(heading);
    section.appendChild(grid);
    container.appendChild(section);

    portal.renderBookGrid(grid);
  }

  function initHome() {
    var expeditionEl = document.querySelector('[data-home-expedition]');
    var booksEl = document.querySelector('[data-home-books]');

    if (expeditionEl) {
      renderExpedition(expeditionEl);
    }

    if (booksEl) {
      renderBooksSection(booksEl);
    }
  }

  portal.onReady(initHome);
})();
