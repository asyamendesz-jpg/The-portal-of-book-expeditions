(function (global) {
  'use strict';

  var portal = global.ReadingPortal = global.ReadingPortal || {};
  var SURVEY_KEY = 'readingPortal.survey';
  var SESSION_KEY = 'readingPortal.sessionId';
  var lastSentAt = 0;
  var MIN_INTERVAL_MS = 80;
  var sendQueue = [];
  var flushTimer = null;

  var ALLOWED_EVENTS = {
    site_opened: true,
    expedition_started: true,
    book_selected: true,
    alice_opened: true,
    episode_started: true,
    episode_completed: true,
    characters_opened: true,
    characters_completed: true,
    character_quiz_started: true,
    character_quiz_completed: true,
    character_card_started: true,
    character_card_completed: true,
    field_task_opened: true,
    field_task_completed: true,
    achievements_opened: true,
    expedition_completed: true,
    photo_diary_question_viewed: true,
    photo_diary_interest_yes: true,
    photo_diary_interest_no: true,
    photo_diary_interest_unsure: true
  };

  function getConfig() {
    return portal.analyticsConfig || {};
  }

  function isLocalHost() {
    var host = global.location && global.location.hostname;
    return host === 'localhost' || host === '127.0.0.1' || host === '';
  }

  function isEnabled() {
    var cfg = getConfig();
    if (cfg.enabled === false) return false;
    if (isLocalHost() && cfg.trackLocal !== true) return false;
    return !!(cfg.supabaseUrl && cfg.supabaseAnonKey);
  }

  function makeUuid() {
    if (global.crypto && typeof global.crypto.randomUUID === 'function') {
      return global.crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  portal.getAnalyticsSessionId = function () {
    try {
      var existing = global.localStorage.getItem(SESSION_KEY);
      if (existing && existing.length >= 8) return existing;
      var id = makeUuid();
      global.localStorage.setItem(SESSION_KEY, id);
      return id;
    } catch (e) {
      return makeUuid();
    }
  };

  function clip(value, max) {
    if (value == null || value === '') return null;
    var str = String(value);
    return str.length > max ? str.slice(0, max) : str;
  }

  function sendToSupabase(row) {
    var cfg = getConfig();
    var url = String(cfg.supabaseUrl || '').replace(/\/$/, '') + '/rest/v1/events';
    var headers = {
      apikey: cfg.supabaseAnonKey,
      Authorization: 'Bearer ' + cfg.supabaseAnonKey,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    };
    var body = JSON.stringify(row);

    try {
      global.fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
        keepalive: true,
        mode: 'cors'
      }).catch(function () { /* аналитика не ломает UX */ });
    } catch (e) {
      /* ignore */
    }
  }

  function enqueueSend(row) {
    sendQueue.push(row);
    if (flushTimer) return;
    function flush() {
      flushTimer = null;
      if (!sendQueue.length) return;
      var now = Date.now();
      var wait = Math.max(0, MIN_INTERVAL_MS - (now - lastSentAt));
      if (wait > 0) {
        flushTimer = global.setTimeout(flush, wait);
        return;
      }
      lastSentAt = Date.now();
      sendToSupabase(sendQueue.shift());
      if (sendQueue.length) {
        flushTimer = global.setTimeout(flush, MIN_INTERVAL_MS);
      }
    }
    flush();
  }

  function ensureGa() {
    var id = getConfig().gaMeasurementId;
    if (!id || global.__rpGaReady) return;
    global.__rpGaReady = true;
    global.dataLayer = global.dataLayer || [];
    global.gtag = global.gtag || function () { global.dataLayer.push(arguments); };
    global.gtag('js', new Date());
    global.gtag('config', id, { anonymize_ip: true });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(script);
  }

  /**
   * Анонимное событие. Не передавать ПДн.
   */
  portal.track = function (eventName, props) {
    try {
      if (!eventName || !ALLOWED_EVENTS[eventName]) return;
      props = props || {};

      var payload = {
        event: eventName,
        sessionId: portal.getAnalyticsSessionId(),
        expeditionId: clip(props.expeditionId, 64),
        bookId: clip(props.bookId, 64),
        taskId: clip(props.taskId, 64),
        surveyId: clip(props.surveyId || getConfig().surveyId, 64),
        ts: new Date().toISOString()
      };

      try {
        global.dispatchEvent(new CustomEvent('rp:analytics', { detail: payload }));
      } catch (e1) { /* ignore */ }

      ensureGa();
      if (typeof global.gtag === 'function' && getConfig().gaMeasurementId) {
        global.gtag('event', eventName, {
          expedition_id: payload.expeditionId || '',
          book_id: payload.bookId || '',
          task_id: payload.taskId || ''
        });
      }

      if (!isEnabled()) return;

      enqueueSend({
        session_id: payload.sessionId,
        event_name: payload.event,
        expedition_id: payload.expeditionId,
        book_id: payload.bookId,
        task_id: payload.taskId,
        survey_id: payload.surveyId
      });
    } catch (err) {
      /* никогда не мешать детскому UX */
    }
  };

  portal.getSurveyState = function () {
    try {
      return JSON.parse(global.localStorage.getItem(SURVEY_KEY) || '{}') || {};
    } catch (e) {
      return {};
    }
  };

  portal.hasSurveyAnswer = function (surveyId) {
    var state = portal.getSurveyState();
    var id = surveyId || getConfig().surveyId || 'photo-diary-v1';
    return !!(state[id] && state[id].answered);
  };

  portal.saveSurveyAnswer = function (value, surveyId) {
    var id = surveyId || getConfig().surveyId || 'photo-diary-v1';
    var state = portal.getSurveyState();
    state[id] = {
      answered: true,
      answer: value,
      at: new Date().toISOString()
    };
    try {
      global.localStorage.setItem(SURVEY_KEY, JSON.stringify(state));
    } catch (e) { /* ignore */ }
  };

  /* site_opened один раз за загрузку страницы */
  portal.onReady(function () {
    if (document.body && document.body.classList.contains('page--admin')) return;
    portal.track('site_opened');
  });
})(window);
