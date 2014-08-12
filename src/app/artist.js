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

  app.get('/p/artist/:id', function(page, model, params, next) {
    model.set('_page.domain', [{content: 'Red'}, {content: 'Orange'}, {content: 'Purple'}]);
    model.set('_page.gender', [{content: 'Male'}, {content: 'Female'}]);

    if (params.id === 'new') {
      return page.render('artistEdit');
    }
    var artist = model.at('artist.' + params.id);
    var collectionArtist = model.query('collectionArtist', {artist_id: params.id});

    model.subscribe(artist, collectionArtist, function(err, next) {
      if (err) return next(err);
      if (!artist.get()) return next();
      model.ref('_page.artist', artist);
      model.ref('_page.collectionArtist', collectionArtist);

      model.start('_page.collectionArtistsIds', 'collectionArtist', 'getCollectionArtistLinkedIds');

      var collectionArtistLinked = model.query('collection', '_page.collectionArtistsIds');
      model.subscribe(collectionArtistLinked, function(err, next) {
        if (err) return next(err);
        model.ref('_page.collectionArtistObjects', collectionArtistLinked);
        page.render('artistEdit');
      })

    });
  });

  // reactive function getting the ids of the related object and artist
  app.on('model', function onModel(model) {
    model.fn('getCollectionArtistLinkedIds', function getCollectionArtistLinkedIds(collectionArtist) {
      var ids = {};
      for (var key in collectionArtist) ids[collectionArtist[key].collection_id] = true;
      // Reactive model functions are *synchronous* so
      // you *absolutely* must `return` a value. Do this now.
      return Object.keys(ids);
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
