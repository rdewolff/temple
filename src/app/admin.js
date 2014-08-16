/**
 * ADMIN
 */

module.exports = function(app, options) {

  app.get('/admin/properties', function(page, model, params, next) {
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
    this.app.history.refresh();
  }

  AdminPropertiesForm.prototype.propertiesDelete = function (id) {
    this.model.root.del('adminProperties.'+id);
    // FIXME: this should be required - auto refreshes normally
    this.app.history.refresh();
  }

  AdminPropertiesForm.prototype.propertiesDuplicate = function (id) {
    var duplicatedProperties = {
      name: this.model.root.get('adminProperties.'+id).name,
      value: this.model.root.get('adminProperties.'+id).value
    }
    this.model.root.add('adminProperties', duplicatedProperties);
    // FIXME: this should be required - auto refreshes normally
    this.app.history.refresh();
  }




}
