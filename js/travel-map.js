(function () {
  'use strict';

  var portal = window.ReadingPortal;

  function createChapterCard(chapter) {
    var article = document.createElement('article');
    article.className = 'chapter-card card';
    article.id = chapter.id;

    var badge = document.createElement('p');
    badge.className = 'chapter-card__badge';
    badge.textContent = 'Глава ' + chapter.number;

    var title = document.createElement('h3');
    title.className = 'chapter-card__title';
    title.textContent = chapter.title;

    var text = document.createElement('p');
    text.className = 'chapter-card__text';
    text.textContent = chapter.description;

    var link = document.createElement('a');
    link.className = 'btn btn--secondary chapter-card__link';
    link.href = chapter.href;
    link.textContent = chapter.linkLabel || 'Открыть';

    article.appendChild(badge);
    article.appendChild(title);
    article.appendChild(text);
    article.appendChild(link);
    return article;
  }

  function renderTravelMap(container) {
    var chapters = portal.chapters || [];
    container.innerHTML = '';

    if (!chapters.length) {
      container.appendChild(portal.createEmpty('travel-map-empty', 'Карта маршрута скоро появится.'));
      return;
    }

    var section = document.createElement('section');
    section.className = 'travel-map';
    section.setAttribute('aria-labelledby', 'travel-map-title');

    var heading = document.createElement('h2');
    heading.className = 'section-title';
    heading.id = 'travel-map-title';
    heading.textContent = 'Карта маршрута';

    var lead = document.createElement('p');
    lead.className = 'page-intro';
    lead.textContent = 'Четыре главы одной экспедиции — иди по порядку или возвращайся к любому этапу.';

    var list = document.createElement('ol');
    list.className = 'travel-map__list';

    chapters.forEach(function (chapter) {
      var item = document.createElement('li');
      item.className = 'travel-map__item';
      item.appendChild(createChapterCard(chapter));
      list.appendChild(item);
    });

    section.appendChild(heading);
    section.appendChild(lead);
    section.appendChild(list);
    container.appendChild(section);
  }

  portal.onReady(function () {
    var host = document.querySelector('[data-travel-map]');
    if (host) renderTravelMap(host);
  });
})();
