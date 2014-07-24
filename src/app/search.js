/**
 * SEARCH
 */
module.exports = function(app, options) {

  // triggered only once 
  app.proto.create = function(model) {

    global.MODEL = model
  //}
  //app.ready('/', function () {

    console.log("binding data");

    model.set('_session.search', '');
    
    // search
    model.on('change', '_session.search', function() {

      console.log("_session.search has changed! " + Date());

      var searchQuery = model.get("_session.search");

      // get the most recent objects
      var searchCollectionQuery = model.query('collection', {title: {$regex: searchQuery, $options: 'i'}, $limit: 5}); // ,$limit: 5 , $orderby: {"_m.ctime": -1}}); // $options 'i' = case insensitive
      var searchArtistQuery = model.query('artist', {$limit: 5 , $orderby: {"_m.ctime": -1}});

      model.subscribe(searchCollectionQuery, searchArtistQuery, function doSearch(err, next) {
        if (err) return next(err);

        searchCollectionQuery.ref('_page.searchCollection');
        searchArtistQuery.ref('_page.searchArtist');

        console.log("SEARCH DONE"+searchCollectionQuery.get().length);

      // app.history.push('/p/search');
      });
    });

  }

}

/*
module.exports = function(app, options) {

  app.component('menuLeftPane', templeSearch);
  function templeSearch() {}

  templeSearch.prototype.init = function () {

    var model = this.model;

    model.on('change', '_session.search', function() {

      console.log("_session.search has changed! " + Date());

      var searchQuery = model.get("_session.search");

      // get the most recent objects
      var searchCollectionQuery = model.query('collection', {title: {$regex: '^'+searchQuery, $options: 'i'}}); // ,$limit: 5 , $orderby: {"_m.ctime": -1}}); // $options 'i' = case insensitive
      var searchArtistQuery = model.query('artist', {$limit: 5 , $orderby: {"_m.ctime": -1}});

      model.subscribe(searchCollectionQuery, searchArtistQuery, function doSearch(err, next) {
        if (err) return next(err);

        searchCollectionQuery.ref('_page.searchCollection');
        searchArtistQuery.ref('_page.searchArtist');

        console.log("SEARCH DONE"+searchCollectionQuery.get().length);

      // app.history.push('/p/search');
      });


    });

  }
}
*/