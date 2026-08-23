(function () {
  'use strict';

  function initTrialPage() {
    var playBtn = document.getElementById('play-audio');
    var audio = document.getElementById('trial-audio');

    if (playBtn && audio) {
      playBtn.addEventListener('click', function () {
        audio.play();
      });
    }

    var iframe = document.querySelector('.trial-detail__pdf[data-src]');
    if (!iframe || iframe.src) return;

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrialPage);
  } else {
    initTrialPage();
  }
})();
