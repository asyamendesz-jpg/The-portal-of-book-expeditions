(function (global) {
  'use strict';

  global.ReadingPortal = global.ReadingPortal || {};
  global.ReadingPortal.pages = [
    { href: 'index.html', label: 'Главная', icon: 'images/icons/home.svg' },
    { href: 'book-travel.html', label: 'Книжные путешествия', icon: 'images/icons/travel.svg' },
    { href: 'heroes.html', label: 'Герои книг', icon: 'images/icons/heroes.svg' },
    { href: 'cards.html', label: 'Карточки персонажей', icon: 'images/icons/cards.svg' },
    { href: 'diary.html', label: 'Дневник экспедиции', icon: 'images/icons/passports.svg' },
    { href: 'passports.html', label: 'Паспорта героев', icon: 'images/icons/passports.svg' },
    { href: 'comics.html', label: 'Комиксы читателей', icon: 'images/icons/comics.svg' },
    { href: 'workbooks.html', label: 'Экспедиционные комплекты', icon: 'images/icons/workbooks.svg' },
    { href: 'quiz.html', label: 'Викторины и загадки', icon: 'images/icons/quiz.svg' },
    { href: 'adults.html', label: 'Взрослым', icon: 'images/icons/adults.svg' }
  ];

  global.ReadingPortal.banners = {
    'book-travel': {
      image: 'images/mockups/knizhnye-puteshestviya.jpg',
      alt: 'Карта книжных путешествий',
      title: 'Книжные путешествия',
      intro: 'Выбери маршрут и отправляйся в увлекательное приключение!'
    },
    heroes: {
      image: 'images/mockups/geroi-knig.jpg',
      alt: 'Герои книг',
      title: 'Герои книг',
      intro: 'Загляни внутрь книги и познакомься с героями!'
    },
    cards: {
      image: 'images/mockups/kartochki.jpg',
      alt: 'Карточки персонажей',
      title: 'Карточки персонажей',
      intro: 'Собери коллекцию героев любимых книг!'
    },
    passports: {
      image: 'images/mockups/kartochki.jpg',
      alt: 'Паспорта героев',
      title: 'Паспорта героев',
      intro: 'Заполни личное досье участника книжной экспедиции.'
    },
    comics: {
      image: 'images/mockups/komiksy.jpg',
      alt: 'Комиксы читателей',
      title: 'Комиксы читателей',
      intro: 'Твои истории оживают в кадрах!'
    },
    workbooks: {
      image: 'images/mockups/expeditsiya-start.jpg',
      alt: 'Экспедиционные комплекты',
      title: 'Экспедиционные комплекты',
      intro: 'Скачай PDF-материалы из архива путешественника.'
    },
    quiz: {
      image: 'images/mockups/viktoriny.jpg',
      alt: 'Викторины и загадки',
      title: 'Викторины и загадки',
      intro: 'Проверь себя, узнай новое, стань настоящим знатоком книг!'
    },
    adults: {
      image: 'images/mockups/glavnaya.jpg',
      alt: 'Для взрослых',
      title: 'Взрослым',
      intro: 'Материалы для родителей, учителей и библиотекарей.'
    }
  };

  global.ReadingPortal.expeditionRoute = [
    { icon: '🗺️', text: 'Книжные путешествия', href: 'book-travel.html' },
    { icon: '⭐', text: 'Выбери книгу — Приключения Алисы', href: 'heroes.html?book=alice-journey' },
    { icon: '🎧', text: 'Послушай эпизод', href: 'trial-cards.html' },
    { icon: '⭐', text: 'Познакомься с героями', href: 'heroes.html?book=alice-journey&step=meet' },
    { icon: '✏️', text: 'Выполни задания', href: 'trial-tasks.html' },
    { icon: '🔍', text: 'Узнай героя по описанию', href: 'cards.html?mode=guess' },
    { icon: '🃏', text: 'Собери карточку персонажа', href: 'cards.html?mode=build' },
    { icon: '✏️', text: 'Полевое задание — нарисуй планету', href: 'field-task.html' },
    { icon: '📔', text: 'Дневник экспедиции', href: 'diary.html' },
    { icon: '🏆', text: 'Посмотри достижения', href: 'achievements.html' }
  ];
})(window);
