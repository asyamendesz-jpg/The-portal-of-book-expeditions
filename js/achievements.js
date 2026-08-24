(function () {
  'use strict';

  var portal = window.ReadingPortal;

  var ANSWERS = [
    {
      value: 'yes',
      label: 'Да, мне это пригодилось бы',
      event: 'photo_diary_interest_yes',
      thanks: 'Мы пока изучаем, нужна ли такая возможность семьям. Ваш ответ поможет понять, стоит ли её добавлять.'
    },
    {
      value: 'no',
      label: 'Нет, достаточно отметки «Выполнено»',
      event: 'photo_diary_interest_no',
      thanks: 'Ваш ответ тоже помогает нам понять, каким должен быть Дневник экспедиции.'
    },
    {
      value: 'unsure',
      label: 'Пока не уверен(а)',
      event: 'photo_diary_interest_unsure',
      thanks: 'Мы учтём это при развитии проекта.'
    }
  ];

  function renderSurveyThanks(host, message) {
    host.innerHTML = '';
    host.className = 'adult-survey card';

    var title = document.createElement('h3');
    title.className = 'adult-survey__title';
    title.textContent = 'Спасибо!';

    var text = document.createElement('p');
    text.className = 'adult-survey__text';
    text.textContent = message;

    var back = document.createElement('button');
    back.type = 'button';
    back.className = 'btn btn--secondary';
    back.textContent = 'Вернуться к достижениям';
    back.addEventListener('click', function () {
      host.hidden = true;
      var main = document.querySelector('[data-achievements]');
      if (main) main.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    host.appendChild(title);
    host.appendChild(text);
    host.appendChild(back);
    host.hidden = false;
  }

  function renderAdultSurvey(host) {
    if (!host) return;
    if (portal.hasSurveyAnswer && portal.hasSurveyAnswer()) {
      host.hidden = true;
      return;
    }

    host.innerHTML = '';
    host.className = 'adult-survey card';
    host.hidden = false;

    var badge = document.createElement('p');
    badge.className = 'adult-survey__badge';
    badge.textContent = 'Для взрослых';

    var title = document.createElement('h3');
    title.className = 'adult-survey__title';
    title.textContent = 'Помогите нам сделать следующие экспедиции удобнее';

    var lead = document.createElement('p');
    lead.className = 'adult-survey__text';
    lead.textContent =
      'Во время путешествия ребёнок выполнял задания не только на экране — рисовал, писал или создавал что-то своими руками.';

    var question = document.createElement('p');
    question.className = 'adult-survey__question';
    question.textContent = 'Хотели бы вы сохранять фотографии таких работ в Дневнике экспедиции?';

    var choices = document.createElement('div');
    choices.className = 'adult-survey__choices';

    ANSWERS.forEach(function (answer) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn--secondary adult-survey__choice';
      btn.textContent = answer.label;
      btn.addEventListener('click', function () {
        if (portal.saveSurveyAnswer) {
          portal.saveSurveyAnswer(answer.value);
        }
        if (portal.track) {
          portal.track(answer.event, {
            expeditionId: 'alice-journey',
            surveyId: 'photo-diary-v1'
          });
        }
        renderSurveyThanks(host, answer.thanks);
      });
      choices.appendChild(btn);
    });

    var skip = document.createElement('button');
    skip.type = 'button';
    skip.className = 'adult-survey__skip';
    skip.textContent = 'Не сейчас';
    skip.addEventListener('click', function () {
      if (portal.saveSurveyAnswer) {
        portal.saveSurveyAnswer('skipped');
      }
      host.hidden = true;
    });

    host.appendChild(badge);
    host.appendChild(title);
    host.appendChild(lead);
    host.appendChild(question);
    host.appendChild(choices);
    host.appendChild(skip);

    if (portal.track) {
      portal.track('photo_diary_question_viewed', {
        expeditionId: 'alice-journey',
        surveyId: 'photo-diary-v1'
      });
    }
  }

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
      var wasComplete = !!progress.expeditionCompleted;
      portal.markJourneyFlag('expeditionCompleted');
      progress = portal.getJourneyProgress();
      if (!wasComplete && portal.track) {
        portal.track('expedition_completed', { expeditionId: 'alice-journey' });
      }
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

      var diary = document.createElement('a');
      diary.className = 'btn btn--secondary';
      diary.href = 'diary.html';
      diary.textContent = 'Открыть Дневник экспедиции';
      actions.appendChild(diary);
    }

    container.appendChild(actions);

    /* Hotfix: опрос перенесён в Дневник — на Достижениях не показывать */
    var surveyHost = document.querySelector('[data-adult-survey]');
    if (surveyHost) surveyHost.hidden = true;
  }

  portal.onReady(function () {
    var container = document.querySelector('[data-achievements]');
    if (container) {
      if (portal.track) {
        portal.track('achievements_opened', { expeditionId: 'alice-journey' });
      }
      renderAchievements(container);
    }
  });
})();
