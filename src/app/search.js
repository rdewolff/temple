/**
 * SEARCH
 */

module.exports = function(app, options) {

  app.component('menu', templeSearch);
  function templeSearch() {}

  templeSearch.prototype.init = function () {
    var model = this.model;
    // model.set('_session.search'); // needed?
  }

  templeSearch.prototype.search = function () {

    var model = this.model;

    var searchQuery = model.get("_session.search");

    console.log("SEARCH " + searchQuery);

    // get the most recent objects
    var searchCollectionQuery = model.query('collection', {}); // ,$limit: 5 , $orderby: {"_m.ctime": -1}});
    var searchArtistQuery = model.query('artist', {$limit: 5 , $orderby: {"_m.ctime": -1}});

    model.subscribe(searchCollectionQuery, searchArtistQuery, function doSearch(err, next) {
      if (err) return next(err);

      searchCollectionQuery.ref('_page.searchCollection');
      searchArtistQuery.ref('_page.searcArtist');

    // app.history.push('/p/search');
    });


    /*
      app.component('menuLeftPane', menuLeftPane);
      function menuLeftPane() {}

      menuLeftPane.prototype.getData = function () {
        app.history.push('/p/collection/new');
      }
    */


  }
}
