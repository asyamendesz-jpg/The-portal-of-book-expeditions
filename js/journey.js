(function (global) {
  'use strict';

  var portal = global.ReadingPortal = global.ReadingPortal || {};
  var STORAGE_KEY = 'readingPortal.aliceJourney';

  var DEFAULT_PROGRESS = {
    bookSelected: false,
    episodeCompleted: false,
    charactersViewed: false,
    tasksCompleted: false,
    characterQuizCompleted: false,
    characterCardCompleted: false,
    expeditionCompleted: false
  };

  function safeParse(raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  portal.getJourneyProgress = function () {
    var stored = safeParse(global.localStorage.getItem(STORAGE_KEY));
    var progress = {};
    var key;

    for (key in DEFAULT_PROGRESS) {
      if (Object.prototype.hasOwnProperty.call(DEFAULT_PROGRESS, key)) {
        progress[key] = stored && stored[key] === true;
      }
    }

    return progress;
  };

  portal.saveJourneyProgress = function (progress) {
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      /* private mode / quota — маршрут всё равно работает без сохранения */
    }
  };

  portal.markJourneyFlag = function (flag) {
    var progress = portal.getJourneyProgress();
    if (!flag || progress[flag] === true) return progress;
    progress[flag] = true;
    portal.saveJourneyProgress(progress);
    return progress;
  };

  portal.getJourneySteps = function () {
    return portal.journeySteps || [];
  };

  portal.getJourneyStep = function (id) {
    var steps = portal.getJourneySteps();
    for (var i = 0; i < steps.length; i++) {
      if (steps[i].id === id) return steps[i];
    }
    return null;
  };

  portal.getFirstIncompleteStep = function () {
    var progress = portal.getJourneyProgress();
    var steps = portal.getJourneySteps();
    var i;
    var step;

    if (!progress.bookSelected) {
      return { id: 'entry', href: 'book-travel.html', title: 'Книжные путешествия' };
    }

    for (i = 0; i < steps.length; i++) {
      step = steps[i];
      if (!progress[step.flag]) return step;
    }

    return steps[steps.length - 1] || null;
  };

  portal.hasJourneyProgress = function () {
    var progress = portal.getJourneyProgress();
    return !!(
      progress.bookSelected ||
      progress.episodeCompleted ||
      progress.charactersViewed ||
      progress.tasksCompleted ||
      progress.characterQuizCompleted ||
      progress.characterCardCompleted ||
      progress.expeditionCompleted
    );
  };

  portal.getResumeHref = function () {
    var step = portal.getFirstIncompleteStep();
    return step ? step.href : 'book-travel.html';
  };

  portal.renderJourneyTrail = function (container, currentStepId) {
    if (!container) return;

    var progress = portal.getJourneyProgress();
    var steps = portal.getJourneySteps();
    var foundCurrent = false;

    container.innerHTML = '';
    container.className = 'journey-trail';
    container.setAttribute('aria-label', 'Маршрут экспедиции');

    var heading = document.createElement('p');
    heading.className = 'journey-trail__title';
    heading.textContent = 'Маршрут экспедиции';
    container.appendChild(heading);

    var list = document.createElement('ol');
    list.className = 'journey-trail__list';

    steps.forEach(function (step, index) {
      var done = !!progress[step.flag];
      var isCurrent = step.id === currentStepId;
      if (isCurrent) foundCurrent = true;

      var status = 'ahead';
      if (done && !isCurrent) status = 'done';
      else if (isCurrent) status = 'now';
      else if (!foundCurrent && !done) status = 'ahead';

      var item = document.createElement('li');
      item.className = 'journey-trail__item journey-trail__item--' + status;

      var marker = document.createElement('span');
      marker.className = 'journey-trail__marker';
      marker.setAttribute('aria-hidden', 'true');
      marker.textContent = done && !isCurrent ? '✓' : '●';

      var label = document.createElement('span');
      label.className = 'journey-trail__label';
      label.textContent = step.short;

      if (isCurrent) {
        item.setAttribute('aria-current', 'step');
      }

      item.appendChild(marker);
      item.appendChild(label);
      list.appendChild(item);

      if (index < steps.length - 1) {
        var connector = document.createElement('li');
        connector.className = 'journey-trail__connector';
        connector.setAttribute('aria-hidden', 'true');
        list.appendChild(connector);
      }
    });

    container.appendChild(list);
  };

  portal.renderNextPanel = function (container, options) {
    if (!container) return null;
    options = options || {};

    var copy = (portal.journeyNextCopy && portal.journeyNextCopy[options.stepId]) || {};
    var nextStep = options.nextId ? portal.getJourneyStep(options.nextId) : null;
    var href = options.href || (nextStep && nextStep.href) || options.fallbackHref || 'index.html';
    var title = options.title || copy.title || 'Отлично!';
    var text = options.text || copy.text || 'Можно идти дальше.';
    var cta = options.cta || copy.cta || 'Дальше →';
    var completeFlag = options.completeFlag;

    container.innerHTML = '';
    container.className = 'journey-next card';
    container.hidden = false;

    var titleEl = document.createElement('h3');
    titleEl.className = 'journey-next__title';
    titleEl.textContent = title;

    var textEl = document.createElement('p');
    textEl.className = 'journey-next__text';
    textEl.textContent = text;

    var link = document.createElement('a');
    link.className = 'btn btn--cta journey-next__cta';
    link.href = href;
    link.textContent = cta;

    if (completeFlag) {
      link.addEventListener('click', function () {
        portal.markJourneyFlag(completeFlag);
        if (completeFlag !== 'expeditionCompleted' && options.nextId === 'achievements') {
          portal.markJourneyFlag('expeditionCompleted');
        }
      });
    }

    container.appendChild(titleEl);
    container.appendChild(textEl);
    container.appendChild(link);

    return container;
  };

  portal.completeStepAndShowNext = function (stepId, mountEl) {
    var step = portal.getJourneyStep(stepId);
    var copy = (portal.journeyNextCopy && portal.journeyNextCopy[stepId]) || {};

    if (step && step.flag) {
      portal.markJourneyFlag(step.flag);
    }

    if (stepId === 'card') {
      portal.markJourneyFlag('expeditionCompleted');
    }

    if (!mountEl) return;

    portal.renderNextPanel(mountEl, {
      stepId: stepId,
      nextId: copy.nextId,
      completeFlag: copy.nextId === 'achievements' ? 'expeditionCompleted' : null
    });

    mountEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  portal.mountJourneyChrome = function (options) {
    options = options || {};
    var root = options.root || document.querySelector('[data-journey-root]') || document.querySelector('main.content');
    if (!root) return { trail: null, next: null };

    var trailHost = options.trailHost || root.querySelector('[data-journey-trail]');
    var nextHost = options.nextHost || root.querySelector('[data-journey-next]');

    if (!trailHost && options.currentStepId) {
      trailHost = document.createElement('div');
      trailHost.setAttribute('data-journey-trail', '');
      var insertBefore = root.querySelector('.content-area, .trial-detail, [data-cards-list], [data-hero-list]');
      if (insertBefore && insertBefore.parentNode) {
        insertBefore.parentNode.insertBefore(trailHost, insertBefore);
      } else {
        root.insertBefore(trailHost, root.firstChild);
      }
    }

    if (!nextHost) {
      nextHost = document.createElement('div');
      nextHost.setAttribute('data-journey-next', '');
      nextHost.hidden = true;
      root.appendChild(nextHost);
    }

    if (trailHost && options.currentStepId) {
      portal.renderJourneyTrail(trailHost, options.currentStepId);
    }

    return { trail: trailHost, next: nextHost };
  };

  portal.initHomeJourneyCta = function () {
    var cta = document.querySelector('.expedition-card .btn--cta, [data-journey-home-cta]');
    if (!cta) return;

    if (portal.hasJourneyProgress() && !portal.getJourneyProgress().expeditionCompleted) {
      cta.textContent = '🚀 ПРОДОЛЖИТЬ ЭКСПЕДИЦИЮ';
      cta.href = portal.getResumeHref();
    } else if (portal.getJourneyProgress().expeditionCompleted) {
      cta.textContent = '🚀 СНОВА В ЭКСПЕДИЦИЮ';
      cta.href = 'book-travel.html';
    } else {
      cta.textContent = '🚀 НАЧАТЬ ЭКСПЕДИЦИЮ';
      cta.href = 'book-travel.html';
    }
  };

  portal.initBookTravelJourney = function () {
    var area = document.querySelector('.content-area');
    if (!area || !document.body.classList.contains('page--travel')) return;

    var tip = document.createElement('div');
    tip.className = 'journey-tip card';
    tip.innerHTML =
      '<h3 class="journey-tip__title">Сейчас начинается твоё книжное путешествие</h3>' +
      '<p class="journey-tip__text">Выбери открытую экспедицию и нажми «Отправиться в экспедицию».</p>';

    area.insertBefore(tip, area.firstChild);
  };
})(window);
