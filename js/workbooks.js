(function () {
  'use strict';

  var portal = window.ReadingPortal;

  function createKitCard(kit) {
    var card = document.createElement('article');
    card.className = 'kit-card card';

    var label = document.createElement('span');
    label.className = 'kit-card__label';
    label.textContent = 'PDF';

    var title = document.createElement('h3');
    title.className = 'kit-card__title';
    title.textContent = kit.title;

    var description = document.createElement('p');
    description.className = 'kit-card__description';
    description.textContent = kit.description;

    card.appendChild(label);
    card.appendChild(title);
    card.appendChild(description);

    var bookTitle = portal.getBookTitle(kit.bookId);
    if (bookTitle) {
      var book = document.createElement('p');
      book.className = 'kit-card__book';
      book.textContent = 'Книга: «' + bookTitle + '»';
      card.appendChild(book);
    }

    var actions = document.createElement('div');
    actions.className = 'kit-card__actions';

    var filePath = portal.encodeAssetPath(kit.file);
    var fileName = kit.file.split('/').pop() || 'komplekt.pdf';

    var openLink = document.createElement('a');
    openLink.className = 'btn btn--secondary kit-card__link';
    openLink.href = filePath;
    openLink.target = '_blank';
    openLink.rel = 'noopener';
    openLink.textContent = 'Открыть PDF';

    var downloadLink = document.createElement('a');
    downloadLink.className = 'btn btn--primary kit-card__link kit-card__link--download';
    downloadLink.href = filePath;
    downloadLink.download = fileName;
    downloadLink.textContent = 'Скачать комплект';

    actions.appendChild(openLink);
    actions.appendChild(downloadLink);

    if (kit.trialPage) {
      var trialLink = document.createElement('a');
      trialLink.className = 'btn btn--secondary kit-card__link kit-card__link--trial';
      trialLink.href = kit.trialPage;
      trialLink.textContent = 'Перейти к испытанию';
      actions.appendChild(trialLink);
    }

    card.appendChild(actions);

    return card;
  }

  function renderKits(container) {
    var workbooks = portal.workbooks;
    container.innerHTML = '';

    if (!workbooks || !workbooks.length) {
      container.appendChild(portal.createEmpty('kit-list__empty', 'Комплекты скоро появятся в архиве.'));
      return;
    }

    var list = document.createElement('ul');
    list.className = 'kit-list';

    workbooks.forEach(function (kit) {
      var item = document.createElement('li');
      item.className = 'kit-list__item';
      item.appendChild(createKitCard(kit));
      list.appendChild(item);
    });

    container.appendChild(list);
  }

  portal.onReady(function () {
    var container = document.querySelector('[data-kit-list]');
    if (container) renderKits(container);
  });
})();
