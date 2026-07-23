(function (global) {
  'use strict';

  var portal = global.ReadingPortal = global.ReadingPortal || {};

  portal.getBookTitle = function (bookId) {
    var books = portal.books;
    if (!books) return '';

    for (var i = 0; i < books.length; i++) {
      if (books[i].id === bookId) {
        return books[i].title;
      }
    }

    return '';
  };

  portal.getBookById = function (bookId) {
    var books = portal.books;
    if (!books) return null;

    for (var i = 0; i < books.length; i++) {
      if (books[i].id === bookId) {
        return books[i];
      }
    }

    return null;
  };

  portal.onReady = function (fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  };

  portal.createEmpty = function (className, text) {
    var el = document.createElement('p');
    el.className = className;
    el.textContent = text;
    return el;
  };

  portal.getQueryParam = function (name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  };
})(window);
