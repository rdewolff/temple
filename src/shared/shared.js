var fs = require('fs');

module.exports = function(app, options) {

    // TODO: move to component?
    // check if the link is part of the URL
    app.proto.containUrl = function(currentUrl, linkUrl) {
      // FIXME: path /a/bc should not return true when path /a/b give. Full word matching should be implemented.
      // console.log(currentUrl, linkUrl, (currentUrl.split('/')).indexOf(linkUrl));
      // return ((currentUrl.split('/')).indexOf(linkUrl.split('/')) > -1);
      // regular expression to match a word : \b([a-zA-Z0-9]*)\b
      return (currentUrl.indexOf(linkUrl) > -1);
    }

    app.proto.getValue = function(collection, field) {
    	console.log('getValue()');
    	// return 'getValue();'
    }

    // dynamic module system
    /* app.get('/:module/:view/:options?*', function(page, model, params, next) {});
    */
    /**
     * Module : define the data
     */
    app.get('/:module/:action?/:option?', function(page, model, params, next) {

      // dynamic module name coming from URL
      var module = params.module;
      var action = params.action;
      var option = params.option;

      // debug
      console.log('module:', module);
      console.log('action:', action);
      console.log('option:', option);

      if (action) {
        switch (action) {
        case 'view':
          console.log('view');
          break;
        case 'list':
          console.log('list');
          break;
        case 'search':
          console.log('search');
          break;
        default:
          console.log('invalid');
        }
      }
      // check prerequisits
      // check if the view exists for the dynamic module
      if (fs.existsSync(__dirname + '/../../views/app/'+module+'.html')) {
        // get the data from module
        var query = model.query(module, {});
        model.subscribe(query, function done(err, next){
          if (err) return next(err);
          query.ref('_page.' + module);
          // render the specific view
          page.render(module);
        });
      } else {
        // render the default view
        page.render('default');
      }

    });

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
