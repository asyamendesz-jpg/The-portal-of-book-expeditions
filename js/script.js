(function () {
  'use strict';

  var portal = window.ReadingPortal;
  var MOBILE_BREAKPOINT = 768;
  var selectedBookId = null;

  function getCurrentPage() {
    var file = window.location.pathname.split('/').pop();
    file = file ? decodeURIComponent(file) : '';
    return !file || file === '/' ? 'index.html' : file;
  }

  function renderNav(nav) {
    var pages = portal.pages || [];
    var currentPage = getCurrentPage();

    var head = document.createElement('div');
    head.className = 'nav__head';

    var compass = document.createElement('img');
    compass.className = 'nav__compass';
    compass.src = 'images/decor/compass.svg';
    compass.alt = '';
    compass.setAttribute('aria-hidden', 'true');

    var title = document.createElement('h2');
    title.className = 'nav__title';
    title.textContent = 'Навигатор читателя';

    head.appendChild(compass);
    head.appendChild(title);
    nav.appendChild(head);

    var list = document.createElement('ul');
    list.className = 'nav-list';

    pages.forEach(function (page) {
      var item = document.createElement('li');
      item.className = 'nav-list__item';

      var link = document.createElement('a');
      link.className = 'nav-list__link';
      link.href = page.href;

      if (page.icon) {
        var icon = document.createElement('img');
        icon.className = 'nav-list__icon';
        icon.src = page.icon;
        icon.alt = '';
        icon.setAttribute('aria-hidden', 'true');
        link.appendChild(icon);
      }

      var label = document.createElement('span');
      label.className = 'nav-list__label';
      label.textContent = page.label;
      link.appendChild(label);

      if (page.href === currentPage) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }

      item.appendChild(link);
      list.appendChild(item);
    });

    nav.appendChild(list);
  }

  function initMobileNav(nav, sidebar) {
    var header = document.querySelector('.header');
    if (!header) return;

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav-toggle btn';
    toggle.setAttribute('aria-label', 'Открыть меню');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', nav.id || 'site-nav');
    toggle.textContent = 'Меню';
    header.appendChild(toggle);

    var overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.setAttribute('hidden', '');
    document.body.appendChild(overlay);

    function isOpen() {
      return sidebar.classList.contains('is-nav-open');
    }

    function closeNav() {
      sidebar.classList.remove('is-nav-open');
      overlay.setAttribute('hidden', '');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Открыть меню');
      document.body.classList.remove('is-nav-open');
    }

    function openNav() {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        closeNav();
        return;
      }
      sidebar.classList.add('is-nav-open');
      overlay.removeAttribute('hidden');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Закрыть меню');
      document.body.classList.add('is-nav-open');
    }

    toggle.addEventListener('click', function () {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        closeNav();
        return;
      }
      if (isOpen()) closeNav();
      else openNav();
    });

    overlay.addEventListener('click', closeNav);
    nav.querySelectorAll('.nav-list__link').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        closeNav();
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > MOBILE_BREAKPOINT && isOpen()) closeNav();
    });

    /* на случай залипшего overlay после прошлой сессии/бага */
    closeNav();
  }

  function initMenu() {
    var nav = document.querySelector('[data-nav]');
    if (!nav || nav.dataset.navReady === 'true') return;

    if (!nav.id) nav.id = 'site-nav';

    nav.classList.add('nav');
    nav.dataset.navReady = 'true';
    renderNav(nav);

    var sidebar = nav.closest('.sidebar');
    if (sidebar) initMobileNav(nav, sidebar);
  }

  function createHeroCard(hero) {
    var card = document.createElement('article');
    card.className = 'hero-card card';

    var portrait = document.createElement('div');
    portrait.className = 'hero-card__portrait';

    if (hero.image) {
      var photo = document.createElement('img');
      photo.className = 'hero-card__photo';
      photo.src = hero.image;
      photo.alt = hero.name;
      photo.loading = 'lazy';
      portrait.appendChild(photo);
    } else {
      portrait.style.backgroundColor = hero.color || '#8b7355';
    }

    var body = document.createElement('div');
    body.className = 'hero-card__body';

    var name = document.createElement('h3');
    name.className = 'hero-card__name';
    name.textContent = hero.name;

    var role = document.createElement('p');
    role.className = 'hero-card__role';
    role.textContent = hero.role;

    var description = document.createElement('p');
    description.className = 'hero-card__description';
    description.textContent = hero.description;

    body.appendChild(name);
    body.appendChild(role);
    body.appendChild(description);
    card.appendChild(portrait);
    card.appendChild(body);

    return card;
  }

  function renderBookPicker(container, onSelect) {
    var books = portal.books || [];
    container.innerHTML = '';

    var list = document.createElement('ul');
    list.className = 'book-picker';

    books.forEach(function (book) {
      var item = document.createElement('li');
      item.className = 'book-picker__item';

      var isSoon = book.status === 'soon';
      var btn = document.createElement(isSoon ? 'span' : 'button');
      if (!isSoon) btn.type = 'button';
      btn.className = 'book-picker__btn card' + (isSoon ? ' book-picker__btn--soon' : '');
      if (book.id === selectedBookId && !isSoon) btn.classList.add('is-active');
      if (!isSoon) btn.dataset.bookId = book.id;

      if (book.cover) {
        var img = document.createElement('img');
        img.className = 'book-picker__cover';
        img.src = book.cover;
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        btn.appendChild(img);
      }

      var title = document.createElement('span');
      title.className = 'book-picker__title';
      title.textContent = book.title;
      btn.appendChild(title);

      if (isSoon) {
        var badge = document.createElement('span');
        badge.className = 'book-picker__badge';
        badge.textContent = 'Скоро';
        btn.appendChild(badge);
      } else {
        var available = document.createElement('span');
        available.className = 'book-picker__available';
        available.textContent = 'Открыто сейчас';
        btn.appendChild(available);

        btn.addEventListener('click', function () {
          selectedBookId = book.id;
          onSelect(book.id);
          container.querySelectorAll('.book-picker__btn').forEach(function (el) {
            el.classList.toggle('is-active', el.dataset.bookId === book.id);
          });
        });
      }

      item.appendChild(btn);
      list.appendChild(item);
    });

    container.appendChild(list);
  }

  function renderHeroesList(container, bookId) {
    var heroes = portal.heroes || [];
    var filtered = heroes.filter(function (h) { return h.bookId === bookId; });

    container.innerHTML = '';

    if (!filtered.length) {
      container.appendChild(portal.createEmpty('hero-list__empty', 'Герои этой книги скоро появятся.'));
      return;
    }

    var list = document.createElement('ul');
    list.className = 'hero-list';

    filtered.forEach(function (hero) {
      var item = document.createElement('li');
      item.className = 'hero-list__item';
      item.appendChild(createHeroCard(hero));
      list.appendChild(item);
    });

    container.appendChild(list);
  }

  function renderHeroesJourneyPanel(bookId, listEl) {
    var step = portal.getQueryParam('step');
    var isAlice = bookId === 'alice-journey';
    var host = document.querySelector('[data-journey-heroes-cta]');
    var content = document.querySelector('main.content');

    if (!host && content) {
      host = document.createElement('div');
      host.setAttribute('data-journey-heroes-cta', '');
      if (listEl && listEl.parentNode) {
        listEl.parentNode.insertBefore(host, listEl);
      } else {
        content.appendChild(host);
      }
    }

    if (!host) return;
    host.innerHTML = '';

    if (!isAlice) {
      host.hidden = true;
      return;
    }

    host.hidden = false;
    portal.markJourneyFlag('bookSelected');

    if (portal.track) {
      portal.track('alice_opened', { bookId: 'alice-journey', expeditionId: 'alice-journey' });
    }

    if (step === 'meet') {
      if (portal.mountJourneyChrome) {
        portal.mountJourneyChrome({ currentStepId: 'heroes' });
      }

      if (portal.track) {
        portal.track('characters_opened', { expeditionId: 'alice-journey' });
      }

      var meetPanel = document.createElement('div');
      meetPanel.className = 'journey-tip card';
      meetPanel.innerHTML =
        '<h3 class="journey-tip__title">Познакомься с героями</h3>' +
        '<p class="journey-tip__text">Рассмотри портреты и прочитай, кто есть кто. Когда будешь готов(а) — идём дальше.</p>';

      var meetBtn = document.createElement('button');
      meetBtn.type = 'button';
      meetBtn.className = 'btn btn--cta';
      meetBtn.textContent = 'Я познакомился(ась) с героями →';
      meetBtn.addEventListener('click', function () {
        if (portal.track) {
          portal.track('characters_completed', { expeditionId: 'alice-journey' });
        }
        var nextHost = document.querySelector('[data-journey-next]');
        if (!nextHost && content) {
          nextHost = document.createElement('div');
          nextHost.setAttribute('data-journey-next', '');
          content.appendChild(nextHost);
        }
        if (portal.completeStepAndShowNext) {
          portal.completeStepAndShowNext('heroes', nextHost);
        }
      });

      meetPanel.appendChild(meetBtn);
      host.appendChild(meetPanel);
      return;
    }

    var startPanel = document.createElement('div');
    startPanel.className = 'journey-tip card';
    startPanel.innerHTML =
      '<h3 class="journey-tip__title">Приключения Алисы</h3>' +
      '<p class="journey-tip__text">Книга выбрана! Сейчас начинается путешествие. Сначала послушай эпизод.</p>';

    var startLink = document.createElement('a');
    startLink.className = 'btn btn--cta';
    startLink.href = 'trial-cards.html';
    startLink.textContent = 'Послушать эпизод →';
    startPanel.appendChild(startLink);
    host.appendChild(startPanel);
  }

  function initHeroesPage() {
    var pickerEl = document.querySelector('[data-hero-books]');
    var listEl = document.querySelector('[data-hero-list]');
    if (!pickerEl || !listEl) return;

    var books = portal.books || [];
    if (!books.length) return;

    selectedBookId = portal.getQueryParam('book') || books[0].id;

    var selectedBook = portal.getBookById ? portal.getBookById(selectedBookId) : null;
    if (!selectedBook || selectedBook.status === 'soon') {
      selectedBookId = books[0].id;
    }

    renderBookPicker(pickerEl, function (bookId) {
      renderHeroesList(listEl, bookId);
      renderHeroesJourneyPanel(bookId, listEl);
    });

    renderHeroesList(listEl, selectedBookId);
    renderHeroesJourneyPanel(selectedBookId, listEl);
  }

  function initPageBanner() {
    var bannerEl = document.querySelector('[data-page-banner]');
    if (!bannerEl) return;

    var pageKey = bannerEl.dataset.pageBanner;
    var meta = portal.banners && portal.banners[pageKey];
    if (!meta) return;

    bannerEl.innerHTML = '';

    var figure = document.createElement('figure');
    figure.className = 'page-banner';

    var img = document.createElement('img');
    img.className = 'page-banner__img';
    img.src = meta.image;
    img.alt = meta.alt;
    img.loading = 'lazy';
    figure.appendChild(img);
    bannerEl.appendChild(figure);

    var header = document.createElement('header');
    header.className = 'page-header';

    var title = document.createElement('h2');
    title.className = 'page-title';
    title.textContent = meta.title;

    var intro = document.createElement('p');
    intro.className = 'page-intro';
    intro.textContent = meta.intro;

    header.appendChild(title);
    header.appendChild(intro);
    bannerEl.appendChild(header);
  }

  portal.onReady(function () {
    initMenu();
    initPageBanner();
    initHeroesPage();
  });
})();
