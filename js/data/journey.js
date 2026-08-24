(function (global) {
  'use strict';

  global.ReadingPortal = global.ReadingPortal || {};

  /**
   * Детский маршрут внутри «Приключений Алисы».
   * Точки — существующие страницы (без дубликатов).
   */
  global.ReadingPortal.journeySteps = [
    {
      id: 'episode',
      short: 'Слушаем',
      title: 'Послушай эпизод',
      href: 'trial-cards.html',
      flag: 'episodeCompleted',
      doneLabel: 'Послушал эпизод'
    },
    {
      id: 'heroes',
      short: 'Герои',
      title: 'Познакомься с героями',
      href: 'heroes.html?book=alice-journey&step=meet',
      flag: 'charactersViewed',
      doneLabel: 'Познакомился с героями'
    },
    {
      id: 'tasks',
      short: 'Испытания',
      title: 'Выполни задания',
      href: 'trial-tasks.html',
      flag: 'tasksCompleted',
      doneLabel: 'Выполнил задания'
    },
    {
      id: 'guess',
      short: 'Узнай',
      title: 'Узнай героя по описанию',
      href: 'cards.html?mode=guess',
      flag: 'characterQuizCompleted',
      doneLabel: 'Узнал героев'
    },
    {
      id: 'card',
      short: 'Карточка',
      title: 'Собери карточку персонажа',
      href: 'cards.html?mode=build',
      flag: 'characterCardCompleted',
      doneLabel: 'Собрал карточку'
    },
    {
      id: 'achievements',
      short: 'Награда',
      title: 'Достижения',
      href: 'achievements.html',
      flag: 'expeditionCompleted',
      doneLabel: 'Получил достижение'
    }
  ];

  global.ReadingPortal.journeyNextCopy = {
    episode: {
      title: 'Эпизод прослушан!',
      text: 'Теперь давай познакомимся с героями этой истории.',
      cta: 'Познакомиться с героями →',
      nextId: 'heroes'
    },
    heroes: {
      title: 'С героями познакомились!',
      text: 'Теперь проверим, насколько хорошо ты их запомнил.',
      cta: 'Выполнить задания →',
      nextId: 'tasks'
    },
    tasks: {
      title: 'Задания выполнены!',
      text: 'Пора узнать героя по описанию.',
      cta: 'Узнать героя по описанию →',
      nextId: 'guess'
    },
    guess: {
      title: 'Отлично! Героев ты узнаёшь.',
      text: 'Теперь попробуй собрать собственного персонажа.',
      cta: 'Собрать карточку персонажа →',
      nextId: 'card'
    },
    card: {
      title: 'Карточка готова!',
      text: 'Загляни в свои достижения экспедиции.',
      cta: 'Посмотреть мои достижения →',
      nextId: 'achievements'
    },
    achievements: {
      title: 'Экспедиция завершена!',
      text: 'Ты прошёл весь маршрут по «Приключениям Алисы».',
      cta: 'На главную',
      nextId: null
    }
  };
})(window);
