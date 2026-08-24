(function (global) {
  'use strict';

  var portal = global.ReadingPortal = global.ReadingPortal || {};
  var SURVEY_KEY = 'readingPortal.survey';

  function getConfig() {
    return portal.analyticsConfig || {};
  }

  function ensureGa() {
    var id = getConfig().gaMeasurementId;
    if (!id || global.__rpGaReady) return;
    global.__rpGaReady = true;

    global.dataLayer = global.dataLayer || [];
    global.gtag = global.gtag || function () {
      global.dataLayer.push(arguments);
    };
    global.gtag('js', new Date());
    global.gtag('config', id, { anonymize_ip: true });

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(script);
  }

  function postToForm(payload) {
    var endpoint = getConfig().formEndpoint;
    if (!endpoint) return;

    try {
      var body = JSON.stringify(payload);
      if (global.navigator && typeof global.navigator.sendBeacon === 'function') {
        var blob = new Blob([body], { type: 'application/json' });
        global.navigator.sendBeacon(endpoint, blob);
        return;
      }
      global.fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: body,
        keepalive: true,
        mode: 'cors'
      }).catch(function () { /* сеть недоступна — UX не ломаем */ });
    } catch (e) {
      /* ignore */
    }
  }

  /**
   * Анонимное событие. Не передавать ПДн.
   * @param {string} eventName
   * @param {Object} [props]
   */
  portal.track = function (eventName, props) {
    if (!eventName) return;
    props = props || {};

    var payload = {
      event: eventName,
      surveyId: getConfig().surveyId || 'photo-diary-v1',
      expeditionId: props.expeditionId || undefined,
      taskId: props.taskId || undefined,
      value: props.value || undefined,
      ts: new Date().toISOString()
    };

    Object.keys(payload).forEach(function (key) {
      if (payload[key] === undefined) delete payload[key];
    });

    try {
      global.dispatchEvent(new CustomEvent('rp:analytics', { detail: payload }));
    } catch (e) { /* IE ignore */ }

    ensureGa();
    if (typeof global.gtag === 'function' && getConfig().gaMeasurementId) {
      global.gtag('event', eventName, {
        expedition_id: props.expeditionId || '',
        task_id: props.taskId || '',
        value_label: props.value || ''
      });
    }

    postToForm(payload);
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
})(window);
