/**
 * COLLECTION
 */

module.exports = function(app, options) {

  app.get('/p/collection', function(page, model, params, next) {
    var collectionQuery = model.query('collection', {});
    collectionQuery.subscribe(function(err) {
      if (err) return next(err);
      model.ref('_page.collection', collectionQuery)
      page.render('collectionList');
    });
  });

  app.get('/p/collection/:id', function(page, model, params, next) {
    model.set('_page.domain', [{content: 'Red'}, {content: 'Orange'}, {content: 'Purple'}]);
    model.set('_page.period', [{content: 'AD'}, {content: 'BC'}]);
    model.set('_page.acqMode', [{content: 'Achat'}, {content: 'Achat après commande'}, {content: 'Bourse'}, {content: 'Brocante'}, {content: 'Cadeau'}]);
    model.set('_page.publish', [{content: 'Private'},{content: 'Public'},{content: 'Highlight'}]);

    if (params.id === 'new') {
      return page.render('collectionEdit');
    }
    var collection = model.at('collection.' + params.id);
    collection.subscribe(function(err) {
      if (err) return next(err);
      if (!collection.get()) return next();
      model.ref('_page.collection', collection)

      page.render('collectionEdit');
    });
  });

  app.component('collectionList', CollectionListForm);
  function CollectionListForm() {}

  CollectionListForm.prototype.collectionNew = function () {
    app.history.push('/p/collection/new');
  }

  app.component('collectionEdit', CollectionEditForm);
  function CollectionEditForm() {}

  CollectionEditForm.prototype.done = function() {
    var model = this.model;
    /* TODO: validation
    if (!model.get('collection.firstname')) {
      var checkName = model.on('change', 'collection.firstname', function(value) {
        if (!value) return;
        model.del('nameError');
        model.removeListener('change', checkName);
      });
      model.set('nameError', true);
      this.firstname.focus();
      return;
    }
     */
    if (!model.get('collection.id')) {
      model.root.add('collection', model.get('_page.collection'));
    }
    app.history.push('/p/collection');
  }

  CollectionEditForm.prototype.collectionDelete = function() {
    this.model.silent().del('_page.collection');
    app.history.back();
  }

}
