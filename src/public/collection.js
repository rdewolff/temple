/**
 * PUBLIC COLLECTION
 */

module.exports = function(app, options) {
  /*
  app.on('model', function(model) {
    // TODO: this is not working with live binding : model.get('_page.filterChoice'); // "Red";
    model.fn('filter-red', function(item, key, obj) {
      return item.domain === 'Red';
    });
    model.fn('filter-orange', function(item, key, obj) {
      return item.domain === 'Orange';
    });
    model.fn('filter-purple', function(item, key, obj) {
      return item.domain === 'Purple';
    });
  });

  app.get('/collection/filter/:option', function(page, model, params, next) {
    model.subscribe('collection', function(err){
      if (err) return next(err);
      var filter = model.filter('collection', 'filter-'+params.option);
      filter.ref('_page.collection');
      model.set('_page.filter', [{content: 'Red'}, {content: 'Orange'}, {content: 'Purple'}]); // filter options
      page.render('collectionList');
    });
  });*/

  app.get('/collection', function(page, model, params, next) {
    var collection = model.query('collection', {
      domain: params.query.filter,
      $or: [
        {publish: 'Public'},
        {publish: 'Highlight'}
      ],
      $orderby: [
        {'yearFrom': 1} // FIXME: how to use `params.query.sort` in here ?? Cf. http://stackoverflow.com/questions/2738298/using-a-variable-as-identifier-in-a-json-array
      ]
    });
    model.subscribe(collection, function(err) {
      if (err) return next(err);

      collection.ref('_page.collection');
      model.set('_page.filter', [{content: 'Red'}, {content: 'Orange'}, {content: 'Purple'}]);
      model.set('_page.order', [{content: 'Title'}]);
      // model.filter()
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
    var collection = model.at('collection.'  + params.id);
    collection.subscribe(function(err) {
      if (err) return next(err);
      if (!collection.get()) return next();
      model.ref('_page.collection', collection);
      page.render('collectionView');
    });
  });

}
