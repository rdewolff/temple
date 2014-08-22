/**
 * PUBLIC COLLECTION
 */

module.exports = function(app, options) {

  app.component(require('d-comp-palette/pager/pager'));

  app.get('/collection', function(page, model, params, next) {

    var limitPerPage = 5;

    // count the number of object for pagination
    var collectionCount = model.query('collection', {
      $count: true,
      $query: {
        $or: [
          {publish: "Public"},
          {publish: "Highlight"}
        ]
      }
    });

    // filter
    var query = {
      $or: [
        {publish: 'Public'},
        {publish: 'Highlight'}
      ],
      $orderby: [{}],
      $limit: limitPerPage
    };
    // add all query passed by parameter
    // FIXME: security disable other input
    for (key in params.query) {
      // debug console.log(key+' -> '+params.query[key]);
      // don't include the sort option here
      if (key != 'sort')
        query[key] = params.query[key];
    }

    query.$orderby[0][params.query.sort] = 1; // use the parameters for the order by

    //debug 
    console.log(query);

    var collection = model.query('collection', query);

    model.subscribe(collection, collectionCount, function(err) {
      if (err) return next(err);

      collection.ref('_page.collection');

      // pagination
      console.dir(collectionCount.get());
      collectionCount.refExtra('_page.pagination.collectionCount');
      model.set('_page.pagination.pageSize', limitPerPage);
      model.set('_page.pagination.buttonsCount', 5);

      // FIXME: stored in the database and editable in the admin area
      model.set('_page.filter', [{content: 'Red'}, {content: 'Orange'}, {content: 'Purple'}]);
      model.set('_page.order', [{content: 'Title'}]);

      page.render('collectionList');
    });
  });

  app.component('collectionList', CollectionListAction);
  function CollectionListAction() {}

  CollectionListAction.prototype.changeOrder = function () {
    console.log('changeOrder (TODO: remove?) is called');
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

  // pages
  CollectionListAction.prototype.pageChanged = function (pageNumber) {
    var model = this.model;

    var collectionObjectToSkip = (pageNumber-1) * model.get('_page.pagination.pageSize');

    console.log('page changed');
    var collectionQuery = model.query('collection', {
      $or: [
        {publish: 'Public'},
        {publish: 'Highlight'}
      ],
      $orderby: [{}],
      $limit: model.get('_page.pagination.pageSize'),
      $skip: collectionObjectToSkip
    });
    console.log(model.get('_page.currentPage'));
    model.subscribe(collectionQuery, function(err, next) {
      model.del('_page.collection');
      model.set('_page.collection', collectionQuery.get());
    });

    /*var items = [];
    for (var i = (pageNumber - 1) * 10; i < (pageNumber - 1) * 10 + 10; i++) {
        var obj = {id: i, text: 'Item #' + i};
        items.push(obj);
    }
    app.model.set('_page.pagerDemoData', items); */
};

}
