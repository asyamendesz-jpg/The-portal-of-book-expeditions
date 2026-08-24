(function () {
  'use strict';

  var portal = window.ReadingPortal;

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
      return;
    }

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

    var footer = document.createElement('div');
    footer.className = 'diary__footer';
    var cont = document.createElement('a');
    cont.className = 'btn btn--cta';
    cont.href = portal.getResumeHref ? portal.getResumeHref() : 'achievements.html';
    cont.textContent = 'Продолжить экспедицию →';
    footer.appendChild(cont);
    container.appendChild(footer);
  }

  portal.onReady(function () {
    var container = document.querySelector('[data-diary]');
    if (!container) return;
    renderDiary(container);
  });
})();
