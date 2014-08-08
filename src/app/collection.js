/**
 * PRIVATE COLLECTION
 */

var fs = require('fs');

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

    // FIXME: use administrable data. Probably with component to factorize
    model.set('_page.domain', [{content: 'Red'}, {content: 'Orange'}, {content: 'Purple'}]);
    model.set('_page.period', [{content: 'AD'}, {content: 'BC'}]);
    model.set('_page.acqMode', [{content: 'Achat'}, {content: 'Achat après commande'}, {content: 'Bourse'}, {content: 'Brocante'}, {content: 'Cadeau'}]);
    model.set('_page.publish', [{content: 'Private'},{content: 'Public'},{content: 'Highlight'}]);

    if (params.id === 'new') {
      return page.render('collectionEdit');
    }
    var collection = model.at('collection.' + params.id);
    var artist = model.query('artist', {});
    model.subscribe(collection, artist, function(err) {
      if (err) return next(err);
      if (!collection.get()) return next();
      model.ref('_page.collection', collection);
      model.ref('_page.artist', artist);
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

  // init() is called first, on both the server and the client
  CollectionEditForm.prototype.init = function(model,app) {
    // file upload
    model.setNull("_page.pending", []);
    model.setNull("_page.response", []);

    // TODO: keep in mind this works as a "reactive function"
    /*
    model.start('_page.collection.file', '_page.response', function(item) {
      return model.get('_page.response');
    }); */

  }

  // Add object - artist linked via modal
  CollectionEditForm.prototype.addArtist = function (artist) {
    console.log('add artist', artist);
    this.model.at('_page.collection.artists').push(artist);
  };

  CollectionEditForm.prototype.removeArtist = function () {
    console.log(this.artistsList.selectedIndex);
    // remove element from array at selected position
    if (this.artistsList.selectedIndex > -1)
      this.model.at('_page.collection.artists').remove(this.artistsList.selectedIndex);
    else
      alert('Please select the artist you want to remove from the list.');
  };

  CollectionEditForm.prototype.hideModal = function(action, cancel) {
    // if done button was pushed, add the selection to the OBJ-ART link
    if (action === "Done") {
      // save artist
      // TODO : trying to add the artist that is currently selected in the select in the modal
      console.log(this.artistsFullList.selectedIndex);
      console.log(this.model.at('_page.artist'));
      // this.model.at('_page.collection.artists').push(artist);

    }
  };

  // created() is called second, only on the client. You can add stuff like jQuery here.
  CollectionEditForm.prototype.create = function(model) {

  }

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

  CollectionEditForm.prototype.stringify = function(str) {
    return JSON.stringify(str, null, 2);
  }

  CollectionEditForm.prototype.collectionDelete = function() {
    this.model.silent().del('_page.collection');
    app.history.back();
  }

  CollectionEditForm.prototype.deleteFile = function(file, index) {
    var model = this.model;
    console.log('delete file', file);
    console.log('index', index);
    // delete file form filesystem
    // FIXME: use a global path for the project
    var filePath = '/public/files/'+ file.fileName;
    console.log('filePath', filePath);

    // TODO: delete image from the server / this needs to be done server side
    /*
    fs.unlink(filePath, function (err) {
      if (err) throw err;
      console.log('successfully deleted '+filePath);
    });*/

    // remove file from file list of the current object
    //console.log(model.get('_page.collection.file'));
    var files = model.at('_page.collection.file');
    console.log(files);
    files.remove(index);
    console.log(files);

    // remove file form the database
    // TODO: delete file form model, not working yet
    //model.del('file.'+file.id);
  }


}
