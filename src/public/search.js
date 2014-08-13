/**
 * PUBLIC COLLECTION
 */

// racer = require('racer');

module.exports = function(app, options) {

  app.get('/search', function(page, model, params, next) {

    // subscribe to the artist sent back via XHR
    page.render('search');
  });

  app.component('search', SearchForm);

  function SearchForm() {}

  // client side only
  SearchForm.prototype.create = function(model) {

    // get all the artist to populate our choosable list
    xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/v1/artist', true);
    xhr.onload = function() {
      // debug
      // console.log(this.responseText);
      model.root.set('_page.artistAll', JSON.parse(this.responseText));
    }
    xhr.send();
  }

  SearchForm.prototype.searchClear = function() {
    // simply refresh page
    this.app.history.refresh();
  }

}
