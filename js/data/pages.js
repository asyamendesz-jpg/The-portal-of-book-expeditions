(function (global) {
  'use strict';

  global.ReadingPortal = global.ReadingPortal || {};
  global.ReadingPortal.pages = [
    { href: 'index.html', label: 'Главная', icon: 'images/icons/home.svg' },
    { href: 'book-travel.html', label: 'Книжные путешествия', icon: 'images/icons/travel.svg' },
    { href: 'heroes.html', label: 'Герои книг', icon: 'images/icons/heroes.svg' },
    { href: 'cards.html', label: 'Карточки персонажей', icon: 'images/icons/cards.svg' },
    { href: 'passports.html', label: 'Паспорта героев', icon: 'images/icons/passports.svg' },
    { href: 'comics.html', label: 'Комиксы читателей', icon: 'images/icons/comics.svg' },
    { href: 'workbooks.html', label: 'Экспедиционные комплекты', icon: 'images/icons/workbooks.svg' },
    { href: 'quiz.html', label: 'Викторины и загадки', icon: 'images/icons/quiz.svg' },
    { href: 'adults.html', label: 'Взрослым', icon: 'images/icons/adults.svg' }
  ];

  global.ReadingPortal.banners = {
    'book-travel': {
      image: 'images/mockups/knizhnye-puteshestviya.png',
      alt: 'Карта книжных путешествий',
      title: 'Книжные путешествия',
      intro: 'Выбери маршрут и отправляйся в увлекательное приключение!'
    },
    heroes: {
      image: 'images/mockups/geroi-knig.png',
      alt: 'Герои книг',
      title: 'Герои книг',
      intro: 'Загляни внутрь книги и познакомься с героями!'
    },
    cards: {
      image: 'images/mockups/kartochki.png',
      alt: 'Карточки персонажей',
      title: 'Карточки персонажей',
      intro: 'Собери коллекцию героев любимых книг!'
    },
    passports: {
      image: 'images/mockups/kartochki.png',
      alt: 'Паспорта героев',
      title: 'Паспорта героев',
      intro: 'Заполни личное досье участника книжной экспедиции.'
    },
    comics: {
      image: 'images/mockups/komiksy.png',
      alt: 'Комиксы читателей',
      title: 'Комиксы читателей',
      intro: 'Твои истории оживают в кадрах!'
    },
    workbooks: {
      image: 'images/mockups/expeditsiya-start.png',
      alt: 'Экспедиционные комплекты',
      title: 'Экспедиционные комплекты',
      intro: 'Скачай PDF-материалы из архива путешественника.'
    },
    quiz: {
      image: 'images/mockups/viktoriny.png',
      alt: 'Викторины и загадки',
      title: 'Викторины и загадки',
      intro: 'Проверь себя, узнай новое, стань настоящим знатоком книг!'
    },
    adults: {
      image: 'images/mockups/glavnaya.png',
      alt: 'Для взрослых',
      title: 'Взрослым',
      intro: 'Материалы для родителей, учителей и библиотекарей.'
    }
  };

  global.ReadingPortal.expeditionRoute = [
    { icon: '📦', text: 'Получи комплект исследователя (скачать PDF)', href: 'workbooks.html' },
    { icon: '⭐', text: 'Прослушай аудиоэпизод', href: 'book-travel.html' },
    { icon: '⭐', text: 'Познакомься с героями', href: 'heroes.html' },
    { icon: '⭐', text: 'Выполни задания', href: 'workbooks.html' },
    { icon: '⭐', text: 'Помоги восстановить портрет неизвестного героя', href: 'cards.html' },
    { icon: '⭐', text: 'Собери карточку персонажа', href: 'cards.html' },
    { icon: '⭐', text: 'Получи достижение', href: 'quiz.html' }
  ];
})(window);
