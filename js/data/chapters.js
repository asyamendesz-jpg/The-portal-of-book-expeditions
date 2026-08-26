(function (global) {
  'use strict';

  global.ReadingPortal = global.ReadingPortal || {};

  /**
   * Главы маршрута «Приключения Алисы» (справочно; основной путь — journeySteps).
   */
  global.ReadingPortal.chapters = [
    {
      id: 'chapter-1',
      number: 1,
      title: 'Тайна начинается',
      description: 'Выбери книгу и начни путешествие.',
      href: 'heroes.html?book=alice-journey',
      linkLabel: 'К экспедиции'
    },
    {
      id: 'chapter-2',
      number: 2,
      title: 'Неожиданная встреча',
      description: 'Послушай эпизод и познакомься с героями.',
      href: 'trial-cards.html',
      linkLabel: 'Слушать эпизод'
    },
    {
      id: 'chapter-3',
      number: 3,
      title: 'Опасность впереди',
      description: 'Узнай героев и собери карточки.',
      href: 'cards.html?mode=guess',
      linkLabel: 'К испытанию'
    },
    {
      id: 'chapter-4',
      number: 4,
      title: 'Разгадка тайны',
      description: 'Полевое задание, дневник и достижения.',
      href: 'field-task.html',
      linkLabel: 'К заданию'
    }
  ];
})(window);
