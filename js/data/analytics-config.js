(function (global) {
  'use strict';

  global.ReadingPortal = global.ReadingPortal || {};

  /**
   * Анонимная аналитика / опрос.
   * Заполните ОДИН из вариантов, чтобы видеть ответы:
   * 1) formEndpoint — Formspree (https://formspree.io), пример: 'https://formspree.io/f/xxxxxx'
   * 2) gaMeasurementId — Google Analytics 4, пример: 'G-XXXXXXXX'
   * Пока оба пустые — события в интерфейсе работают, но агрегированные цифры автору не уходят.
   */
  global.ReadingPortal.analyticsConfig = {
    surveyId: 'photo-diary-v1',
    formEndpoint: '',
    gaMeasurementId: ''
  };
})(window);
