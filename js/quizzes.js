(function () {
  'use strict';

  var portal = window.ReadingPortal;
  var state = {
    filter: 'all',
    query: ''
  };

  function getTrialPageUrl(quiz) {
    return quiz.page || ('quiz.html?trial=' + encodeURIComponent(quiz.id));
  }

  function starsHtml(count) {
    var n = Math.max(0, Math.min(5, Number(count) || 0));
    var out = '';
    var i;
    for (i = 0; i < 5; i++) {
      out += i < n ? '★' : '☆';
    }
    return out;
  }

  function createQuizCard(quiz) {
    var card = document.createElement('article');
    card.className = 'trial-card card';

    var title = document.createElement('h3');
    title.className = 'trial-card__title';
    title.textContent = quiz.title;

    var stars = document.createElement('p');
    stars.className = 'trial-card__stars';
    stars.setAttribute('aria-label', 'Сложность: ' + (quiz.stars || 0) + ' из 5');
    stars.textContent = starsHtml(quiz.stars);

    var description = document.createElement('p');
    description.className = 'trial-card__description';
    description.textContent = quiz.description;

    card.appendChild(title);
    card.appendChild(stars);
    card.appendChild(description);

    var link = document.createElement('a');
    link.className = 'btn btn--primary trial-card__link';
    link.href = getTrialPageUrl(quiz);
    link.textContent = 'Начать испытание';
    link.setAttribute('aria-label', 'Начать испытание: ' + quiz.title);
    card.appendChild(link);

    return card;
  }

  function matchesFilters(quiz) {
    if (state.filter !== 'all' && quiz.bookId !== state.filter) return false;
    if (!state.query) return true;
    var q = state.query.toLowerCase();
    return String(quiz.title || '').toLowerCase().indexOf(q) !== -1 ||
      String(quiz.description || '').toLowerCase().indexOf(q) !== -1;
  }

  function renderHowItWorks(container) {
    var block = document.createElement('section');
    block.className = 'quiz-how';
    block.innerHTML =
      '<h3 class="quiz-how__title">Как это работает?</h3>' +
      '<ol class="quiz-how__list">' +
      '<li class="quiz-how__item"><strong>Слушай</strong> — включи эпизод из книги.</li>' +
      '<li class="quiz-how__item"><strong>Выполняй</strong> — скачай PDF и сделай задания.</li>' +
      '<li class="quiz-how__item"><strong>Проверь себя</strong> — возвращайся к героям и карточкам.</li>' +
      '</ol>';
    container.appendChild(block);
  }

  function renderControls(container, onChange) {
    var controls = document.createElement('div');
    controls.className = 'quiz-controls';

    var tabs = document.createElement('div');
    tabs.className = 'quiz-tabs';
    tabs.setAttribute('role', 'tablist');

    var filters = [
      { id: 'all', label: 'Все' },
      { id: 'alice-journey', label: 'Приключения Алисы' }
    ];

    filters.forEach(function (filter) {
      var tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'quiz-tabs__btn' + (state.filter === filter.id ? ' is-active' : '');
      tab.textContent = filter.label;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', state.filter === filter.id ? 'true' : 'false');
      tab.addEventListener('click', function () {
        state.filter = filter.id;
        onChange();
      });
      tabs.appendChild(tab);
    });

    var search = document.createElement('label');
    search.className = 'quiz-search';
    search.innerHTML = '<span class="quiz-search__label">Поиск</span>';
    var input = document.createElement('input');
    input.type = 'search';
    input.className = 'quiz-search__input';
    input.placeholder = 'Название испытания…';
    input.value = state.query;
    input.addEventListener('input', function () {
      state.query = input.value.trim();
      onChange();
    });
    search.appendChild(input);

    controls.appendChild(tabs);
    controls.appendChild(search);
    container.appendChild(controls);
  }

  function renderQuizList(container) {
    var quizzes = (portal.quizzes || []).filter(matchesFilters);
    var sections = {};

    quizzes.forEach(function (quiz) {
      var name = quiz.section || 'Испытания';
      if (!sections[name]) sections[name] = [];
      sections[name].push(quiz);
    });

    var keys = Object.keys(sections);
    if (!keys.length) {
      container.appendChild(portal.createEmpty('trials-empty', 'По этому запросу испытаний не найдено.'));
      return;
    }

    keys.forEach(function (sectionName) {
      var block = document.createElement('section');
      block.className = 'quiz-section';

      var heading = document.createElement('h3');
      heading.className = 'quiz-section__title';
      heading.textContent = sectionName;
      block.appendChild(heading);

      var list = document.createElement('ul');
      list.className = 'trials-list';

      sections[sectionName].forEach(function (quiz) {
        var item = document.createElement('li');
        item.className = 'trials-list__item';
        item.appendChild(createQuizCard(quiz));
        list.appendChild(item);
      });

      block.appendChild(list);
      container.appendChild(block);
    });
  }

  function renderQuizzes(container) {
    function paint() {
      container.innerHTML = '';
      renderHowItWorks(container);
      renderControls(container, paint);

      if (!portal.quizzes || !portal.quizzes.length) {
        container.appendChild(portal.createEmpty('trials-empty', 'Испытания скоро появятся.'));
        return;
      }

      renderQuizList(container);
    }

    paint();
  }

  function renderTrialDetail(container, quiz) {
    container.innerHTML = '';
    container.className = 'content-area card';

    var section = document.createElement('section');
    section.className = 'trial-detail card';
    section.setAttribute('aria-labelledby', 'trial-detail-title');

    var back = document.createElement('a');
    back.className = 'trial-detail__back';
    back.href = 'quiz.html';
    back.textContent = '← К списку испытаний';
    section.appendChild(back);

    var sectionLabel = document.createElement('p');
    sectionLabel.className = 'trial-detail__section';
    sectionLabel.textContent = quiz.section || 'Испытания';
    section.appendChild(sectionLabel);

    var title = document.createElement('h2');
    title.className = 'trial-detail__title';
    title.id = 'trial-detail-title';
    title.textContent = quiz.title;
    section.appendChild(title);

    var instruction = document.createElement('p');
    instruction.className = 'trial-detail__instruction';
    instruction.textContent = quiz.instruction || quiz.description;
    section.appendChild(instruction);

    var hint = document.createElement('p');
    hint.className = 'trial-detail__hint';
    hint.textContent = quiz.hint || 'Прослушай эпизод, затем скачай PDF и выполни задания.';
    section.appendChild(hint);

    var actions = document.createElement('div');
    actions.className = 'trial-detail__actions';

    var playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'btn btn--secondary trial-detail__play';
    playBtn.textContent = quiz.playLabel || '▶ Прослушать эпизод';
    actions.appendChild(playBtn);

    var pdfPath = quiz.pdf || '';
    var pdfFileName = pdfPath.split('/').pop() || 'zadanie.pdf';
    var encodedPdf = portal.encodeAssetPath(pdfPath);

    var downloadBtn = document.createElement('a');
    downloadBtn.className = 'btn btn--primary trial-detail__download';
    downloadBtn.href = encodedPdf;
    downloadBtn.download = pdfFileName;
    downloadBtn.textContent = quiz.downloadLabel || 'Скачать PDF';
    actions.appendChild(downloadBtn);

    if (!quiz.simpleActions) {
      var openBtn = document.createElement('a');
      openBtn.className = 'btn btn--secondary trial-detail__open';
      openBtn.href = encodedPdf;
      openBtn.target = '_blank';
      openBtn.rel = 'noopener';
      openBtn.textContent = 'Открыть PDF';
      actions.appendChild(openBtn);
    }

    section.appendChild(actions);

    var audio = document.createElement('audio');
    audio.className = 'trial-detail__audio';
    audio.controls = true;
    audio.preload = 'metadata';
    audio.setAttribute('aria-label', 'Аудио: ' + quiz.title);

    if (quiz.audio) {
      var source = document.createElement('source');
      source.src = portal.encodeAssetPath(quiz.audio);
      source.type = 'audio/mpeg';
      audio.appendChild(source);
    }

    playBtn.addEventListener('click', function () {
      audio.play();
    });

    section.appendChild(audio);

    if (pdfPath) {
      var pdfWrap = document.createElement('div');
      pdfWrap.className = 'trial-detail__pdf-wrap';

      var pdfLabel = document.createElement('p');
      pdfLabel.className = 'trial-detail__pdf-label';
      pdfLabel.textContent = 'Просмотр задания:';
      pdfWrap.appendChild(pdfLabel);

      var iframe = document.createElement('iframe');
      iframe.className = 'trial-detail__pdf';
      iframe.src = encodedPdf;
      iframe.title = quiz.title + ' — PDF';
      pdfWrap.appendChild(iframe);

      var fallback = document.createElement('p');
      fallback.className = 'trial-detail__pdf-fallback';
      fallback.innerHTML = 'PDF не отображается? <a href="' + encodedPdf + '" target="_blank" rel="noopener">Откройте файл в новой вкладке</a> или скачайте его кнопкой выше.';
      pdfWrap.appendChild(fallback);

      section.appendChild(pdfWrap);
    }

    container.appendChild(section);
    document.title = 'Внеклассное чтение — ' + quiz.title;
  }

  function initQuizPage() {
    var trialId = portal.getQueryParam('trial');
    var banner = document.querySelector('[data-page-banner]');
    var listContainer = document.querySelector('[data-quiz-list]');
    var trialContainer = document.querySelector('[data-trial-view]');

    if (trialId && trialContainer) {
      var quiz = portal.findQuiz(trialId);
      if (quiz) {
        if (banner) banner.hidden = true;
        if (listContainer) listContainer.hidden = true;
        trialContainer.hidden = false;
        renderTrialDetail(trialContainer, quiz);
        return;
      }
    }

    if (trialContainer) trialContainer.hidden = true;
    if (listContainer) {
      listContainer.hidden = false;
      renderQuizzes(listContainer);
    }
  }

  portal.onReady(initQuizPage);
})();
