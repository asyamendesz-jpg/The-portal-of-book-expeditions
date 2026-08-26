(function (global) {
  'use strict';

  global.ReadingPortal = global.ReadingPortal || {};

  /**
   * Полевые (офлайн) задания — ребёнок делает руками вне экрана.
   */
  global.ReadingPortal.fieldTasks = [
    {
      id: 'alice-unknown-planet',
      expeditionId: 'alice-journey',
      type: 'draw',
      typeLabel: 'Нарисуй',
      title: 'Неизвестная планета',
      prompt: 'Нарисуй, как ты представляешь неизвестную планету, которую могла бы исследовать Алиса.',
      hint: 'Используй карандаши, фломастеры, краски или любые материалы, которые есть дома.',
      nextHref: 'diary.html',
      nextLabel: 'Открыть Дневник →'
    }
  ];
})(window);
