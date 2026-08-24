(function () {
  'use strict';

  var portal = window.ReadingPortal;

  function initCatalog() {
    var container = document.querySelector('[data-book-catalog]');
    if (!container) return;

    portal.renderBookGrid(container);

    if (portal.initBookTravelJourney) {
      portal.initBookTravelJourney();
    }
  }

  portal.onReady(initCatalog);
})();
