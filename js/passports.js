(function () {
  'use strict';

  var portal = window.ReadingPortal;

  function createPassportCard(passport) {
    var card = document.createElement('article');
    card.className = 'passport-card card';

    var label = document.createElement('span');
    label.className = 'passport-card__label';
    label.textContent = 'Досье';

    var title = document.createElement('h3');
    title.className = 'passport-card__title';
    title.textContent = passport.title;

    var description = document.createElement('p');
    description.className = 'passport-card__description';
    description.textContent = passport.description;

    card.appendChild(label);
    card.appendChild(title);
    card.appendChild(description);

    var bookTitle = portal.getBookTitle(passport.bookId);
    if (bookTitle) {
      var book = document.createElement('p');
      book.className = 'passport-card__book';
      book.textContent = 'Экспедиция: «' + bookTitle + '»';
      card.appendChild(book);
    }

    return card;
  }

  function renderPassports(container) {
    var passports = portal.passports;
    container.innerHTML = '';

    if (!passports || !passports.length) {
      container.appendChild(portal.createEmpty('passports-empty', 'Паспорта скоро появятся.'));
      return;
    }

    var list = document.createElement('ul');
    list.className = 'passports-list';

    passports.forEach(function (passport) {
      var item = document.createElement('li');
      item.className = 'passports-list__item';
      item.appendChild(createPassportCard(passport));
      list.appendChild(item);
    });

    container.appendChild(list);
  }

  portal.onReady(function () {
    var container = document.querySelector('[data-passports-list]');
    if (container) renderPassports(container);
  });
})();
