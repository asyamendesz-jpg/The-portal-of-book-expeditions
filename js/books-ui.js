(function (global) {
  'use strict';

  global.ReadingPortal = global.ReadingPortal || {};

  global.ReadingPortal.createBookCard = function (book, options) {
    options = options || {};
    var isSoon = book.status === 'soon';
    var linkHref = options.linkHref || (isSoon ? '#' : 'heroes.html?book=' + encodeURIComponent(book.id));
    var linkText = options.linkText || (isSoon ? 'Скоро откроется' : 'Отправиться в экспедицию');

    var card = document.createElement('article');
    card.className = 'book-card card' + (isSoon ? ' book-card--soon' : '');

    var cover = document.createElement('div');
    cover.className = 'book-card__cover';

    if (book.cover) {
      var coverImg = document.createElement('img');
      coverImg.className = 'book-card__cover-img';
      coverImg.src = book.cover;
      coverImg.alt = 'Обложка: ' + (book.subtitle || book.title);
      coverImg.loading = 'lazy';
      cover.appendChild(coverImg);
    } else {
      cover.style.backgroundColor = book.color || '#8b7355';
    }

    if (isSoon) {
      var badge = document.createElement('span');
      badge.className = 'book-card__badge';
      badge.textContent = 'Скоро';
      cover.appendChild(badge);
    }

    var body = document.createElement('div');
    body.className = 'book-card__body';

    var title = document.createElement('h3');
    title.className = 'book-card__title';
    title.textContent = book.subtitle || book.title;

    var author = document.createElement('p');
    author.className = 'book-card__author';
    author.textContent = book.author;

    body.appendChild(title);
    body.appendChild(author);

    if (book.route) {
      var route = document.createElement('p');
      route.className = 'book-card__route';
      route.textContent = book.route;
      body.appendChild(route);
    }

    var link = document.createElement(isSoon ? 'span' : 'a');
    link.className = 'btn btn--primary book-card__link' + (isSoon ? ' book-card__link--disabled' : '');
    if (!isSoon) {
      link.href = linkHref;
      link.setAttribute('aria-label', linkText + ': ' + (book.subtitle || book.title));
    }
    link.textContent = linkText;
    body.appendChild(link);

    card.appendChild(cover);
    card.appendChild(body);

    return card;
  };

  global.ReadingPortal.renderBookGrid = function (container, options) {
    var books = global.ReadingPortal.books;

    container.innerHTML = '';

    if (!books || !books.length) {
      container.appendChild(
        global.ReadingPortal.createEmpty('book-catalog__empty', 'Экспедиции скоро откроются.')
      );
      return;
    }

    var list = document.createElement('ul');
    list.className = 'book-catalog__list';

    books.forEach(function (book) {
      var item = document.createElement('li');
      item.className = 'book-catalog__item';
      item.appendChild(global.ReadingPortal.createBookCard(book, options));
      list.appendChild(item);
    });

    container.appendChild(list);
  };
})(window);
