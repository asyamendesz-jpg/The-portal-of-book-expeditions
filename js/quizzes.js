(function () {
  'use strict';

  var portal = window.ReadingPortal;

  function createQuizCard(quiz) {
    var card = document.createElement('article');
    card.className = 'trial-card card';

    var title = document.createElement('h3');
    title.className = 'trial-card__title';
    title.textContent = quiz.title;

    var description = document.createElement('p');
    description.className = 'trial-card__description';
    description.textContent = quiz.description;

    card.appendChild(title);
    card.appendChild(description);

    var bookTitle = portal.getBookTitle(quiz.bookId);
    if (bookTitle) {
      var book = document.createElement('p');
      book.className = 'trial-card__book';
      book.textContent = 'Книга: «' + bookTitle + '»';
      card.appendChild(book);
    }

    if (quiz.stars) {
      var stars = document.createElement('p');
      stars.className = 'trial-card__stars';
      stars.textContent = '⭐ ' + quiz.stars + ' звёзд';
      card.appendChild(stars);
    }

    var link = document.createElement('a');
    link.className = 'btn btn--primary trial-card__link';
    link.href = quiz.href || '#';
    link.textContent = 'Начать испытание';
    link.setAttribute('aria-label', 'Начать испытание: ' + quiz.title);
    card.appendChild(link);

    return card;
  }

  function renderQuizzes(container) {
    var quizzes = portal.quizzes;
    container.innerHTML = '';

    if (!quizzes || !quizzes.length) {
      container.appendChild(portal.createEmpty('trials-empty', 'Испытания скоро появятся.'));
      return;
    }

    var list = document.createElement('ul');
    list.className = 'trials-list';

    quizzes.forEach(function (quiz) {
      var item = document.createElement('li');
      item.className = 'trials-list__item';
      item.appendChild(createQuizCard(quiz));
      list.appendChild(item);
    });

    container.appendChild(list);
  }

  portal.onReady(function () {
    var container = document.querySelector('[data-quiz-list]');
    if (container) renderQuizzes(container);
  });
})();
