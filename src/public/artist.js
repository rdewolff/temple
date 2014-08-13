/**
 * PUBLIC ARTIST
 */

module.exports = function(app, options) {

  app.on('model', function(model){
    model.fn('filterArtist')
  });

  app.get('/artist', function(page, model, params, next) {

    var query = {}
    if (params.query.filter) {
        query = {
          lastname: {$regex: '^'+params.query.filter, $options: 'i'} // last name start with selected letter
        };
    }

    var artist = model.query('artist', query);
    model.subscribe(artist, function(err) {
      if (err) return next(err);
      artist.ref('_page.artist');
      var alphabet = "abcdefghijklmnopqrstuvwxyz".split(""); // create an alphabetical array for the filter
      model.set('_page.alphabet', alphabet);
      page.render('artistList');
    });
  });

  app.get('/artist/:id', function(page, model, params, next) {
    var artist = model.at('artist.'  + params.id);
    var collectionArtist = model.query('collectionArtist', {artist_id: params.id});

    model.subscribe(artist, collectionArtist, function(err) {
      if (err) return next(err);
      if (!artist.get()) return next();
      model.ref('_page.artist', artist);
      // TODO: check if we need to ref the collectionArtist query here for the reactive function to work
      model.start('_page.collectionArtistsIds2', 'collectionArtist', 'getCollectionArtistLinkedCollectionIds');
      // get the linked object for the current artist
      var collectionArtistLinked = model.query('collection', '_page.collectionArtistsIds2');
      model.subscribe(collectionArtistLinked, function(err, next) {
        if (err) return next();
        model.ref('_page.collectionArtistObjects', collectionArtistLinked);
        page.render('artistView');
      });
    });
  });

  // reactive function getting the ids of the related object and artist
  app.on('model', function onModel(model) {
    model.fn('getCollectionArtistLinkedCollectionIds', function getCollectionArtistLinkedCollectionIds(collectionArtist) {
      var ids = {};
      for (var key in collectionArtist) ids[collectionArtist[key].collection_id] = true;
      // Reactive model functions are *synchronous* so
      // you *absolutely* must `return` a value. Do this now.
      return Object.keys(ids);
    });
  });

}
