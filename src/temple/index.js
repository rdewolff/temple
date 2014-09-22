var fs = require('fs');
// var view = require('view.list');
// app.use();
var detail = require('./detail');
var list = require('./list');

module.exports = function(app, options) {

    // required by the list view
    app.component(require('d-comp-palette/pager/pager'));


    // dynamic module system
    /* app.get('/:module/:view/:options?*', function(page, model, params, next) {});
    */
    // TODO : dev in progress - disabled
    //app.get('/:module/:action?/:option?', function(page, model, params, next) {
    app.get('/t/:module/:action?/:option?', function(page, model, params, next) {

      // dynamic module name coming from URL
      var module = params.module;
      var action = params.action;
      var option = params.option;
      var query  = params.query; // URL query, &amp=2234&var=data etc...

      // debug
      console.log('module:', module);
      console.log('action:', action);
      console.log('option:', option);

      // determine action and take appropriate action
      switch (action) {
      case 'detail':
        console.log('detail');
        detail(model, page, module, option, next);
        break;
      case 'list':
        console.log('list');
        list(model, page, module, option, query, next);
        break;
      case 'search':
        console.log('search');
        break;
      default:
        console.log('action invalid');
      }

      return;

      // FIXME : DATA GET RENDERED BEFORE
      // check prerequisits
      // check if the view exists for the dynamic module
      if (fs.existsSync(__dirname + '/../../views/app/'+module+'.html')) {
        // get the data from module
        var query = model.query(module, {});
        model.subscribe(query, function done(err, next){
          if (err) return next(err);
          query.ref('_page.' + module);
          // render the specific view
          console.log('render 152');
          page.render(module);
        });
      } else {
        // render the default view
        page.render('default');
      }

    });

    // FIXME: delete this and the used button (testing)
    app.proto.test = function(model) {
      console.log('CREATED '+Date());
    }

    // pages
    app.proto.pageChanged = function (pageNumber) {
      var model = this.model;

      var collectionObjectToSkip = (pageNumber-1) * model.get('_page.pagination.pageSize');

      var module = model.get('_page.module');
      console.log('module:', module);

      // FIXME: use the order by and filter choosed by the user.
      var collectionQuery = model.query(module, {
        $or: [
          {}
          //{publish: 'Public'},
          //{publish: 'Highlight'}
        ],
        $orderby: [{}],
        $limit: model.get('_page.pagination.pageSize'),
        $skip: collectionObjectToSkip
      });
      console.log(model.get('_page.currentPage'));
      model.subscribe(collectionQuery, function(err, next) {
        // TODO: how to use model.ref() here after the main subscribtion done on load?!?
        // model.del('_page.collection');
        model.set('_page.'+module, collectionQuery.get());
      });
    };

    // app.proto.getModule = function(model) {
    //   // TODO: this should come from the database
    //   // var model = this.model;
    //   console.log(model);
    //   var query = model.query('adminProperties', {name: 'Modules'});
    //   query.fetch(function(err) {
    //     if (err) return next(err);
    //     return query.get().split(',');
    //   });
    //   // return ['Exhibition', 'Expo', ];
    // }

    // // Generate routes dynamically from modules
    // var modules = app.proto.getModule();
    // for (var i = modules.length - 1; i >= 0; i--) {
    //   (function (moduleName){
    //   app.get('/'+moduleName, function(page, model, params, next) {
    //     var query = model.query(moduleName, {}); // module get the collection of it's same name
    //     model.subscribe(query, function done(err, next){
    //       if (err) return next(err);
    //       query.ref('_page.' + query); // create _page name of the module name
    //       page.render(moduleName);
    //     });
    //   });
    // })(modules[i]); // block function remind data
    // };


}
