(function () {
  'use strict';

  var portal = window.ReadingPortal;

  function renderBooksSection(container) {
    var section = document.createElement('section');
    section.className = 'home-books';

    var heading = document.createElement('h2');
    heading.className = 'section-title';
    heading.textContent = 'Открытые экспедиции';

    var grid = document.createElement('div');
    grid.className = 'home-books__grid';

    section.appendChild(heading);
    section.appendChild(grid);
    container.appendChild(section);

    portal.renderBookGrid(grid);
  }

  function initHome() {
    var booksEl = document.querySelector('[data-home-books]');
    if (booksEl) renderBooksSection(booksEl);

    if (portal.initHomeJourneyCta) {
      portal.initHomeJourneyCta();
    }

    var cta = document.querySelector('[data-journey-home-cta], .expedition-card .btn--cta');
    if (cta && portal.track) {
      cta.addEventListener('click', function () {
        portal.track('expedition_started', { expeditionId: 'alice-journey' });
      });
    }
  }

  portal.onReady(initHome);
})();
