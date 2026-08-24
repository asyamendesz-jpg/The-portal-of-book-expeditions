(function () {
  'use strict';

  var portal = window.ReadingPortal;

  function getTask() {
    var id = portal.getQueryParam('task');
    return portal.getFieldTaskById(id);
  }

  function formatDate(iso) {
    if (!iso) return '';
    try {
      var d = new Date(iso);
      return d.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return '';
    }
  }

  function renderAdultGate(root, task, entry) {
    root.innerHTML = '';

    var panel = document.createElement('section');
    panel.className = 'adult-gate card';

    var title = document.createElement('h2');
    title.className = 'adult-gate__title';
    title.textContent = 'Здесь понадобится помощь взрослого';

    var text = document.createElement('p');
    text.className = 'adult-gate__text';
    text.textContent = 'Попроси взрослого помочь сфотографировать работу и выбрать файл.';

    var invite = document.createElement('button');
    invite.type = 'button';
    invite.className = 'btn btn--cta';
    invite.textContent = 'Позвать взрослого';
    invite.addEventListener('click', function () {
      renderAdultStep(root, task, entry);
    });

    var back = document.createElement('button');
    back.type = 'button';
    back.className = 'btn btn--secondary';
    back.textContent = 'Продолжить без фото';
    back.addEventListener('click', function () {
      renderDone(root, task, entry);
    });

    panel.appendChild(title);
    panel.appendChild(text);
    panel.appendChild(invite);
    panel.appendChild(back);
    root.appendChild(panel);
  }

  function renderAdultStep(root, task, entry) {
    root.innerHTML = '';

    var panel = document.createElement('section');
    panel.className = 'adult-gate card adult-gate--adult';

    var badge = document.createElement('p');
    badge.className = 'adult-gate__badge';
    badge.textContent = 'Для взрослых';

    var title = document.createElement('h2');
    title.className = 'adult-gate__title';
    title.textContent = 'Сохранение работы в Дневнике';

    var text = document.createElement('p');
    text.className = 'adult-gate__text';
    text.textContent =
      'Здесь можно сохранить фотографию выполненной работы ребёнка. ' +
      'Сейчас безопасное хранилище файлов ещё не подключено — поэтому загрузка фото временно недоступна.';

    var warn = document.createElement('p');
    warn.className = 'adult-gate__warn';
    warn.textContent =
      'Когда загрузка появится, просим загружать только саму работу — без лиц детей, документов, адресов и других личных данных.';

    var placeholder = document.createElement('p');
    placeholder.className = 'adult-gate__placeholder';
    placeholder.textContent = '📷 Добавление фото появится позже';

    var note = document.createElement('p');
    note.className = 'adult-gate__note';
    note.textContent =
      'Само задание уже отмечено выполненным. Работа есть в Дневнике экспедиции без фото.';

    var actions = document.createElement('div');
    actions.className = 'adult-gate__actions';

    var diary = document.createElement('a');
    diary.className = 'btn btn--cta';
    diary.href = 'diary.html';
    diary.textContent = 'Открыть Дневник экспедиции';

    var cont = document.createElement('a');
    cont.className = 'btn btn--secondary';
    cont.href = task.nextHref || 'achievements.html';
    cont.textContent = 'Продолжить экспедицию →';

    actions.appendChild(diary);
    actions.appendChild(cont);

    panel.appendChild(badge);
    panel.appendChild(title);
    panel.appendChild(text);
    panel.appendChild(warn);
    panel.appendChild(placeholder);
    panel.appendChild(note);
    panel.appendChild(actions);
    root.appendChild(panel);
  }

  function renderDone(root, task, entry) {
    root.innerHTML = '';

    var panel = document.createElement('section');
    panel.className = 'field-task card';

    var title = document.createElement('h2');
    title.className = 'field-task__title';
    title.textContent = 'Отлично. Задание выполнено.';

    var status = document.createElement('p');
    status.className = 'field-task__status is-done';
    status.textContent = entry && entry.photoUploaded
      ? '✓ Задание выполнено · 📷 Работа сохранена в Дневнике'
      : '✓ Задание выполнено';

    var hint = document.createElement('p');
    hint.className = 'field-task__hint';
    hint.textContent = 'Можно идти дальше — или сохранить работу в Дневнике с помощью взрослого.';

    var actions = document.createElement('div');
    actions.className = 'field-task__actions';

    var cont = document.createElement('a');
    cont.className = 'btn btn--cta';
    cont.href = task.nextHref || 'achievements.html';
    cont.textContent = task.nextLabel || 'Продолжить экспедицию →';

    var save = document.createElement('button');
    save.type = 'button';
    save.className = 'btn btn--secondary';
    save.textContent = 'Сохранить работу в Дневнике';
    save.addEventListener('click', function () {
      renderAdultGate(root, task, entry);
    });

    var diary = document.createElement('a');
    diary.className = 'btn btn--secondary';
    diary.href = 'diary.html';
    diary.textContent = 'Открыть Дневник';

    actions.appendChild(cont);
    actions.appendChild(save);
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
      var entry = portal.completeFieldTask(task);
      renderDone(root, task, entry);
    });

    panel.appendChild(type);
    panel.appendChild(title);
    panel.appendChild(prompt);
    panel.appendChild(hint);
    panel.appendChild(done);
    root.appendChild(panel);
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

    var existing = portal.findDiaryEntryByTask(task.id);
    var wantSave = portal.getQueryParam('save') === '1';

    if (existing && existing.taskCompleted) {
      if (wantSave) {
        renderAdultGate(root, task, existing);
      } else {
        renderDone(root, task, existing);
      }
    } else {
      renderTask(root, task);
    }
  });
})();
