(function (global) {
  'use strict';

  global.ReadingPortal = global.ReadingPortal || {};
  global.ReadingPortal.books = [
    {
      id: 'alice-journey',
      title: 'Приключения Алисы',
      subtitle: 'Тайна третьей планеты',
      author: 'Кир Булычёв',
      route: 'Экспедиция №1',
      color: '#4a7cb8',
      cover: 'images/covers/alice-journey.png',
      status: 'open'
    },
    {
      id: 'alice-asteroid',
      title: 'Приключения Алисы',
      subtitle: 'Пленники астероида',
      author: 'Кир Булычёв',
      route: 'Экспедиция №2',
      color: '#4a7c59',
      cover: 'images/covers/alice-asteroid.png',
      status: 'soon'
    },
    {
      id: 'alice-city',
      title: 'Приключения Алисы',
      subtitle: 'Город без памяти',
      author: 'Кир Булычёв',
      route: 'Экспедиция №3',
      color: '#3d5a80',
      cover: 'images/covers/alice-city.png',
      status: 'soon'
    },
    {
      id: 'alice-time',
      title: 'Приключения Алисы',
      subtitle: 'Война времени',
      author: 'Кир Булычёв',
      route: 'Экспедиция №4',
      color: '#5b4bb4',
      cover: 'images/covers/alice-time.png',
      status: 'soon'
    }
  ];
})(window);
