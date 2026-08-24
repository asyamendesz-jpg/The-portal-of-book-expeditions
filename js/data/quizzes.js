(function (global) {
  'use strict';

  global.ReadingPortal = global.ReadingPortal || {};
  global.ReadingPortal.quizzes = [
    {
      id: 'alice-cards',
      title: 'Карточки Алисы',
      section: 'Приключения Алисы',
      description: 'Прослушай отрывок из книги и выполни задания на карточках.',
      instruction: 'Внимательно прослушай аудиозапись. Затем скачай PDF с карточками, распечатай их или открой на экране и выполни задания от руки.',
      hint: 'Прослушай отрывок, затем скачай задание и выполни его.',
      bookId: 'alice-journey',
      page: 'trial-cards.html',
      pdf: 'pdf/kartochki-alisy.pdf',
      audio: 'audio/epizod-2.mp3',
      playLabel: '▶ Прослушать отрывок',
      downloadLabel: 'Скачать задание PDF'
    },
    {
      id: 'alice-tasks',
      title: 'Задания экспедиции',
      section: 'Приключения Алисы',
      description: 'Прослушай эпизод и выполни задания из PDF.',
      instruction: 'Прослушай аудиоэпизод. Затем скачай PDF с заданиями, распечатай или открой на экране и выполни их от руки.',
      hint: 'Сначала прослушай эпизод, затем скачай PDF и выполни задания.',
      bookId: 'alice-journey',
      page: 'trial-tasks.html',
      pdf: 'pdf/zadaniya-alisy.pdf',
      audio: 'audio/epizod-3.mp3',
      playLabel: '▶ Прослушать эпизод',
      downloadLabel: 'Скачать PDF',
      simpleActions: true
    }
  ];
})(window);
