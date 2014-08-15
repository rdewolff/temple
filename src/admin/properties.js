/**
 * ADMIN PROPERTIES
 */

module.exports = function(app, options) {

  app.get('/admin/properties', function(page, model, params, next) {

    // subscribe to the artist sent back via XHR
    page.render('adminProperties');

  });

}
