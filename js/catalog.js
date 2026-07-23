(function () {
  'use strict';

  var portal = window.ReadingPortal;

  function initCatalog() {
    var container = document.querySelector('[data-book-catalog]');
    if (!container) return;

    portal.renderBookGrid(container);
  }

  portal.onReady(initCatalog);
})();
