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
    artist.subscribe(function(err) {
      if (err) return next(err);
      if (!artist.get()) return next();
      model.ref('_page.artist', artist);
      page.render('artistView');
    });
  });

}
