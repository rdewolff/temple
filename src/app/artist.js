/**
 * ARTIST
 */

module.exports = function(app, options) {

  app.get('/p/artist', function(page, model, params, next) {
    var artistQuery = model.query('artist', {});
    artistQuery.subscribe(function(err) {
      if (err) return next(err);
      model.ref('_page.artist', artistQuery)
      page.render('artistList');
    });
  });

  // TODO: cleanup
  // view helper to highlight correct menu even on sub page path (artist should be highlighted on /artist/ and on /artist/meuh)
  //view.fn('test', function(value) {
  //  return "meuh";
  //});

  app.get('/p/artist/:id', function(page, model, params, next) {
    model.set('_page.domain', [
      {content: 'Red'},
      {content: 'Orange'},
      {content: 'Purple'}
    ]);
    if (params.id === 'new') {
      return page.render('artistEdit');
    }
    var artist = model.at('artist.' + params.id);
    artist.subscribe(function(err) {
      if (err) return next(err);
      if (!artist.get()) return next();
      model.ref('_page.artist', artist)
      page.render('artistEdit');
    });
  });

  app.component('artistList', ArtistListForm);
  function ArtistListForm() {}

  ArtistListForm.prototype.artistNew = function () {
    app.history.push('/p/artist/new');
  }

  app.component('artistEdit', ArtistEditForm);
  function ArtistEditForm() {}

  ArtistEditForm.prototype.done = function() {
    var model = this.model;
    /* TODO: validation
    if (!model.get('artist.firstname')) {
      var checkName = model.on('change', 'artist.firstname', function(value) {
        if (!value) return;
        model.del('nameError');
        model.removeListener('change', checkName);
      });
      model.set('nameError', true);
      this.firstname.focus();
      return;
    }
     */
    if (!model.get('artist.id')) {
      model.root.add('artist', model.get('_page.artist'));
    }
    app.history.push('/p/artist');
  }

  ArtistEditForm.prototype.artistDelete = function() {
    this.model.silent().del('_page.artist');
    app.history.back();
  }

}
