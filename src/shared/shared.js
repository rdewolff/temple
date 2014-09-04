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
    app.get('/:module', function(page, model, params, next) {

      var module = params.module;

      var query = model.query(module, {});

        model.subscribe(query, function done(err, next){

          if (err) return next(err);

          query.ref('_page.' + module); // create _page name of the module name
          // debug data 
          // console.log(query.get());
          page.render(module);

        });
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
