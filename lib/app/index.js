var app = require('derby').createApp(module)
  .use(require('derby-ui-boot'))
  .use(require('zetcom-ui-forms'))
  //.use(require('derby-ui-select2')) // buggy?
  //.use(require('derby-ui-photo-upload'))
  // .use(require('jquery'))
  // .use(require('derby-ui-typeahead'))
  .use(require('../../ui'))

/* ******************************************************************
   * HOME 
   ****************************************************************** */

// Derby routes are rendered on the client and the server
app.get('/', function(page) {
  page.render('home');
});

/* ******************************************************************
   * SEARCH 
   ****************************************************************** */

app.get("/search", function(page, model, params, next) {
  
  // grab all the objects in the collection first
  // with query system
  var collectionQuery = model.query('collection', {})
  collectionQuery.subscribe(function(err) {
    if (err) return next(err)
    collectionQuery.ref('_page.collection');
    page.render("search");  
  })
  
  // with filter system
  /* 
  var collectionQuery = model.query('collection');
  model.subscribe()
  collectionQuery.subscribe(function(err) {
    if (err) return next(err);
    /*var filter = model.filter('collection', function(item, key, object) {
      return item[key] = "_page.collectionFilter";
    });
    filter.ref('_page.collection');
    page.render("search");  
  }) */

});

app.filterTimeout = undefined;
app.fn('search.filter', function(e) {
  clearTimeout(app.filterTimeout);
  app.filterTimeout = setTimeout( function(){ app.performFilter(e); }, 500 );
});

app.performFilter = function(e) {
  var model = this.model;
  model.filter("collection", function(item) {
    return item.title && item.title.match(model.get("_page.filter"));
  }).ref("_page.collection");
  console.log("filter applied");
};

/* ******************************************************************
   * COLLECTION 
   ****************************************************************** */

// new collection module - this is the heart of our prototype
app.get("/collection", function(page, model, params, next) {
  page.redirect('collection/new');
});

// new or edit collection
// if it's a new collection object :
// - get the related models (like artists)
// if it's an existing collection object :
// - get the collection object
// Go!
app.get("/collection/:id", function(page, model, params, next) {
  
  // we want to create an artist array with only name, lastname (and ID auto added) :
  // mongodb query is  :  db.artist.find({}, {name: 1, lastname: 1}).toArray()
  // sol 1 : use that mongo query
  // sol 2 : change the {} list to an array in the module or via javascript 
  // var artistQuery = model.query('artist', {}); // standard select all artist
  // todo : could not do it yet
  // TODO : artists are not anymore pulled form the datbase?!? new structure causing problems
  var artist = model.get('artist');
  var artistList = [];
  console.log("artist: %j", artist);
  for (var item in artist) {
    artistList.push({'text': artist[item].lastname + " " + artist[item].name});
  }
  // debug log : 
  console.log("artistList: %j", artistList);

  // scope the wanted collection object if specified
  if (params.id != "new") {
    var collection = model.at('collection.' + params.id);
    // prepare the data and render the view
    model.subscribe(collection, function(err){
      if (err) return next(err);  
      model.ref('_page.collection', collection);
    });  
  }

  // TODO trying to call the external function "app.artistListForDropdown()" without success
  //model.set('_page.artist', artistList); // model containing the artist
  page.render('collection');
});

app.collectionCancel = function() {
  app.history.back()
}

app.collectionNew = function() {
  app.page.redirect("/collection/")
}

app.collectionSubmit = function() {
  var model = this.model;
  var collection = model.at('_page.collection')

  if (!collection.get('id')) {
    // var checkId = collection.on('change', 'id')
    model.add('collection', collection.get())
  }
  app.page.redirect("/search")
  // app.history.push('/collection')
  // file upload on the server side route
  // app.page.redirect(307, "/upload" + req.path)
  //app.res.send({redirect: "/upload"})
}

// The "init" and "create" events may be used to get access to
// a component instance's script object
app.createModal = function(modal) {
  app.showModal = function() {
    modal.show();
  }
  // Custom event emitters may be added on the component itself
  modal.on('close', function(action, cancel) {
    console.log('Action: ' + action)
  })
}

// They may also be bound via a template
app.closeModal = function(action, cancel) {
  /*
  if (!window.confirm('Action: ' + action + '\n\nContinue to close?')) {
  cancel()
  }*/
}

/* ******************************************************************
   * ARTIST 
   ****************************************************************** */

app.get("/artists", function(page, model, params, next) {
  page.render('artists');
});

// redirect to new form
app.addArtist = function() {
  app.page.redirect("/artists")
}

app.artistSubmit = function() {
  var model = this.model;
  var artist = model.at("_page.artist")

  if (!artist.get("id")) {
    model.add("artist", artist.get())
  }
  app.page.redirect("/search")
}

app.cancel = function() {
  // app.history.back()
}

app.artistDelete = function() {
  console.log("delete artist");
  console.log(model.get("_page.artist.lastname"));

}
