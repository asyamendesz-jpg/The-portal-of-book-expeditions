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
      pdf: 'pdf/kartochki-alisy.pdf',
      audio: 'audio/epizod-2.mp3'
    }
  ];
})(window);
