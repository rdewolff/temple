/**
 * HOME
 */

module.exports = function(app, options) {

  app.get('/', function(app){
    app.redirect('/home');
  });

  app.get('/home', function(page, model, params, next) {
    var collectionQuery = model.query('collection', {publish: "Highlight"});
    model.subscribe(collectionQuery, function onCount(err, next){
      if (err) return next(err);
      collectionQuery.ref('_page.collection');
      page.render('home');
    });
  });

  app.component('home', HomeForm);

  function HomeForm() {}

  // client side only
  HomeForm.prototype.create = function(model) {

    // retrieve the material techniques
    xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/v1/collection/materialTechnique', true);
    xhr.onload = function() {
      // debug
      // console.log(this.responseText);
      model.root.set('_page.materialTechnique', JSON.parse(this.responseText));
    }
    xhr.send();

  }


}
