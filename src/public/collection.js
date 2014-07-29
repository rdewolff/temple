/**
 * PUBLIC COLLECTION
 */

module.exports = function(app, options) {

  app.get('/collection', function(page, model, params, next) {
    var collection = model.query('collection', {domain: model.get('_page.filterChoice'), $or: [{publish: 'Public'}, {publish: 'Highlight'}]});
    model.subscribe(collection, function(err) {
      if (err) return next(err);
      collection.ref('_page.collection');
      model.set('_page.filter', [{content: 'Red'}, {content: 'Orange'}, {content: 'Purple'}]);
      model.set('_page.order', [{content: ''}]);
      // model.filter()
      page.render('collectionList');
    });
  });

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
