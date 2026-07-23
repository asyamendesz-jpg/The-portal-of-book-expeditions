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
      sidebar.classList.add('is-nav-open');
      overlay.removeAttribute('hidden');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Закрыть меню');
      document.body.classList.add('is-nav-open');
    }

    toggle.addEventListener('click', function () {
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

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'book-picker__btn card';
      if (book.id === selectedBookId) btn.classList.add('is-active');
      btn.dataset.bookId = book.id;

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

      btn.addEventListener('click', function () {
        selectedBookId = book.id;
        onSelect(book.id);
        container.querySelectorAll('.book-picker__btn').forEach(function (el) {
          el.classList.toggle('is-active', el.dataset.bookId === book.id);
        });
      });

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

  function initHeroesPage() {
    var pickerEl = document.querySelector('[data-hero-books]');
    var listEl = document.querySelector('[data-hero-list]');
    if (!pickerEl || !listEl) return;

    var books = portal.books || [];
    if (!books.length) return;

    selectedBookId = portal.getQueryParam('book') || books[0].id;

    renderBookPicker(pickerEl, function (bookId) {
      renderHeroesList(listEl, bookId);
    });

    renderHeroesList(listEl, selectedBookId);
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
