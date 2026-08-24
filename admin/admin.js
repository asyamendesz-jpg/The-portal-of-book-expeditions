(function () {
  'use strict';

  var cfg = (window.ReadingPortal && window.ReadingPortal.analyticsConfig) || {};
  var client = null;

  var FUNNEL = [
    { event: 'expedition_started', label: 'Начали экспедицию' },
    { event: 'alice_opened', label: 'Открыли «Приключения Алисы»' },
    { event: 'episode_started', label: 'Начали эпизод' },
    { event: 'episode_completed', label: 'Прослушали эпизод' },
    { event: 'characters_opened', label: 'Открыли героев' },
    { event: 'characters_completed', label: 'Познакомились с героями' },
    { event: 'character_quiz_started', label: 'Начали «Узнай героя»' },
    { event: 'character_quiz_completed', label: 'Узнали героев' },
    { event: 'character_card_started', label: 'Начали сборку карточек' },
    { event: 'character_card_completed', label: 'Собрали карточки' },
    { event: 'field_task_opened', label: 'Открыли полевое задание' },
    { event: 'field_task_completed', label: 'Выполнили полевое задание' },
    { event: 'expedition_completed', label: 'Завершили экспедицию' }
  ];

  function $(sel) {
    return document.querySelector(sel);
  }

  function show(el, on) {
    if (!el) return;
    el.hidden = !on;
  }

  function isConfigured() {
    return !!(cfg.supabaseUrl && cfg.supabaseAnonKey);
  }

  function getClient() {
    if (client) return client;
    if (!window.supabase || !isConfigured()) return null;
    client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
    return client;
  }

  function uniqueSessions(rows, eventName) {
    var set = {};
    (rows || []).forEach(function (row) {
      if (row.event_name === eventName && row.session_id) {
        set[row.session_id] = true;
      }
    });
    return Object.keys(set).length;
  }

  function pct(part, whole) {
    if (!whole) return 0;
    return Math.round((part / whole) * 100);
  }

  function setStatus(text) {
    var el = $('[data-admin-status]');
    if (el) el.textContent = text;
  }

  function setError(text) {
    var el = $('[data-admin-error]');
    if (!el) return;
    if (!text) {
      el.hidden = true;
      el.textContent = '';
      return;
    }
    el.hidden = false;
    el.textContent = text;
  }

  function renderMetrics(rows) {
    var host = $('[data-admin-metrics]');
    if (!host) return;

    var items = [
      { label: 'Посетили сайт', value: uniqueSessions(rows, 'site_opened') },
      { label: 'Начали экспедицию', value: uniqueSessions(rows, 'expedition_started') },
      { label: 'Открыли «Алису»', value: uniqueSessions(rows, 'alice_opened') },
      { label: 'Завершили экспедицию', value: uniqueSessions(rows, 'expedition_completed') },
      { label: 'Полевое задание', value: uniqueSessions(rows, 'field_task_completed') },
      {
        label: 'Ответили на вопрос',
        value:
          uniqueSessions(rows, 'photo_diary_interest_yes') +
          uniqueSessions(rows, 'photo_diary_interest_no') +
          uniqueSessions(rows, 'photo_diary_interest_unsure')
      }
    ];

    host.innerHTML = items.map(function (item) {
      return (
        '<article class="card admin-metric">' +
        '<div class="admin-metric__value">' + item.value + '</div>' +
        '<div class="admin-metric__label">' + item.label + '</div>' +
        '</article>'
      );
    }).join('');
  }

  function renderFunnel(rows) {
    var host = $('[data-admin-funnel]');
    if (!host) return;

    var counts = FUNNEL.map(function (step) {
      return {
        label: step.label,
        event: step.event,
        count: uniqueSessions(rows, step.event)
      };
    });

    var first = counts[0] ? counts[0].count : 0;
    var maxDrop = { index: -1, rate: 0 };

    counts.forEach(function (step, i) {
      if (i === 0) return;
      var prev = counts[i - 1].count;
      if (!prev) return;
      var drop = ((prev - step.count) / prev) * 100;
      if (drop > maxDrop.rate) {
        maxDrop = { index: i, rate: drop };
      }
    });

    host.innerHTML = '<ol class="funnel">' + counts.map(function (step, i) {
      var prev = i === 0 ? null : counts[i - 1].count;
      var fromPrev = prev == null ? null : pct(step.count, prev);
      var fromStart = pct(step.count, first);
      var width = first ? Math.max(4, pct(step.count, first)) : 0;
      var dropNote = '';
      if (i === maxDrop.index && maxDrop.rate >= 15) {
        dropNote = '<div class="funnel__meta funnel__drop">Самая большая потеря: −' +
          Math.round(maxDrop.rate) + '% от предыдущего этапа</div>';
      }
      return (
        '<li class="funnel__item">' +
        '<div class="funnel__row"><span>' + step.label + '</span><span>' + step.count + '</span></div>' +
        '<div class="funnel__meta">' +
          (fromPrev == null ? 'старт воронки' : fromPrev + '% от предыдущего') +
          (first ? ' · ' + fromStart + '% от начавших' : '') +
        '</div>' +
        dropNote +
        '<div class="funnel__bar"><span style="width:' + width + '%"></span></div>' +
        '</li>'
      );
    }).join('') + '</ol>';
  }

  function renderField(rows) {
    var host = $('[data-admin-field]');
    if (!host) return;
    var opened = uniqueSessions(rows, 'field_task_opened');
    var done = uniqueSessions(rows, 'field_task_completed');
    var rate = pct(done, opened);
    host.innerHTML =
      '<p><strong>Открыли:</strong> ' + opened + '</p>' +
      '<p><strong>Выполнили:</strong> ' + done + '</p>' +
      '<p><strong>Completion rate:</strong> ' + (opened ? rate + '%' : '—') + '</p>';
  }

  function renderSurvey(rows) {
    var host = $('[data-admin-survey]');
    if (!host) return;

    var viewed = uniqueSessions(rows, 'photo_diary_question_viewed');
    var yes = uniqueSessions(rows, 'photo_diary_interest_yes');
    var no = uniqueSessions(rows, 'photo_diary_interest_no');
    var unsure = uniqueSessions(rows, 'photo_diary_interest_unsure');
    var answered = yes + no + unsure;

    function row(label, value) {
      var p = pct(value, answered);
      return (
        '<div class="survey-row">' +
        '<span>' + label + '</span><span>' + value + '</span><span>' + (answered ? p + '%' : '—') + '</span>' +
        '<div class="survey-bar"><span style="width:' + (answered ? p : 0) + '%"></span></div>' +
        '</div>'
      );
    }

    host.innerHTML =
      '<p><strong>Вопрос увидели:</strong> ' + viewed + '</p>' +
      '<p><strong>Ответили:</strong> ' + answered + '</p>' +
      '<div class="survey-grid">' +
      row('Да', yes) +
      row('Нет', no) +
      row('Не знаю', unsure) +
      '</div>';
  }

  function renderRaw(rows) {
    var host = $('[data-admin-raw]');
    if (!host) return;
    var latest = (rows || []).slice().sort(function (a, b) {
      return String(b.created_at).localeCompare(String(a.created_at));
    }).slice(0, 30);

    if (!latest.length) {
      host.innerHTML = '<p>Пока нет событий.</p>';
      return;
    }

    host.innerHTML =
      '<table class="raw-table"><thead><tr>' +
      '<th>Событие</th><th>Экспедиция</th><th>Время</th><th>session</th>' +
      '</tr></thead><tbody>' +
      latest.map(function (row) {
        return (
          '<tr>' +
          '<td>' + (row.event_name || '') + '</td>' +
          '<td>' + (row.expedition_id || row.book_id || '—') + '</td>' +
          '<td>' + (row.created_at ? new Date(row.created_at).toLocaleString('ru-RU') : '—') + '</td>' +
          '<td>' + String(row.session_id || '').slice(0, 8) + '…</td>' +
          '</tr>'
        );
      }).join('') +
      '</tbody></table>';
  }

  async function loadDashboard() {
    var sb = getClient();
    if (!sb) {
      setStatus('Supabase не настроен.');
      return;
    }

    setStatus('Загрузка…');
    var result = await sb
      .from('events')
      .select('session_id,event_name,expedition_id,book_id,task_id,survey_id,created_at')
      .order('created_at', { ascending: false })
      .limit(5000);

    if (result.error) {
      setStatus('Не удалось загрузить статистику: ' + result.error.message);
      return;
    }

    var rows = result.data || [];
    if (!rows.length) {
      setStatus('Пока нет данных. Они появятся после первых прохождений экспедиции.');
    } else {
      setStatus('Данные за всё время · событий в выборке: ' + rows.length);
    }

    renderMetrics(rows);
    renderFunnel(rows);
    renderField(rows);
    renderSurvey(rows);
    renderRaw(rows);
  }

  function showLogin() {
    show($('[data-admin-login]'), true);
    show($('[data-admin-dash]'), false);
  }

  function showDash() {
    show($('[data-admin-login]'), false);
    show($('[data-admin-dash]'), true);
    loadDashboard();
  }

  async function init() {
    var setup = $('[data-admin-setup]');
    if (!isConfigured()) {
      show(setup, true);
      $('[data-admin-form]').querySelectorAll('input,button').forEach(function (el) {
        el.disabled = true;
      });
      return;
    }
    show(setup, false);

    var sb = getClient();
    if (!sb) {
      setError('Не удалось инициализировать Supabase.');
      return;
    }

    var sessionRes = await sb.auth.getSession();
    if (sessionRes.data && sessionRes.data.session) {
      showDash();
    } else {
      showLogin();
    }

    $('[data-admin-form]').addEventListener('submit', async function (event) {
      event.preventDefault();
      setError('');
      var form = event.target;
      var email = form.email.value.trim();
      var password = form.password.value;
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      var res = await sb.auth.signInWithPassword({ email: email, password: password });
      btn.disabled = false;
      if (res.error) {
        setError('Не удалось войти. Проверьте email и пароль.');
        return;
      }
      form.reset();
      showDash();
    });

    $('[data-admin-logout]').addEventListener('click', async function () {
      await sb.auth.signOut();
      showLogin();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
