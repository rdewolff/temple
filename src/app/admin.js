/**
 * ADMIN
 */

module.exports = function(app, options) {

  /**
   * General
   */
  app.component('adminShared', AdminSharedForm);
  function AdminSharedForm() {}

  AdminSharedForm.prototype.create = function() {

  }

  /**
   * PROPERTIES
   */
  app.get('/p/admin/properties', function(page, model, params, next) {
    var adminProperties = model.query('adminProperties', {});
    model.subscribe(adminProperties, function(err, next) {
      // if no data, add an example
      if (!adminProperties.get().length) {
        model.add('adminProperties', {name: 'CustomerName', value: 'zetcom'});
        model.add('adminProperties', {name: 'URL', value: 'http://'});
      }
      model.ref('_page.adminProperties', adminProperties);
      page.render('adminProperties');
    });
  });

  app.component('adminProperties', AdminPropertiesForm);
  function AdminPropertiesForm() {}

  AdminPropertiesForm.prototype.propertiesAdd = function () {
    var newProperties = {
      name: this.model.get('_page.adminPropertiesNewName'),
      value: this.model.get('_page.adminPropertiesNewValue')
    }
    this.model.root.add('adminProperties', newProperties);
    // FIXME: this should be required - auto refreshes normally
    //this.app.history.refresh();
  }

  AdminPropertiesForm.prototype.propertiesDelete = function (id) {
    this.model.root.del('adminProperties.'+id);
    // FIXME: this should be required - auto refreshes normally
    // this.app.history.refresh();
  }

  AdminPropertiesForm.prototype.propertiesDuplicate = function (id) {
    var duplicatedProperties = {
      name: this.model.root.get('adminProperties.'+id).name,
      value: this.model.root.get('adminProperties.'+id).value
    }
    this.model.root.add('adminProperties', duplicatedProperties);
    // FIXME: this should be required - auto refreshes normally
    // this.app.history.refresh();
  }

  /**
   * FIELDS
   */
  app.get('/p/admin/fields', function(page, model, params, next){

    var adminFields = model.query('adminFields', {});
    // FIXME: checkAdminFieldsAndAddRequired(model);
    var optionLanguage = model.query('adminProperties', {name: 'Languages'});
    model.subscribe(adminFields, optionLanguage, function(err, next) {
      // if no data, add an example
      if (!adminFields.get().length) {
        model.add('adminFields', {
          database: 'database', // FIXME: wrong fields name now ^^
          table: 'table',
          field: 'field',
          label: 'label',
          function: 'function',
          comment: 'comment'
        });
      }
      // transform optional languages
      // debug : console.log('optionLanguage.get()', optionLanguage.get()[0].value);
      var lang = optionLanguage.get()[0].value.split(',');
      var optionLang = [];
      for (var i = 0; i < lang.length; i++) {
        optionLang.push({content: lang[i]});
      }
      model.set('_page.optionsLanguages', optionLang);
      model.ref('_page.adminFields', adminFields);
      page.render('adminFields');
    });

  });

  app.component('adminFields', AdminFieldsForm);
  function AdminFieldsForm() {}

  AdminFieldsForm.prototype.fieldsAdd = function () {
    this.model.root.add('adminFields', this.model.del('_page.adminFieldNew'));
  }

  AdminFieldsForm.prototype.fieldsDelete = function (id) {
    this.model.root.del('adminFields.'+id);
  }

  AdminFieldsForm.prototype.fieldsDuplicate = function (id) {
    var duplicateField = this.model.root.get('adminFields.'+id);
    duplicateField['id'] = this.model.id(); // new id
    delete duplicateField['__proto__']; // clean
    this.model.root.add('adminFields', duplicateField);
  }

  /**
   * LABELS
   */
  app.get('/p/admin/labels', function(page, model, params, next){

    var adminLabels = model.query('adminLabels', {});
    var optionLanguage = model.query('adminProperties', {name: 'Languages'});
    model.subscribe(adminLabels, optionLanguage, function(err, next) {
      // if no data, add an example
      if (!adminLabels.get().length) {
        /*model.add('adminLabels', {
          test: 'empty'
        });*/
      }
      // transform optional languages
      // debug : console.log('optionLanguage.get()', optionLanguage.get()[0].value);
      var lang = optionLanguage.get()[0].value.split(',');
      var optionLang = [];
      for (var i = 0; i < lang.length; i++) {
        optionLang.push({content: lang[i]});
      }
      model.set('_page.optionsLanguages', optionLang);
      model.ref('_page.adminLabels', adminLabels);
      page.render('adminLabels');
    });

  });

  app.component('adminLabels', AdminLabelsForm);
  function AdminLabelsForm() {}

  // client side only
  AdminLabelsForm.prototype.create = function(model) {
    getXhrUrlToModel('/api/v1/admin/fields', '_page.adminFieldsName', model)
    getXhrUrlToModel('/api/v1/admin/views', '_page.adminViewsName', model)
  }

  AdminLabelsForm.prototype.labelsAdd = function () {
    this.model.root.add('adminLabels', this.model.del('_page.adminLabelNew'));
  }

  AdminLabelsForm.prototype.labelsDelete = function (id) {
    this.model.root.del('adminLabels.'+id);
  }

  AdminLabelsForm.prototype.labelsDuplicate = function (id) {
    var duplicateLabel = this.model.root.get('adminLabels.'+id);
    duplicateLabel['id'] = this.model.id(); // new id
    delete duplicateLabel['__proto__']; // clean
    this.model.root.add('adminLabels', duplicateLabel);
  }

  /**
   * VIEWS
   */
  app.get('/p/admin/views', function(page, model, params, next){

    var adminViews = model.query('adminViews', {});
    model.subscribe(adminViews, function(err, next) {
      // if no data, add an example
      if (!adminViews.get().length) {
        model.add('adminViews', {
          name: 'name',
          data: 'data',
          viewType: 'view type',
          location: 'location',
          comment: 'comment'
        });
      }
      model.ref('_page.adminViews', adminViews);
      page.render('adminViews');
    });

  });

  app.component('adminViews', adminViewsForm);
  function adminViewsForm() {}

  adminViewsForm.prototype.viewsAdd = function () {
    this.model.root.add('adminViews', this.model.del('_page.adminViewNew'));
  }

  adminViewsForm.prototype.viewsDelete = function (id) {
    this.model.root.del('adminViews.'+id);
  }

  adminViewsForm.prototype.viewsDuplicate = function (id) {
    var duplicateView = this.model.root.get('adminViews.'+id);
    duplicateView['id'] = this.model.id(); // new id
    delete duplicateView['__proto__']; // clean
    this.model.root.add('adminViews', duplicateView);
  }


  function getXhrUrlToModel(XhrUrl, modelPathToSet, model) {
    xhr = new XMLHttpRequest();
    xhr.open('GET', XhrUrl, true);
    xhr.onload = function() {
      // debug
      // FIXME: change the key name from '_id' to 'content' so it can be used directly in the view
      // by the d-bootstrap/dropdown component
      var viewList = [];
      var responseJson = JSON.parse(this.responseText);
      for (var key in responseJson) {
        viewList.push({content: responseJson[key]._id});
      }
      // component
      model.root.set(modelPathToSet, viewList); // JSON.parse(this.responseText));
    }
    xhr.send();
  }

  /**
   * Sync
   */
  app.get('/p/admin/sync', function(page, model, params, next){
    page.render('adminSync');
  });
  app.component('adminSync', adminSyncForm);

  function adminSyncForm() {}

  adminSyncForm.prototype.sync = function() {
    getXhrUrlToModel('/api/v1/admin/sync', '_page.sync', this.model);
  }

  /*
  FIXME: create function that is flexible and add all the required parameters to the
  app database if required. It could be checked on app launch.

  function checkAdminFieldsAndAddRequired (model) {
    console.log('checkAdminFieldsAndAddRequired');

    // list of colleciton and fields that should exist in there
    // each field has a default value that will be set if missing
    var requiredFields = {
      'adminProperties' : {
        'Languages' : 'EN'
      },
      'adminFields' : {
        'lapin' : 'blanc'
      }
    };

    var models = [];
    var queries = {};
    var queriesTxt;
    for (key in requiredFields) {
      console.log(key);
      queriesTxt = "{"; // reset
      for (field in requiredFields[key]) {
        queriesTxt += '"name": "' + field + '"';
        // queries.add({name: field});
      }
      queriesTxt += '}';
      // debug console.log('queries', queriesTxt);
      queries = JSON.parse(queriesTxt);
      // debug
      console.log('queries', queries);
      models[key] = model.query(key, queries);
      models[key].subscribe(function() {
        console.log('models['+key+'].get()', models[key].get());
      });
    }


    // model.query()
  }
  */

}
