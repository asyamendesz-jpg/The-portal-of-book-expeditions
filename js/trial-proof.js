/**
 * Профессиональный слой после испытания.
 * Не меняет детский сценарий: аудио + PDF остаются главными.
 */
(function () {
  'use strict';

  var PORTFO_CASE = 'https://portfo.ru/#case-portal-proof';

  var PROOF = {
    'alice-cards': {
      happened:
        'Ты слушаешь отрывок, затем работаешь с PDF-карточками: выполняешь задания от руки — на бумаге или с экрана.',
      why:
        'Карточки дают ещё один способ вернуться к истории: не только ответить «правильно», а сделать что-то руками после прослушивания.',
      notQuiz:
        'Обычная викторина часто сводится к выбору ответа. Здесь задание вынесено в карточки и действие после аудио — чтобы взаимодействие с произведением не заканчивалось на экране вопросов.'
    },
    'alice-tasks': {
      happened:
        'Ты слушаешь аудиоэпизод, затем открываешь PDF с заданиями и выполняешь их от руки, возвращаясь к событиям и деталям истории.',
      why:
        'Последовательность «услышать → выполнить задания» помогает заново пройтись по произведению: не одним кликом, а через работу с материалами экспедиции.',
      notQuiz:
        'Мне было важно, чтобы испытание не сводилось только к выбору правильного ответа. Поэтому задания живут в PDF и выполняются вручную — как часть маршрута исследователя.'
    }
  };

  function getTrialId() {
    var body = document.body;
    return (body && body.getAttribute('data-trial-id')) || '';
  }

  function buildChannels() {
    var wrap = document.createElement('div');
    wrap.className = 'trial-proof__channels';

    var heading = document.createElement('h4');
    heading.className = 'trial-proof__channels-title';
    heading.textContent = 'Как устроен опыт';
    wrap.appendChild(heading);

    var list = document.createElement('dl');
    list.className = 'trial-proof__channel-list';

    var items = [
      ['Вижу', 'Карточки, задания и материалы на экране или на бумаге.'],
      ['Слышу', 'Аудиоотрывок или эпизод перед заданием.'],
      ['Делаю', 'Скачиваю или открываю PDF и выполняю задания от руки.'],
      ['Осмысляю', 'Возвращаюсь к событиям, деталям и героям произведения.']
    ];

    items.forEach(function (pair) {
      var dt = document.createElement('dt');
      dt.textContent = pair[0];
      var dd = document.createElement('dd');
      dd.textContent = pair[1];
      list.appendChild(dt);
      list.appendChild(dd);
    });

    wrap.appendChild(list);
    return wrap;
  }

  function buildProofPanel(trialId) {
    var data = PROOF[trialId];
    if (!data) return null;

    var portal = window.ReadingPortal;
    var caseUrl =
      (portal && portal.portfoCaseUrl) || PORTFO_CASE;

    var details = document.createElement('details');
    details.className = 'trial-proof';

    var summary = document.createElement('summary');
    summary.className = 'trial-proof__summary';
    summary.textContent = 'Почему это устроено именно так?';
    details.appendChild(summary);

    var body = document.createElement('div');
    body.className = 'trial-proof__body';

    var note = document.createElement('p');
    note.className = 'trial-proof__note';
    note.textContent =
      'Этот блок — для взрослых и тех, кто смотрит продукт как решение. Детям достаточно испытания выше.';
    body.appendChild(note);

    function addBlock(title, text) {
      var h = document.createElement('h4');
      h.className = 'trial-proof__heading';
      h.textContent = title;
      var p = document.createElement('p');
      p.className = 'trial-proof__text';
      p.textContent = text;
      body.appendChild(h);
      body.appendChild(p);
    }

    addBlock('Что происходило', data.happened);
    addBlock('Зачем', data.why);
    addBlock('Почему не обычная викторина', data.notQuiz);

    var key = document.createElement('p');
    key.className = 'trial-proof__key';
    key.textContent =
      'Каждая механика здесь отвечает на задачу взаимодействия ребёнка с произведением — не «просто чтобы было интереснее».';
    body.appendChild(key);

    body.appendChild(buildChannels());

    var actions = document.createElement('div');
    actions.className = 'trial-proof__actions';

    var caseLink = document.createElement('a');
    caseLink.className = 'btn btn--primary';
    caseLink.href = caseUrl;
    caseLink.target = '_blank';
    caseLink.rel = 'noopener noreferrer';
    caseLink.textContent = 'Посмотреть, как создавался проект →';
    actions.appendChild(caseLink);

    var quizLink = document.createElement('a');
    quizLink.className = 'btn btn--secondary';
    quizLink.href = 'quiz.html';
    quizLink.textContent = 'К другим испытаниям';
    actions.appendChild(quizLink);

    body.appendChild(actions);
    details.appendChild(body);
    return details;
  }

  function buildDoneHint() {
    var box = document.createElement('div');
    box.className = 'trial-done';

    var title = document.createElement('p');
    title.className = 'trial-done__title';
    title.textContent = 'Готово с заданием?';
    box.appendChild(title);

    var text = document.createElement('p');
    text.className = 'trial-done__text';
    text.textContent =
      'Если PDF уже выполнен — отлично. Ниже можно узнать, зачем испытание устроено именно так (для взрослых).';
    box.appendChild(text);

    return box;
  }

  function init() {
    var host = document.querySelector('[data-trial-proof]');
    if (!host) return;

    var trialId = getTrialId();
    var panel = buildProofPanel(trialId);
    if (!panel) return;

    host.appendChild(buildDoneHint());
    host.appendChild(panel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
