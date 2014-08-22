/**
 * ADMIN
 */

module.exports = function(app, options) {

  /**
   * PROPERTIES
   */
  app.get('/p/admin/properties', function(page, model, params, next) {
    var adminProperties = model.query('adminProperties', {});
    model.subscribe(adminProperties, function(err, next) {
      // if no data, add an example
      if (!adminProperties.get().length) {
        model.add('adminProperties', {name: 'CustomerName', value: 'zetcom'});
        model.add('adminProperties', {name: 'Languages', value: 'EN, FR, DE'});
        model.add('adminProperties', {name: 'DatabaseSourceConnectionString', value: '192.168.0.3'});
        model.add('adminProperties', {name: 'DatabaseSourceUsername', value: ''});
        model.add('adminProperties', {name: 'DatabaseSourcePassword', value: ''});
      }
      model.ref('_page.adminProperties', adminProperties);
      page.render('adminProperties');
    });
  });

  app.component('adminProperties', AdminPropertiesForm);
  function AdminPropertiesForm() {}

  AdminPropertiesForm.prototype.propertiesAdd = function () {
    console.log(this.propertieNewName);
    console.log('add');
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
    model.subscribe(adminFields, function(err, next) {
      // if no data, add an example
      if (!adminFields.get().length) {
        model.add('adminFields', {
          database: 'database',
          table: 'table',
          field: 'field',
          label: 'label',
          function: 'function',
          comment: 'comment'
        });
      }
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

  app.component(require('d-comp-palette/form/t-select/select'));

  /**
   * FIELDS - VIEWS
   */
  app.get('/p/admin/fieldsViews', function(page, model, params, next){

    var fieldsViews = model.query('adminFieldsViews', {});
    // get all the view names

    model.subscribe(fieldsViews, function(err, next) {
      // if no data, add an example
      if (!fieldsViews.get().length) {
        model.add('adminFieldsViews', {
          view: 'view',
          field: 'field',
          label: 'label',
          comment: 'comment'
        });
      }
      model.ref('_page.fieldsViews', fieldsViews);
      model.set('_page.testData', ['Item1', 'Item2', 'Item3', 'Item4']);
      page.render('adminFieldsViews');
    });

  });

  app.component('adminFieldsViews', adminFieldsViewsForm);
  function adminFieldsViewsForm() {}

  // client side only
  adminFieldsViewsForm.prototype.create = function(model) {
    // retrieve the material techniques
    xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/v1/admin/views', true);
    xhr.onload = function() {
      // debug
      // FIXME: change the key name from '_id' to 'content' so it can be used directly in the view
      var viewList = [];
      var responseJson = JSON.parse(this.responseText);
      for (var key in responseJson) {
        viewList.push({content: responseJson[key]._id});
      }
      // component
      console.log(viewList);
      model.root.set('_page.adminViewsName', viewList); // JSON.parse(this.responseText));
    }
    xhr.send();
  }

  adminFieldsViewsForm.prototype.fieldsViewsAdd = function () {
    console.log('add');
    this.model.root.add('adminFieldsViews', this.model.del('_page.fieldViewNew'));
  }

  adminFieldsViewsForm.prototype.fieldsViewsDelete = function (id) {
    console.log('del', id);
    this.model.root.del('adminFieldsViews.'+id);
  }

  adminFieldsViewsForm.prototype.fieldsViewsDuplicate = function (id) {
    console.log('dup', id);
    var duplicateFieldsView = this.model.root.get('adminFieldsViews.'+id);
    duplicateFieldsView['id'] = this.model.id(); // new id
    delete duplicateFieldsView['__proto__']; // clean
    this.model.root.add('adminFieldsViews', duplicateFieldsView);
  }

}
