(function (global) {
  'use strict';

  global.ReadingPortal = global.ReadingPortal || {};

  /**
   * Главы маршрута «Приключения Алисы» для карты путешествия.
   */
  global.ReadingPortal.chapters = [
    {
      id: 'chapter-1',
      number: 1,
      title: 'Тайна начинается',
      description: 'Экспедиция стартует. Выбери книгу и отправляйся в путь.',
      href: 'heroes.html?book=alice-journey',
      linkLabel: 'К героям'
    },
    {
      id: 'chapter-2',
      number: 2,
      title: 'Неожиданная встреча',
      description: 'Послушай эпизод и познакомься с персонажами.',
      href: 'trial-cards.html',
      linkLabel: 'Слушать эпизод'
    },
    {
      id: 'chapter-3',
      number: 3,
      title: 'Опасность впереди',
      description: 'Выполни задания и собери карточки героев.',
      href: 'trial-tasks.html',
      linkLabel: 'К заданиям'
    },
    {
      id: 'chapter-4',
      number: 4,
      title: 'Разгадка тайны',
      description: 'Полевое задание, дневник и достижения экспедиции.',
      href: 'field-task.html',
      linkLabel: 'К полевому заданию'
    }
  ];
})(window);
