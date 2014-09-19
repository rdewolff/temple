
module.exports = function(model, module, option) {

  console.log('***** called me!');

  // current object
  var moduleData = model.at(module + '.'  + params.id);

  // TODO: relations between modules
  // var collectionArtist = model.query('collectionArtist', {collection_id: params.id});

  // subscribe to data
  model.subscribe(moduleData, /*collectionArtist, */ function(err) {
    if (err) return next(err);
    if (!moduleData.get()) return next();
    model.ref('_page.'+module, moduleData);
    //TODO: get linked artist via reactive function
    //model.start('_page.collectionArtistsIds', 'collectionArtist', 'getCollectionArtistLinkedArtistIds');
    //var collectionArtistLinked = model.query('artist', '_page.collectionArtistsIds');
    //model.subscribe(collectionArtistLinked, function(){
    //  model.ref('_page.collectionArtistObjects', collectionArtistLinked);
      // TODO: ustomizable via admin area
      page.render(module);
    //});
  });
}
