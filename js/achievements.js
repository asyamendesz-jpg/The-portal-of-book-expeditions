(function () {
  'use strict';

  var portal = window.ReadingPortal;

  function renderAchievements(container) {
    var progress = portal.getJourneyProgress();
    var steps = portal.getJourneySteps();
    var routeSteps = steps.filter(function (step) {
      return step.id !== 'achievements';
    });
    var allDone = routeSteps.every(function (step) {
      return !!progress[step.flag];
    });

    if (allDone) {
      portal.markJourneyFlag('expeditionCompleted');
      progress = portal.getJourneyProgress();
    }

    if (portal.mountJourneyChrome) {
      portal.mountJourneyChrome({ currentStepId: 'achievements' });
    }

    container.innerHTML = '';

    var title = document.createElement('h2');
    title.className = 'achievements__title';
    title.id = 'achievements-title';
    title.textContent = allDone
      ? 'Экспедиция по «Приключениям Алисы» завершена!'
      : 'Твои достижения по маршруту';

    var lead = document.createElement('p');
    lead.className = 'achievements__lead';
    lead.textContent = allDone
      ? 'Ты прошёл(шла) весь путь исследователя. Вот что уже сделано:'
      : 'Продолжай маршрут — здесь появятся все звёзды экспедиции.';

    var list = document.createElement('ul');
    list.className = 'achievements__list';

    routeSteps.forEach(function (step) {
      var item = document.createElement('li');
      var done = !!progress[step.flag];
      item.className = 'achievements__item' + (done ? ' is-done' : '');
      item.textContent = (done ? '✓ ' : '○ ') + step.doneLabel;
      list.appendChild(item);
    });

    var finale = document.createElement('li');
    finale.className = 'achievements__item' + (allDone ? ' is-done' : '');
    finale.textContent = (allDone ? '✓ ' : '○ ') + 'Получил достижение';
    list.appendChild(finale);

    container.appendChild(title);
    container.appendChild(lead);
    container.appendChild(list);

    var actions = document.createElement('div');
    actions.className = 'achievements__actions';

    if (!allDone) {
      var resume = document.createElement('a');
      resume.className = 'btn btn--cta';
      resume.href = portal.getResumeHref();
      resume.textContent = 'Продолжить экспедицию →';
      actions.appendChild(resume);
    } else {
      var home = document.createElement('a');
      home.className = 'btn btn--cta';
      home.href = 'index.html';
      home.textContent = 'На главную';
      actions.appendChild(home);

      var again = document.createElement('a');
      again.className = 'btn btn--secondary';
      again.href = 'trial-cards.html';
      again.textContent = 'Послушать эпизод ещё раз';
      actions.appendChild(again);
    }

    container.appendChild(actions);
  }

  portal.onReady(function () {
    var container = document.querySelector('[data-achievements]');
    if (container) renderAchievements(container);
  });
})();
