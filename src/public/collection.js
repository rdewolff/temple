/**
 * PUBLIC COLLECTION
 */

module.exports = function(app, options) {

  app.get('/collection', function(page, model, params, next) {

    // filter
    var query = {
      // domain: params.query.filter,
      $or: [
        {publish: 'Public'},
        {publish: 'Highlight'}
      ],
      $orderby: [{}]
    };
    // add all query passed by parameter
    // FIXME: security disable other input
    for (key in params.query) {
      console.log(key+' -> '+params.query[key]);
      query[key] = params.query[key];
    }

    query.$orderby[0][params.query.sort] = 1; // use the parameters for the order by

    console.log(query);
    var collection = model.query('collection', query);

    model.subscribe(collection, function(err) {
      if (err) return next(err);

      collection.ref('_page.collection');

      // FIXME: stored in the database and editable in the admin area
      model.set('_page.filter', [{content: 'Red'}, {content: 'Orange'}, {content: 'Purple'}]);
      model.set('_page.order', [{content: 'Title'}]);

      page.render('collectionList');
    });
  });

  app.component('collectionList', CollectionListAction);
  function CollectionListAction() {}

  CollectionListAction.prototype.changeOrder = function () {
    console.log('meuh');
    app.history.push('/p/collection/new');
  }

  app.get('/collection/:id', function(page, model, params, next) {

    // current object
    var collection = model.at('collection.'  + params.id);
    // the related artist(s)
    var collectionArtist = model.query('collectionArtist', {collection_id: params.id});
    // subscribe to data
    model.subscribe(collection, collectionArtist, function(err) {
      if (err) return next(err);
      if (!collection.get()) return next();
      model.ref('_page.collection', collection);
      // get linked artist via reactive function
      model.start('_page.collectionArtistsIds', 'collectionArtist', 'getCollectionArtistLinkedArtistIds');
      var collectionArtistLinked = model.query('artist', '_page.collectionArtistsIds');
      model.subscribe(collectionArtistLinked, function(){
        model.ref('_page.collectionArtistObjects', collectionArtistLinked);
        page.render('collectionView');
      });
    });
  });

  // reactive function getting the ids of the related object and artist
  app.on('model', function onModel(model) {
    model.fn('getCollectionArtistLinkedArtistIds', function getCollectionArtistLinkedArtistIds(collectionArtist) {
      var ids = {};
      for (var key in collectionArtist) ids[collectionArtist[key].artist_id] = true;
      // Reactive model functions are *synchronous* so
      // you *absolutely* must `return` a value. Do this now.
      return Object.keys(ids);
    });
  });

}
