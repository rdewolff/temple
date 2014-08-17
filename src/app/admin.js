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
        model.add('adminProperties', {name: 'URL', value: 'http://'});
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


}
