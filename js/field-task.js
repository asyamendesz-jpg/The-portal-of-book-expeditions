(function () {
  'use strict';

  var portal = window.ReadingPortal;

  function renderDone(root, task) {
    root.innerHTML = '';

    var panel = document.createElement('section');
    panel.className = 'field-task card';

    var title = document.createElement('h2');
    title.className = 'field-task__title';
    title.textContent = 'Отлично! Задание экспедиции выполнено.';

    var status = document.createElement('p');
    status.className = 'field-task__status is-done';
    status.textContent = '✓ Задание выполнено';

    var hint = document.createElement('p');
    hint.className = 'field-task__hint';
    hint.textContent = 'Запись появилась в Дневнике экспедиции. Можно идти дальше.';

    var actions = document.createElement('div');
    actions.className = 'field-task__actions';

    var diary = document.createElement('a');
    diary.className = 'btn btn--cta';
    diary.href = task.nextHref || 'diary.html';
    diary.textContent = task.nextLabel || 'Открыть Дневник →';

    actions.appendChild(diary);
    panel.appendChild(title);
    panel.appendChild(status);
    panel.appendChild(hint);
    panel.appendChild(actions);
    root.appendChild(panel);
  }

  function renderTask(root, task) {
    root.innerHTML = '';

    var panel = document.createElement('section');
    panel.className = 'field-task card';

    var type = document.createElement('p');
    type.className = 'field-task__type';
    type.textContent = task.typeLabel || 'Задание экспедиции';

    var title = document.createElement('h2');
    title.className = 'field-task__title';
    title.textContent = 'Задание экспедиции';

    var prompt = document.createElement('p');
    prompt.className = 'field-task__prompt';
    prompt.textContent = task.prompt;

    var hint = document.createElement('p');
    hint.className = 'field-task__hint';
    hint.textContent = task.hint;

    var done = document.createElement('button');
    done.type = 'button';
    done.className = 'btn btn--cta';
    done.textContent = 'Я выполнил задание';
    done.addEventListener('click', function () {
      portal.completeFieldTask(task);
      if (portal.track) {
        portal.track('field_task_completed', {
          expeditionId: task.expeditionId,
          taskId: task.id
        });
      }
      renderDone(root, task);
    });

    panel.appendChild(type);
    panel.appendChild(title);
    panel.appendChild(prompt);
    panel.appendChild(hint);
    panel.appendChild(done);
    root.appendChild(panel);
  }

  function getTask() {
    var id = portal.getQueryParam('task');
    return portal.getFieldTaskById(id);
  }

  portal.onReady(function () {
    var root = document.querySelector('[data-field-task]');
    if (!root) return;

    var task = getTask();
    if (!task) {
      root.appendChild(portal.createEmpty('field-task__empty', 'Полевое задание скоро появится.'));
      return;
    }

    if (portal.mountJourneyChrome) {
      portal.mountJourneyChrome({ currentStepId: 'field' });
    }

    if (portal.track) {
      portal.track('field_task_opened', {
        expeditionId: task.expeditionId,
        taskId: task.id
      });
    }

    var existing = portal.findDiaryEntryByTask(task.id);
    if (existing && existing.taskCompleted) {
      renderDone(root, task);
    } else {
      renderTask(root, task);
    }
  });
})();
