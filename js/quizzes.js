(function () {
  'use strict';

  var portal = window.ReadingPortal;

  function getTrialPageUrl(quiz) {
    return 'quiz.html?trial=' + encodeURIComponent(quiz.id);
  }

  function createQuizCard(quiz) {
    var card = document.createElement('article');
    card.className = 'trial-card card';

    var title = document.createElement('h3');
    title.className = 'trial-card__title';
    title.textContent = quiz.title;

    var description = document.createElement('p');
    description.className = 'trial-card__description';
    description.textContent = quiz.description;

    card.appendChild(title);
    card.appendChild(description);

    var link = document.createElement('a');
    link.className = 'btn btn--primary trial-card__link';
    link.href = getTrialPageUrl(quiz);
    link.textContent = 'Начать испытание';
    link.setAttribute('aria-label', 'Начать испытание: ' + quiz.title);
    card.appendChild(link);

    return card;
  }

  function renderTabs(container) {
    var tabs = document.createElement('div');
    tabs.className = 'quiz-tabs';
    tabs.setAttribute('role', 'tablist');

    var tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'quiz-tabs__btn is-active';
    tab.textContent = 'Испытания';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', 'true');

    tabs.appendChild(tab);
    container.appendChild(tabs);
  }

  function renderQuizList(container) {
    var quizzes = portal.quizzes || [];
    var sections = {};

    quizzes.forEach(function (quiz) {
      var name = quiz.section || 'Испытания';
      if (!sections[name]) sections[name] = [];
      sections[name].push(quiz);
    });

    Object.keys(sections).forEach(function (sectionName) {
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
    container.innerHTML = '';
    renderTabs(container);

    if (!portal.quizzes || !portal.quizzes.length) {
      container.appendChild(portal.createEmpty('trials-empty', 'Испытания скоро появятся.'));
      return;
    }

    renderQuizList(container);
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
    hint.textContent = quiz.hint || 'Прослушай отрывок, затем скачай задание и выполни его.';
    section.appendChild(hint);

    var actions = document.createElement('div');
    actions.className = 'trial-detail__actions';

    var playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'btn btn--secondary trial-detail__play';
    playBtn.textContent = '▶ Прослушать отрывок';
    actions.appendChild(playBtn);

    var pdfPath = quiz.pdf || '';
    var pdfFileName = pdfPath.split('/').pop() || 'zadanie.pdf';
    var encodedPdf = portal.encodeAssetPath(pdfPath);

    var downloadBtn = document.createElement('a');
    downloadBtn.className = 'btn btn--primary trial-detail__download';
    downloadBtn.href = encodedPdf;
    downloadBtn.download = pdfFileName;
    downloadBtn.textContent = 'Скачать задание PDF';
    actions.appendChild(downloadBtn);

    var openBtn = document.createElement('a');
    openBtn.className = 'btn btn--secondary trial-detail__open';
    openBtn.href = encodedPdf;
    openBtn.target = '_blank';
    openBtn.rel = 'noopener';
    openBtn.textContent = 'Открыть PDF';
    actions.appendChild(openBtn);

    section.appendChild(actions);

    var audio = document.createElement('audio');
    audio.className = 'trial-detail__audio';
    audio.controls = true;
    audio.preload = 'metadata';
    audio.setAttribute('aria-label', 'Аудиоотрывок: ' + quiz.title);

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
