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

  function heroKey(hero) {
    return hero.heroId || hero.id;
  }

  function hasTraits(hero) {
    return !!(hero.traits && String(hero.traits).trim());
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

    var more = document.createElement('a');
    more.className = 'btn btn--secondary note-card__more';
    more.href = 'heroes.html?book=' + encodeURIComponent(card.bookId || 'alice-journey') +
      '#' + encodeURIComponent(card.heroId || card.id);
    more.textContent = 'Подробнее';
    article.appendChild(more);

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

      if (portal.track) {
        portal.track('character_quiz_completed', { expeditionId: 'alice-journey' });
      }

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
      var wrong = shuffle(heroes.filter(function (h) {
        return heroKey(h) !== heroKey(hero);
      })).slice(0, 2);
      var choices = shuffle([hero].concat(wrong));

      progress.textContent = 'Герой ' + (index + 1) + ' из ' + queue.length;
      feedback.textContent = '';
      feedback.className = 'guess-game__feedback';
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
          var ok = heroKey(choice) === heroKey(hero) || choice.name === hero.name;
          Array.prototype.forEach.call(options.querySelectorAll('button'), function (el) {
            el.disabled = true;
          });

          if (ok) {
            correctCount += 1;
            feedback.textContent = 'Верно! Это ' + hero.name + '.';
            feedback.className = 'guess-game__feedback is-ok';
          } else {
            feedback.textContent = 'Попробуй ещё раз — кажется, это другой герой.';
            feedback.className = 'guess-game__feedback is-miss';
            Array.prototype.forEach.call(options.querySelectorAll('button'), function (el) {
              el.disabled = false;
            });
            return;
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

  function createAssemblyCard(hero, revealed) {
    var card = document.createElement('article');
    card.className = 'assemble-card card';
    card.setAttribute('aria-label', 'Карточка: ' + hero.name);

    var portrait = document.createElement('div');
    portrait.className = 'assemble-card__portrait' + (revealed.portrait ? ' is-filled' : '');
    if (revealed.portrait && hero.image) {
      var img = document.createElement('img');
      img.src = hero.image;
      img.alt = hero.name;
      img.className = 'assemble-card__photo';
      portrait.appendChild(img);
    } else {
      var ph = document.createElement('span');
      ph.className = 'assemble-card__placeholder';
      ph.textContent = 'Портрет';
      portrait.appendChild(ph);
    }
    card.appendChild(portrait);

    var nameEl = document.createElement('h3');
    nameEl.className = 'assemble-card__name' + (revealed.name ? ' is-filled' : '');
    nameEl.textContent = revealed.name ? hero.name : '???';
    card.appendChild(nameEl);

    if (hasTraits(hero) || revealed.traits) {
      var traitsEl = document.createElement('p');
      traitsEl.className = 'assemble-card__traits' + (revealed.traits ? ' is-filled' : '');
      traitsEl.textContent = revealed.traits ? hero.traits : '✦ Качества героя';
      card.appendChild(traitsEl);
    }

    var factEl = document.createElement('p');
    factEl.className = 'assemble-card__fact' + (revealed.fact ? ' is-filled' : '');
    factEl.textContent = revealed.fact ? ('✦ ' + hero.fact) : '✦ Интересный факт';
    card.appendChild(factEl);

    return card;
  }

  function pickWrongOptions(heroes, hero, mapFn, count) {
    return shuffle(
      heroes
        .filter(function (h) { return heroKey(h) !== heroKey(hero); })
        .map(mapFn)
        .filter(Boolean)
    ).slice(0, count);
  }

  function renderBuildMode(container, nextHost) {
    var heroes = getHeroPool().slice();
    var queue = heroes;
    var heroIndex = 0;
    var collected = [];

    container.innerHTML = '';

    var wrap = document.createElement('section');
    wrap.className = 'build-card-game';
    wrap.setAttribute('aria-live', 'polite');
    container.appendChild(wrap);

    function showIntro() {
      wrap.innerHTML = '';

      var title = document.createElement('h3');
      title.className = 'build-card-game__title';
      title.textContent = 'Собери карточку персонажа';

      var sub = document.createElement('p');
      sub.className = 'build-card-game__intro';
      sub.textContent =
        'Соедини имя, портрет, качества и интересный факт. Проверь, насколько хорошо ты запомнил героев экспедиции.';

      var start = document.createElement('button');
      start.type = 'button';
      start.className = 'btn btn--cta';
      start.textContent = 'Начать испытание';
      start.addEventListener('click', function () {
        heroIndex = 0;
        collected = [];
        startHeroRound();
      });

      wrap.appendChild(title);
      wrap.appendChild(sub);
      wrap.appendChild(start);
    }

    function startHeroRound() {
      if (heroIndex >= queue.length) {
        showFinale();
        return;
      }

      var hero = queue[heroIndex];
      var revealed = { name: true, portrait: false, traits: false, fact: false };
      var steps = [
        {
          id: 'portrait',
          prompt: 'Какой портрет принадлежит этому герою?',
          buildChoices: function () {
            var wrong = pickWrongOptions(heroes, hero, function (h) {
              return { value: h.image, label: h.name, image: h.image, key: heroKey(h) };
            }, 2);
            var correct = { value: hero.image, label: hero.name, image: hero.image, key: heroKey(hero) };
            return shuffle([correct].concat(wrong));
          },
          check: function (choice) {
            return choice.key === heroKey(hero);
          },
          apply: function () {
            revealed.portrait = true;
          },
          kind: 'portrait'
        }
      ];

      if (hasTraits(hero)) {
        steps.push({
          id: 'traits',
          prompt: 'Какие качества принадлежат этому герою?',
          buildChoices: function () {
            var wrong = pickWrongOptions(heroes, hero, function (h) {
              if (!hasTraits(h)) return null;
              return { value: h.traits, label: h.traits, key: heroKey(h) };
            }, 2);
            return shuffle([{ value: hero.traits, label: hero.traits, key: heroKey(hero) }].concat(wrong));
          },
          check: function (choice) {
            return choice.key === heroKey(hero);
          },
          apply: function () {
            revealed.traits = true;
          },
          kind: 'text'
        });
      }

      steps.push({
        id: 'fact',
        prompt: 'Какой факт относится к этому герою?',
        buildChoices: function () {
          var wrong = pickWrongOptions(heroes, hero, function (h) {
            return h.fact ? { value: h.fact, label: h.fact, key: heroKey(h) } : null;
          }, 2);
          return shuffle([{ value: hero.fact, label: hero.fact, key: heroKey(hero) }].concat(wrong));
        },
        check: function (choice) {
          return choice.key === heroKey(hero);
        },
        apply: function () {
          revealed.fact = true;
        },
        kind: 'text'
      });

      var stepIndex = 0;

      function renderRound() {
        wrap.innerHTML = '';

        var progress = document.createElement('p');
        progress.className = 'build-card-game__progress';
        progress.textContent = 'Герой ' + (heroIndex + 1) + ' из ' + queue.length;
        wrap.appendChild(progress);

        var dots = document.createElement('div');
        dots.className = 'build-card-game__dots';
        dots.setAttribute('aria-hidden', 'true');
        queue.forEach(function (_, i) {
          var dot = document.createElement('span');
          dot.className = 'build-card-game__dot' +
            (i < heroIndex ? ' is-done' : '') +
            (i === heroIndex ? ' is-now' : '');
          dots.appendChild(dot);
        });
        wrap.appendChild(dots);

        var board = document.createElement('div');
        board.className = 'build-card-game__board';
        board.appendChild(createAssemblyCard(hero, revealed));
        wrap.appendChild(board);

        if (stepIndex >= steps.length) {
          var doneTitle = document.createElement('p');
          doneTitle.className = 'build-card-game__done-title';
          doneTitle.textContent = 'Карточка собрана!';
          wrap.appendChild(doneTitle);

          var nextBtn = document.createElement('button');
          nextBtn.type = 'button';
          nextBtn.className = 'btn btn--cta';
          nextBtn.textContent = heroIndex < queue.length - 1 ? 'Следующий герой →' : 'Посмотреть результат →';
          nextBtn.addEventListener('click', function () {
            collected.push(hero);
            heroIndex += 1;
            startHeroRound();
          });
          wrap.appendChild(nextBtn);
          return;
        }

        var step = steps[stepIndex];
        var question = document.createElement('p');
        question.className = 'build-card-game__question';
        question.textContent = step.prompt;
        wrap.appendChild(question);

        var feedback = document.createElement('p');
        feedback.className = 'build-card-game__feedback';
        wrap.appendChild(feedback);

        var options = document.createElement('div');
        options.className = 'build-card-game__options' +
          (step.kind === 'portrait' ? ' build-card-game__options--portraits' : '');

        step.buildChoices().forEach(function (choice) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'btn btn--secondary build-card-game__choice' +
            (step.kind === 'portrait' ? ' build-card-game__choice--portrait' : '');

          if (step.kind === 'portrait' && choice.image) {
            var thumb = document.createElement('img');
            thumb.src = choice.image;
            thumb.alt = 'Вариант портрета';
            thumb.className = 'build-card-game__choice-img';
            btn.appendChild(thumb);
          } else {
            btn.textContent = choice.label;
          }

          btn.addEventListener('click', function () {
            if (step.check(choice)) {
              feedback.textContent = 'Верно!';
              feedback.className = 'build-card-game__feedback is-ok';
              step.apply();
              Array.prototype.forEach.call(options.querySelectorAll('button'), function (el) {
                el.disabled = true;
              });
              window.setTimeout(function () {
                stepIndex += 1;
                renderRound();
              }, 700);
            } else {
              feedback.textContent = 'Кажется, это относится к другому герою. Попробуй ещё раз.';
              feedback.className = 'build-card-game__feedback is-miss';
            }
          });

          options.appendChild(btn);
        });

        wrap.appendChild(options);
      }

      renderRound();
    }

    function showFinale() {
      wrap.innerHTML = '';

      var title = document.createElement('h3');
      title.className = 'build-card-game__title';
      title.textContent = 'Все карточки собраны!';

      var text = document.createElement('p');
      text.className = 'build-card-game__intro';
      text.textContent = 'Ты познакомился с героями экспедиции и собрал их портреты.';

      var gallery = document.createElement('ul');
      gallery.className = 'build-card-game__gallery';

      collected.forEach(function (hero) {
        var item = document.createElement('li');
        item.className = 'build-card-game__gallery-item';
        item.appendChild(createAssemblyCard(hero, {
          name: true,
          portrait: true,
          traits: hasTraits(hero),
          fact: true
        }));
        gallery.appendChild(item);
      });

      wrap.appendChild(title);
      wrap.appendChild(text);
      wrap.appendChild(gallery);

      if (portal.track) {
        portal.track('character_card_completed', { expeditionId: 'alice-journey' });
      }

      if (portal.completeStepAndShowNext) {
        portal.completeStepAndShowNext('card', nextHost);
      } else {
        if (portal.markJourneyFlag) {
          portal.markJourneyFlag('characterCardCompleted');
        }
        var cta = document.createElement('a');
        cta.className = 'btn btn--cta';
        cta.href = 'field-task.html';
        cta.textContent = 'К полевому заданию →';
        wrap.appendChild(cta);
      }

      var replay = document.createElement('button');
      replay.type = 'button';
      replay.className = 'btn btn--secondary build-card-game__replay';
      replay.textContent = 'Пройти испытание ещё раз';
      replay.addEventListener('click', showIntro);
      wrap.appendChild(replay);
    }

    showIntro();
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
      if (bannerIntro) {
        bannerIntro.textContent = 'Узнай героя по описанию — без подсказок на портрете!';
      }
      var bannerTitle = document.querySelector('.page-title');
      if (bannerTitle) bannerTitle.textContent = 'Узнай героя по описанию';
      if (portal.track) {
        portal.track('character_quiz_started', { expeditionId: 'alice-journey' });
      }
      renderGuessMode(container, chrome.next);
      return;
    }

    if (mode === 'build') {
      var buildIntro = document.querySelector('.page-intro');
      if (buildIntro) {
        buildIntro.textContent =
          'Соедини имя, портрет, качества и интересный факт. Проверь, насколько хорошо ты запомнил героев.';
      }
      var buildTitle = document.querySelector('.page-title');
      if (buildTitle) buildTitle.textContent = 'Собери карточку персонажа';
      if (portal.track) {
        portal.track('character_card_started', { expeditionId: 'alice-journey' });
      }
      renderBuildMode(container, chrome.next);
      return;
    }

    renderCards(container);
  });
})();
