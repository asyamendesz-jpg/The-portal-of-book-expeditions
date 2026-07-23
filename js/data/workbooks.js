(function (global) {
  'use strict';

  global.ReadingPortal = global.ReadingPortal || {};
  global.ReadingPortal.workbooks = [
    {
      id: 'kit-1',
      title: 'Экспедиционный комплект 1',
      description: 'Материалы для книжного путешествия по «Путешествию Алисы».',
      bookId: 'alice-journey',
      file: 'pdf/комплект 1.pdf'
    },
    {
      id: 'traveler',
      title: 'Путешественник',
      description: 'Документ путешественника для экспедиции.',
      bookId: 'alice-journey',
      file: 'pdf/путешественник.pdf'
    },
    {
      id: 'certificate-1',
      title: 'Сертификат 1',
      description: 'Сертификат участника экспедиции.',
      bookId: 'alice-journey',
      file: 'pdf/сертификат-1.pdf'
    },
    {
      id: 'certificate-2',
      title: 'Сертификат 2',
      description: 'Сертификат участника экспедиции.',
      bookId: 'alice-journey',
      file: 'pdf/сертификат 2.pdf'
    }
  ];
})(window);
