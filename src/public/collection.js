/**
 * PUBLIC COLLECTION
 */

module.exports = function(app, options) {

  app.get('/collection', function(page, model, params, next) {

    var collection = model.query('collection', {$or: [{publish: 'Public'}, {publish: 'Highlight'}]});

    model.subscribe(collection, function(err) {

      if (err) return next(err);

      collection.ref('_page.collection')

      page.render('collectionList');

    });

  });


  app.get('/collection/:id', function(page, model, params, next) {

    var collection2 = model.at('collection.'  + params.id);
    console.log('1 ' + params.id)
    collection2.fetch(function(err) {
      console.log('2');
      if (err) return next(err);
      console.log('3');
      if (!collection2.get()) return next();
      console.log('4');
      model.ref('_page.collection', collection2)
      console.log('5');
      page.render('collectionView');
      console.log('6');
    });
  });
/*
  app.get('/collection/:id', function(page, model, params, next) {

    var collection = model.at('collection.' + params.id);

    model.subscribe(collection, function(err) {

      if (err) return next(err);
      // if (!collection.get()) return next();
      collection.ref('_page.collection');

      page.render('collectionView');

    });

  });
*/
}
