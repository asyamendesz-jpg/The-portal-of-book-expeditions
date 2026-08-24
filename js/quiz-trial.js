(function () {
  'use strict';

  var portal = window.ReadingPortal;

  function setText(el, value) {
    if (el && value) el.textContent = value;
  }

  function setLink(el, path, downloadName) {
    if (!el || !path) return;
    el.href = portal.encodeAssetPath(path);
    if (downloadName) el.download = downloadName;
  }

  function initTrialPage() {
    var root = document.querySelector('[data-trial-detail]');
    if (!root) return;

    var quizId = portal.getQueryParam('trial') || root.dataset.trialId || 'alice-cards';
    var quiz = portal.findQuiz(quizId);
    if (!quiz) return;

    document.title = 'Внеклассное чтение — ' + quiz.title;

    setText(document.getElementById('trial-section'), quiz.section);
    setText(document.getElementById('trial-title'), quiz.title);
    setText(document.getElementById('trial-instruction'), quiz.instruction);
    setText(document.getElementById('trial-hint'), quiz.hint || 'Прослушай отрывок, затем скачай задание и выполни его.');

    var pdfPath = quiz.pdf;
    var pdfFileName = pdfPath ? pdfPath.split('/').pop() : 'zadanie.pdf';

    setLink(document.getElementById('trial-download'), pdfPath, pdfFileName);
    setLink(document.getElementById('trial-open'), pdfPath);
    setLink(document.getElementById('trial-pdf-fallback'), pdfPath);

    var iframe = document.getElementById('trial-pdf-frame');
    if (iframe && pdfPath) {
      iframe.src = portal.encodeAssetPath(pdfPath);
      iframe.title = quiz.title + ' — PDF';
    }

    var audio = document.getElementById('trial-audio');
    if (audio && quiz.audio) {
      audio.innerHTML = '';
      var source = document.createElement('source');
      source.src = portal.encodeAssetPath(quiz.audio);
      source.type = 'audio/mpeg';
      audio.appendChild(source);
      audio.load();
      audio.setAttribute('aria-label', 'Аудиоотрывок: ' + quiz.title);
    }

    var playBtn = document.getElementById('play-excerpt');
    if (playBtn && audio) {
      playBtn.addEventListener('click', function () {
        audio.play();
      });
    }
  }

  portal.onReady(initTrialPage);
})();
