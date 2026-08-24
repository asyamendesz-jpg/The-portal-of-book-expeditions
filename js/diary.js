(function (global) {
  'use strict';

  var portal = global.ReadingPortal = global.ReadingPortal || {};
  var DIARY_KEY = 'readingPortal.diary';

  function safeParse(raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function makeId() {
    return 'entry-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }

  portal.getDiaryEntries = function () {
    var stored = safeParse(global.localStorage.getItem(DIARY_KEY));
    return stored && Array.isArray(stored.entries) ? stored.entries : [];
  };

  portal.saveDiaryEntries = function (entries) {
    try {
      global.localStorage.setItem(DIARY_KEY, JSON.stringify({ entries: entries }));
    } catch (e) {
      /* private mode / quota */
    }
  };

  portal.findDiaryEntryByTask = function (taskId) {
    var entries = portal.getDiaryEntries();
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].taskId === taskId) return entries[i];
    }
    return null;
  };

  /**
   * Отметить полевое задание выполненным.
   * photoUploaded всегда false, пока нет безопасного storage.
   */
  portal.completeFieldTask = function (task) {
    if (!task || !task.id) return null;

    var entries = portal.getDiaryEntries();
    var existing = null;
    var i;

    for (i = 0; i < entries.length; i++) {
      if (entries[i].taskId === task.id) {
        existing = entries[i];
        break;
      }
    }

    if (existing) {
      existing.status = 'completed';
      existing.taskCompleted = true;
      existing.photoUploaded = false;
      existing.updatedAt = new Date().toISOString();
    } else {
      entries.push({
        id: makeId(),
        taskId: task.id,
        expeditionId: task.expeditionId || 'alice-journey',
        type: task.type || 'draw',
        title: task.title || task.prompt,
        imageUrl: null,
        createdAt: new Date().toISOString(),
        status: 'completed',
        taskCompleted: true,
        photoUploaded: false
      });
    }

    portal.saveDiaryEntries(entries);
    portal.markJourneyFlag('fieldTaskCompleted');
    return portal.findDiaryEntryByTask(task.id);
  };

  portal.deleteDiaryEntry = function (entryId) {
    var entries = portal.getDiaryEntries().filter(function (entry) {
      return entry.id !== entryId;
    });
    portal.saveDiaryEntries(entries);
    return entries;
  };

  portal.getFieldTaskById = function (taskId) {
    var tasks = portal.fieldTasks || [];
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id === taskId) return tasks[i];
    }
    return tasks[0] || null;
  };

  /** Загрузка фото пока недоступна — нет безопасного backend/storage. */
  portal.isPhotoUploadAvailable = function () {
    return false;
  };
})(window);
