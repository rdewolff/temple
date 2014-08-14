/**
 * PRIVATE COLLECTION
 */

var fs = require('fs');

module.exports = function(app, options) {

  /**
   * Collection list
   */
  app.get('/p/collection', function(page, model, params, next) {
    var collectionQuery = model.query('collection', {});
    collectionQuery.subscribe(function(err) {
      if (err) return next(err);
      model.ref('_page.collection', collectionQuery)
      page.render('collectionList');
    });
  });

  /**
   * Collection create and edit
   */
  app.get('/p/collection/:id', function(page, model, params, next) {

    // FIXME: use administrable data. Probably with component to factorize
    model.set('_page.domain', [{content: 'Red'}, {content: 'Orange'}, {content: 'Purple'}]);
    model.set('_page.period', [{content: 'AD'}, {content: 'BC'}]);
    model.set('_page.acqMode', [{content: 'Achat'}, {content: 'Achat après commande'}, {content: 'Bourse'}, {content: 'Brocante'}, {content: 'Cadeau'}]);
    model.set('_page.publish', [{content: 'Private'},{content: 'Public'},{content: 'Highlight'}]);

    if (params.id === 'new') {
      return page.render('collectionEdit');
    }

    // Query all the required data
    var collection = model.at('collection.' + params.id);
    var artist = model.query('artist', {});
    // selected artist related to current collection
    var collectionArtist = model.query('collectionArtist', {collection_id: params.id});

    // Retrieve all the required data
    model.subscribe(collection, artist, collectionArtist, function(err) {
      if (err) return next(err);
      if (!collection.get()) return next();
      model.ref('_page.collection', collection);
      model.ref('_page.artist', artist);
      model.ref('_page.collectionArtist', collectionArtist);

      var collectionArtistSelected = collectionArtist.get();
      var collectionArtistIdSelected = [];
      model.setNull('_page.collectionArtistSelected', []);

      // get the linked artist object
      for (var i = 0; i < collectionArtistSelected.length; i++) {
        // debug : console.log(i, collectionArtistSelected[i]);
        collectionArtistIdSelected.push(collectionArtistSelected[i].artist_id);
        // bad way : model.at('_page.collectionArtistSelected').push(model.at('artist.'+collectionArtistSelected[i].artist_id).get());
        // better :
        model.at('_page.collectionArtistSelected').push(model.get('artist.'+collectionArtistSelected[i].artist_id));
      }

      // debug console.log('result', collectionArtistIdSelected);
      // TODO: refList usable here? Cannot make it working
      // model.refList('_page.collectionArtistSelected', 'artist', collectionArtistIdSelected);

      // get the artist linked for the view to display

      page.render('collectionEdit');
    });
  });

  app.component('collectionList', CollectionListForm);
  function CollectionListForm() {}

  // FIXME: remove if unused?
  CollectionListForm.prototype.collectionNew = function () {
    app.history.push('/p/collection/new');
  }

  app.component('collectionEdit', CollectionEditForm);
  function CollectionEditForm() {}

  // created() is called second, only on the client. You can add stuff like jQuery here.
  CollectionEditForm.prototype.create = function(model) {

  }

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
    var model = this.model;
    // FIXME: remove old way to do this was to store the artist directly in the collection collection
    // this.model.at('_page.collection.artists').push(artist);
    // store the link in the collectionArtist collection
    model.add('_page.collectionArtist', {
      collection_id: model.get('_page.collection.id'),
      artist_id    : artist.id
    });
    // update the view
    model.at('_page.collectionArtistSelected').push(artist);
  };

  CollectionEditForm.prototype.showArtist = function(e, el) {
    // debug :
    // console.log('e', e);
    // console.log('el', el);
    alert(this.artistsList.value);
    app.history.push('/p/artist/'+this.artistsList.value)
  }

  // Delete the link between the current object and the selected artist
  CollectionEditForm.prototype.removeArtist = function () {

    var model = this.model;
    var selectedIndex = this.artistsList.selectedIndex;

    // remove element from array at selected position
    if (selectedIndex > -1) {
      // remove if data stored directly in collection model (old way)
      // model.at('_page.collection.artists').remove(this.artistsList.selectedIndex);
      // debug
      //console.log(this.artistsList.selectedIndex);
      //console.log(this.artistsList.value); // id

      var collectionArtist = model.query('collectionArtist', {
        collection_id: model.get('_page.collection.id'),
        artist_id    : this.artistsList.value
      });

      // there should be only 1 artist linked. but we use forEach for proper handling
      collectionArtist.fetch(function(err) {
        collectionArtist.get().forEach(function(entry){
          // Update model without emitting events so that the page doesn't update
          model.root.silent().del('collectionArtist.'+entry.id);
          // Update the view <select>
          model.at('_page.collectionArtistSelected').remove(selectedIndex);
        });
      })
    } else {
      alert('Please select the artist you want to remove from the list.');
    }
  };

  // Can add an artist via modal
  CollectionEditForm.prototype.hideModal = function(action, cancel) {
    var model = this.model;
    // if done button was pushed, add the selection to the OBJ-ART link
    if (action === "Done") {
      // save artist
      // TODO : trying to add the artist that is currently selected in the select in the modal
      console.log(this.artistsFullList.selectedIndex);
      console.log(this.artistsFullList.value);
      console.log(model.at('_page.artist'));
      // model.at('_page.collectionArtistSelected').push(model.at('artist.'+this.artistsFullList.value).get());
    }
  };

  CollectionEditForm.prototype.hideModalCollectionDimension = function(action, cancel) {
    var model = this.model;
    // TODO: dimension bug, sometimes the whole name get passed and not the actual select option value
    // console.log('unit', this.dimensionUnit.value);
    // if done button was pushed
    if (action === "Done") {
      var dimension = {
        width: this.dimensionWidth.value,
        height: this.dimensionHeight.value,
        depth: this.dimensionDepth.value,
        unit: this.dimensionUnit.value
      }
      // check if we are adding a new dimension or editing an existing one
      if (model.get('_page.collection.dimensionEdit.selectedIndex') > -1) {
        // edit dimension
        model.set('_page.collection.dimension.'+model.get('_page.collection.dimensionEdit.selectedIndex'), dimension)
      } else {
        // save dimension
        model.at('_page.collection.dimension').push(dimension);
      }
    }
    // in all cases, reset the editable dimension
    model.del('_page.collection.dimensionEdit');
  };

  CollectionEditForm.prototype.CollectionEditDimension = function() {
    var model = this.model;
    if (this.dimension.selectedIndex > -1) {
      // prepare the data to be edited
      model.set('_page.collection.dimensionEdit', model.at('_page.collection.dimension').get(this.dimension.selectedIndex));
      model.set('_page.collection.dimensionEdit.selectedIndex', this.dimension.selectedIndex);
      // show the modal window
      this.modalCollectionDimension.show();
    } else {
      alert('Please select the dimension you want to edit');
    }


  }

  CollectionEditForm.prototype.CollectionRemoveDimension = function() {
    if (this.dimension.selectedIndex > -1) {
      this.model.at('_page.collection.dimension').remove(this.dimension.selectedIndex);
      this.dimension.selectedIndex = 0;
    } else {
      alert('Please select the dimension you want to remove');
    }
  };

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

    // send the object to Portal
    var data = new FormData();
    data.append('title', 'test');
    data.append('text', 'Romain');

    xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3001/api/v1/add');
    xhr.onload = function() {
      // debug
      console.log(Date() + ' ' + this.responseText);
    };
    xhr.send({data: 'Romain'});


    if (!model.get('collection.id')) {
      model.root.add('collection', model.get('_page.collection'));
    }
    app.history.push('/p/collection');
  }

  // to display file upload progress
  CollectionEditForm.prototype.stringify = function(str) {
    return JSON.stringify(str, null, 2);
  }

  CollectionEditForm.prototype.collectionDelete = function() {
    this.model.silent().del('_page.collection');
    app.history.back();
  }

  CollectionEditForm.prototype.deleteFile = function(file, index) {
    var model = this.model;
    // Debug
    // console.log('delete file', file);
    // console.log('index', index);
    // delete file form filesystem
    // FIXME: use a global path for the project
    var filePath = '/public/files/'+ file.fileName;
    // debug console.log('filePath', filePath);

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
