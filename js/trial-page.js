(function () {
  'use strict';

  var portal = window.ReadingPortal;

  function getTrialStepId() {
    var path = window.location.pathname.split('/').pop() || '';
    if (path.indexOf('trial-tasks') !== -1) return 'tasks';
    if (path.indexOf('trial-cards') !== -1) return 'episode';
    return null;
  }

  function initTrialPage() {
    var playBtn = document.getElementById('play-audio');
    var audio = document.getElementById('trial-audio');
    var stepId = getTrialStepId();
    var chrome = portal.mountJourneyChrome
      ? portal.mountJourneyChrome({ currentStepId: stepId })
      : { next: null };
    var nextHost = chrome.next;

    if (playBtn && audio) {
      playBtn.addEventListener('click', function () {
        audio.play();
      });
    }

    function showDone() {
      if (!stepId || !portal.completeStepAndShowNext) return;
      portal.completeStepAndShowNext(stepId, nextHost);
    }

    if (audio) {
      audio.addEventListener('ended', showDone);
    }

    var actions = document.querySelector('.trial-detail__actions');
    if (actions && stepId) {
      var doneBtn = document.createElement('button');
      doneBtn.type = 'button';
      doneBtn.className = 'btn btn--primary';
      doneBtn.textContent = stepId === 'episode' ? 'Я прослушал(а) →' : 'Я выполнил(а) задания →';
      doneBtn.addEventListener('click', showDone);
      actions.appendChild(doneBtn);
    }

    var iframe = document.querySelector('.trial-detail__pdf[data-src]');
    if (iframe && !iframe.src) {
      function loadPdf() {
        if (iframe.src) return;
        iframe.src = iframe.getAttribute('data-src');
      }

      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              loadPdf();
              observer.disconnect();
            }
          });
        }, { rootMargin: '200px' });
        observer.observe(iframe);
      } else {
        window.addEventListener('load', loadPdf);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrialPage);
  } else {
    initTrialPage();
  }
})();
