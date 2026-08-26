(function (global) {
  'use strict';

  global.ReadingPortal = global.ReadingPortal || {};
  global.ReadingPortal.pages = [
    { href: 'index.html', label: 'Главная', icon: 'images/icons/home.svg' },
    { href: 'book-travel.html', label: 'Книжные путешествия', icon: 'images/icons/travel.svg' },
    { href: 'heroes.html', label: 'Герои книг', icon: 'images/icons/heroes.svg' },
    { href: 'cards.html', label: 'Карточки персонажей', icon: 'images/icons/cards.svg' },
    { href: 'diary.html', label: 'Дневник экспедиции', icon: 'images/icons/diary.svg' },
    { href: 'passports.html', label: 'Паспорта героев', icon: 'images/icons/passports.svg' },
    { href: 'comics.html', label: 'Комиксы читателей', icon: 'images/icons/comics.svg' },
    { href: 'workbooks.html', label: 'Экспедиционные комплекты', icon: 'images/icons/workbooks.svg' },
    { href: 'quiz.html', label: 'Викторины и загадки', icon: 'images/icons/quiz.svg' },
    { href: 'adults.html', label: 'Взрослым', icon: 'images/icons/adults.svg' }
  ];
  /* алиас из плана сборки */
  global.ReadingPortal.PAGES = global.ReadingPortal.pages;

  global.ReadingPortal.banners = {
    'book-travel': {
      image: 'images/mockups/book-travel.png',
      alt: 'Карта книжных путешествий',
      title: 'Книжные путешествия',
      intro: 'Выбери маршрут и отправляйся в увлекательное приключение!'
    },
    heroes: {
      image: 'images/mockups/heroes.png',
      alt: 'Герои книг',
      title: 'Герои книг',
      intro: 'Загляни внутрь книги и познакомься с героями!'
    },
    cards: {
      image: 'images/mockups/cards.png',
      alt: 'Карточки персонажей',
      title: 'Карточки персонажей',
      intro: 'Собери коллекцию героев любимых книг!'
    },
    passports: {
      image: 'images/mockups/cards.png',
      alt: 'Паспорта героев',
      title: 'Паспорта героев',
      intro: 'Заполни личное досье участника книжной экспедиции.'
    },
    comics: {
      image: 'images/mockups/comics.png',
      alt: 'Комиксы читателей',
      title: 'Комиксы читателей',
      intro: 'Твои истории оживают в кадрах!'
    },
    workbooks: {
      image: 'images/mockups/expedition-start.png',
      alt: 'Экспедиционные комплекты',
      title: 'Экспедиционные комплекты',
      intro: 'Скачай PDF-материалы из архива путешественника.'
    },
    quiz: {
      image: 'images/mockups/quiz.png',
      alt: 'Викторины и загадки',
      title: 'Викторины и загадки',
      intro: 'Проверь себя, узнай новое, стань настоящим знатоком книг!'
    },
    adults: {
      image: 'images/mockups/home.png',
      alt: 'Для взрослых',
      title: 'Взрослым',
      intro: 'Материалы для родителей, учителей и библиотекарей.'
    }
  };

  global.ReadingPortal.expeditionRoute = [
    { icon: '1.', text: 'Книжные путешествия', href: 'book-travel.html' },
    { icon: '2.', text: 'Приключения Алисы', href: 'heroes.html?book=alice-journey' },
    { icon: '3.', text: 'Послушай эпизод', href: 'trial-cards.html' },
    { icon: '4.', text: 'Познакомься с героями', href: 'heroes.html?book=alice-journey&step=meet' },
    { icon: '5.', text: 'Выполни задания', href: 'trial-tasks.html' },
    { icon: '6.', text: 'Узнай героя по описанию', href: 'cards.html?mode=guess' },
    { icon: '7.', text: 'Собери карточку', href: 'cards.html?mode=build' },
    { icon: '8.', text: 'Полевое задание', href: 'field-task.html' },
    { icon: '9.', text: 'Дневник', href: 'diary.html' },
    { icon: '10.', text: 'Достижения', href: 'achievements.html' }
  ];
})(window);
