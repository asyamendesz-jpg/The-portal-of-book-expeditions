(function () {
  'use strict';

  var portal = window.ReadingPortal;

  function shuffle(list) {
    var arr = list.slice();
    var i;
    var j;
    var tmp;
    for (i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function createCard(card) {
    var article = document.createElement('article');
    article.className = 'note-card card';

    if (card.image) {
      var photo = document.createElement('img');
      photo.className = 'note-card__photo';
      photo.src = card.image;
      photo.alt = card.name;
      photo.loading = 'lazy';
      article.appendChild(photo);
    }

    var title = document.createElement('h3');
    title.className = 'note-card__title';
    title.textContent = card.name;

    var role = document.createElement('p');
    role.className = 'note-card__role';
    role.textContent = card.role;

    var text = document.createElement('p');
    text.className = 'note-card__text';
    text.textContent = card.description;

    article.appendChild(title);
    article.appendChild(role);
    article.appendChild(text);

    return article;
  }

  function renderCards(container) {
    var cards = portal.cards;
    container.innerHTML = '';

    if (!cards || !cards.length) {
      container.appendChild(portal.createEmpty('cards-empty', 'Экспедиционные записи скоро появятся.'));
      return;
    }

    var list = document.createElement('ul');
    list.className = 'cards-list';

    cards.forEach(function (card) {
      var item = document.createElement('li');
      item.className = 'cards-list__item';
      item.appendChild(createCard(card));
      list.appendChild(item);
    });

    container.appendChild(list);
  }

  function getHeroPool() {
    return (portal.cards && portal.cards.length ? portal.cards : portal.heroes) || [];
  }

  function renderGuessMode(container, nextHost) {
    var heroes = getHeroPool();
    var queue = shuffle(heroes).slice(0, Math.min(4, heroes.length));
    var index = 0;
    var correctCount = 0;

    container.innerHTML = '';

    var wrap = document.createElement('section');
    wrap.className = 'guess-game';

    var intro = document.createElement('p');
    intro.className = 'guess-game__intro';
    intro.textContent = 'Прочитай описание и угадай, кто это.';
    wrap.appendChild(intro);

    var progress = document.createElement('p');
    progress.className = 'guess-game__progress';
    wrap.appendChild(progress);

    var prompt = document.createElement('div');
    prompt.className = 'guess-game__prompt card';
    wrap.appendChild(prompt);

    var options = document.createElement('div');
    options.className = 'guess-game__options';
    wrap.appendChild(options);

    var feedback = document.createElement('p');
    feedback.className = 'guess-game__feedback';
    wrap.appendChild(feedback);

    container.appendChild(wrap);

    function finish() {
      wrap.innerHTML = '';
      var done = document.createElement('p');
      done.className = 'guess-game__done';
      done.textContent = 'Ты узнал(а) ' + correctCount + ' из ' + queue.length + '!';
      wrap.appendChild(done);

      if (portal.completeStepAndShowNext) {
        portal.completeStepAndShowNext('guess', nextHost);
      }
    }

    function showRound() {
      if (index >= queue.length) {
        finish();
        return;
      }

      var hero = queue[index];
      var wrong = shuffle(heroes.filter(function (h) { return h.id !== hero.id && h.heroId !== hero.heroId; })).slice(0, 2);
      var choices = shuffle([hero].concat(wrong));

      progress.textContent = 'Герой ' + (index + 1) + ' из ' + queue.length;
      feedback.textContent = '';
      prompt.innerHTML = '';

      var role = document.createElement('p');
      role.className = 'guess-game__role';
      role.textContent = hero.role || 'Герой экспедиции';

      var desc = document.createElement('p');
      desc.className = 'guess-game__desc';
      desc.textContent = hero.description;

      prompt.appendChild(role);
      prompt.appendChild(desc);

      options.innerHTML = '';
      choices.forEach(function (choice) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn--secondary guess-game__choice';
        btn.textContent = choice.name;
        btn.addEventListener('click', function () {
          var ok = choice.id === hero.id || choice.heroId === hero.heroId || choice.name === hero.name;
          Array.prototype.forEach.call(options.querySelectorAll('button'), function (el) {
            el.disabled = true;
          });

          if (ok) {
            correctCount += 1;
            feedback.textContent = 'Верно! Это ' + hero.name + '.';
            feedback.className = 'guess-game__feedback is-ok';
          } else {
            feedback.textContent = 'Это ' + hero.name + '. Запомни на следующий раз!';
            feedback.className = 'guess-game__feedback is-miss';
          }

          window.setTimeout(function () {
            index += 1;
            showRound();
          }, 900);
        });
        options.appendChild(btn);
      });
    }

    showRound();
  }

  function renderBuildMode(container, nextHost) {
    var heroes = getHeroPool();
    container.innerHTML = '';

    var wrap = document.createElement('section');
    wrap.className = 'build-card-game';

    var intro = document.createElement('p');
    intro.className = 'build-card-game__intro';
    intro.textContent = 'Выбери героя — и мы соберём его карточку.';
    wrap.appendChild(intro);

    var picker = document.createElement('div');
    picker.className = 'build-card-game__picker';
    wrap.appendChild(picker);

    var preview = document.createElement('div');
    preview.className = 'build-card-game__preview';
    wrap.appendChild(preview);

    var actions = document.createElement('div');
    actions.className = 'build-card-game__actions';
    wrap.appendChild(actions);

    container.appendChild(wrap);

    var selected = null;

    function showPreview(hero) {
      selected = hero;
      preview.innerHTML = '';
      preview.appendChild(createCard(hero));
      actions.innerHTML = '';

      var ready = document.createElement('button');
      ready.type = 'button';
      ready.className = 'btn btn--cta';
      ready.textContent = 'Карточка готова!';
      ready.addEventListener('click', function () {
        if (portal.completeStepAndShowNext) {
          portal.completeStepAndShowNext('card', nextHost);
        }
      });
      actions.appendChild(ready);
    }

    heroes.forEach(function (hero) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'build-card-game__hero btn btn--secondary';
      if (hero.image) {
        var img = document.createElement('img');
        img.src = hero.image;
        img.alt = '';
        img.className = 'build-card-game__thumb';
        btn.appendChild(img);
      }
      var span = document.createElement('span');
      span.textContent = hero.name;
      btn.appendChild(span);
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(picker.querySelectorAll('.build-card-game__hero'), function (el) {
          el.classList.remove('is-active');
        });
        btn.classList.add('is-active');
        showPreview(hero);
      });
      picker.appendChild(btn);
    });
  }

  portal.onReady(function () {
    var container = document.querySelector('[data-cards-list]');
    if (!container) return;

    var mode = portal.getQueryParam('mode');
    var chrome = portal.mountJourneyChrome
      ? portal.mountJourneyChrome({
          currentStepId: mode === 'guess' ? 'guess' : mode === 'build' ? 'card' : null
        })
      : { next: null };

    if (mode === 'guess') {
      var bannerIntro = document.querySelector('.page-intro');
      if (bannerIntro) bannerIntro.textContent = 'Узнай героя по описанию — без подсказок на портрете!';
      var bannerTitle = document.querySelector('.page-title');
      if (bannerTitle) bannerTitle.textContent = 'Узнай героя по описанию';
      renderGuessMode(container, chrome.next);
      return;
    }

    if (mode === 'build') {
      var buildIntro = document.querySelector('.page-intro');
      if (buildIntro) buildIntro.textContent = 'Собери карточку персонажа для своей коллекции.';
      var buildTitle = document.querySelector('.page-title');
      if (buildTitle) buildTitle.textContent = 'Собери карточку персонажа';
      renderBuildMode(container, chrome.next);
      return;
    }

    renderCards(container);
  });
})();
