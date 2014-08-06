/**
 * PUBLIC COLLECTION
 */

module.exports = function(app, options) {

  app.get('/collection', function(page, model, params, next) {
    var query = {
      domain: params.query.filter,
      $or: [
        {publish: 'Public'},
        {publish: 'Highlight'}
      ],
      $orderby: [{}]
    };
    query.$orderby[0][params.query.sort] = 1; // use the parameters for the order by
    // debug : console.log(query.$orderby);

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
    var collection = model.at('collection.'  + params.id);
    collection.subscribe(function(err) {
      if (err) return next(err);
      if (!collection.get()) return next();
      model.ref('_page.collection', collection);
      page.render('collectionView');
    });
  });

}
