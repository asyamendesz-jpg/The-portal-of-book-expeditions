(function () {
  'use strict';

  var portal = window.ReadingPortal;

  var ANSWERS = [
    { value: 'yes', label: 'Да', event: 'photo_diary_interest_yes' },
    { value: 'no', label: 'Нет', event: 'photo_diary_interest_no' },
    { value: 'unsure', label: 'Не знаю', event: 'photo_diary_interest_unsure' }
  ];

  function findTask(taskId) {
    var tasks = portal.fieldTasks || [];
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id === taskId) return tasks[i];
    }
    return null;
  }

  function formatDate(iso) {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return '';
    }
  }

  function shouldShowAdultSurvey() {
    var progress = portal.getJourneyProgress ? portal.getJourneyProgress() : {};
    var entries = portal.getDiaryEntries ? portal.getDiaryEntries() : [];
    return !!(progress.fieldTaskCompleted || (entries && entries.length));
  }

  function renderAchievementsCta(host) {
    if (!host) return;
    host.innerHTML = '';
    host.hidden = false;
    host.className = 'diary__footer';

    var cont = document.createElement('a');
    cont.className = 'btn btn--cta';
    cont.href = 'achievements.html';
    cont.textContent = 'Посмотри достижения →';
    host.appendChild(cont);
  }

  function renderAdultSurvey(host, nextHost) {
    if (!host) return;

    if (portal.hasSurveyAnswer && portal.hasSurveyAnswer()) {
      host.hidden = true;
      renderAchievementsCta(nextHost);
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
    title.textContent = 'Для взрослых';

    var lead = document.createElement('p');
    lead.className = 'adult-survey__text';
    lead.textContent =
      'Во время экспедиции ребёнок выполнял задания не только на экране — рисовал, писал или создавал что-то своими руками.';

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
        host.hidden = true;
        renderAchievementsCta(nextHost);
      });
      choices.appendChild(btn);
    });

    host.appendChild(badge);
    host.appendChild(title);
    host.appendChild(lead);
    host.appendChild(question);
    host.appendChild(choices);

    if (portal.track) {
      portal.track('photo_diary_question_viewed', {
        expeditionId: 'alice-journey',
        surveyId: 'photo-diary-v1'
      });
    }
  }

  function renderDiary(container) {
    var entries = portal.getDiaryEntries();
    container.innerHTML = '';

    var title = document.createElement('h2');
    title.className = 'diary__title';
    title.id = 'diary-title';
    title.textContent = 'Дневник экспедиции';

    var lead = document.createElement('p');
    lead.className = 'diary__lead';
    lead.textContent = 'Здесь отмечены твои полевые задания — то, что ты сделал(а) своими руками.';

    container.appendChild(title);
    container.appendChild(lead);

    if (!entries.length) {
      var empty = document.createElement('div');
      empty.className = 'diary__empty card';
      empty.innerHTML =
        '<p>Пока записей нет.</p>' +
        '<p>Когда выполнишь полевое задание, оно появится здесь.</p>';
      var go = document.createElement('a');
      go.className = 'btn btn--cta';
      go.href = 'field-task.html';
      go.textContent = 'К полевому заданию →';
      empty.appendChild(go);
      container.appendChild(empty);
    } else {
      var list = document.createElement('ul');
      list.className = 'diary__list';

      entries
        .slice()
        .sort(function (a, b) {
          return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
        })
        .forEach(function (entry) {
          var task = findTask(entry.taskId);
          var item = document.createElement('li');
          item.className = 'diary__item card';

          var head = document.createElement('div');
          head.className = 'diary__item-head';

          var type = document.createElement('span');
          type.className = 'diary__type';
          type.textContent = (task && task.typeLabel) || entry.type || 'Задание';

          var date = document.createElement('span');
          date.className = 'diary__date';
          date.textContent = formatDate(entry.createdAt || entry.updatedAt);

          head.appendChild(type);
          head.appendChild(date);

          var name = document.createElement('h3');
          name.className = 'diary__item-title';
          name.textContent = (task && task.title) || entry.title || 'Полевое задание';

          var story = document.createElement('p');
          story.className = 'diary__prompt';
          if (task && task.type === 'draw') {
            story.textContent = 'Ты нарисовал(а) свою неизвестную планету.';
          } else {
            story.textContent = (task && task.prompt) || 'Полевое задание экспедиции.';
          }

          var status = document.createElement('p');
          status.className = 'diary__status is-done';
          status.textContent = '✓ Выполнено';

          var actions = document.createElement('div');
          actions.className = 'diary__item-actions';

          var openTask = document.createElement('a');
          openTask.className = 'btn btn--secondary';
          openTask.href = 'field-task.html?task=' + encodeURIComponent(entry.taskId);
          openTask.textContent = 'К заданию';
          actions.appendChild(openTask);

          var remove = document.createElement('button');
          remove.type = 'button';
          remove.className = 'btn btn--secondary diary__delete';
          remove.textContent = 'Удалить запись';
          remove.addEventListener('click', function () {
            if (!window.confirm('Удалить эту запись из Дневника? Само задание можно выполнить снова.')) {
              return;
            }
            portal.deleteDiaryEntry(entry.id);
            renderDiary(container);
          });
          actions.appendChild(remove);

          item.appendChild(head);
          item.appendChild(name);
          item.appendChild(story);
          item.appendChild(status);
          item.appendChild(actions);
          list.appendChild(item);
        });

      container.appendChild(list);
    }

    var surveyHost = document.createElement('section');
    surveyHost.setAttribute('data-adult-survey', '');
    surveyHost.setAttribute('aria-label', 'Для взрослых');
    surveyHost.hidden = true;
    container.appendChild(surveyHost);

    var nextHost = document.createElement('div');
    nextHost.setAttribute('data-diary-next', '');
    nextHost.hidden = true;
    container.appendChild(nextHost);

    if (shouldShowAdultSurvey()) {
      renderAdultSurvey(surveyHost, nextHost);
    } else if (entries.length) {
      var footer = document.createElement('div');
      footer.className = 'diary__footer';
      var cont = document.createElement('a');
      cont.className = 'btn btn--cta';
      cont.href = portal.getResumeHref ? portal.getResumeHref() : 'achievements.html';
      cont.textContent = 'Продолжить экспедицию →';
      footer.appendChild(cont);
      container.appendChild(footer);
    }
  }

  portal.onReady(function () {
    var container = document.querySelector('[data-diary]');
    if (!container) return;
    renderDiary(container);
  });
})();
