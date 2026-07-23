(function () {
  'use strict';

  var portal = window.ReadingPortal;

  function createCard(card) {
    var article = document.createElement('article');
    article.className = 'note-card card';

    if (card.image) {
      var photo = document.createElement('img');
      photo.className = 'note-card__photo';
      photo.src = card.image;
      photo.alt = card.name;
      photo.loading = 'lazy';
      article.appendChild(photo);
    }

    var title = document.createElement('h3');
    title.className = 'note-card__title';
    title.textContent = card.name;

    var role = document.createElement('p');
    role.className = 'note-card__role';
    role.textContent = card.role;

    var text = document.createElement('p');
    text.className = 'note-card__text';
    text.textContent = card.description;

    article.appendChild(title);
    article.appendChild(role);
    article.appendChild(text);

    return article;
  }

  function renderCards(container) {
    var cards = portal.cards;
    container.innerHTML = '';

    if (!cards || !cards.length) {
      container.appendChild(portal.createEmpty('cards-empty', 'Экспедиционные записи скоро появятся.'));
      return;
    }

    var list = document.createElement('ul');
    list.className = 'cards-list';

    cards.forEach(function (card) {
      var item = document.createElement('li');
      item.className = 'cards-list__item';
      item.appendChild(createCard(card));
      list.appendChild(item);
    });

    container.appendChild(list);
  }

  portal.onReady(function () {
    var container = document.querySelector('[data-cards-list]');
    if (container) renderCards(container);
  });
})();
