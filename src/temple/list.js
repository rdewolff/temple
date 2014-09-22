
module.exports = function(model, page, module, option, query, next) {

    // FIXME: come form the database
    var limitPerPage = 25;

    // count the number of object for pagination
    var collectionCount = model.query(module, {
      $count: true,
      $query: {
        $or: [
          //FIXME: dynamic from database
          {}
          //{publish: "Public"},
          //{publish: "Highlight"}
        ]
      }
    });

    // filter
    var mongoQuery = {
      $or: [
        //FIXME: dynamic from database
        {}
        //{publish: 'Public'},
        //{publish: 'Highlight'}
      ],
      $orderby: [{}],
      $limit: limitPerPage
    };
    // add all queries passed by parameter
    // FIXME: security disable other input
    for (key in query) {
      // debug console.log(key+' -> '+query[key]);
      // don't include the sort option here
      if (key != 'sort')
        mongoQuery[key] = query[key];
    }

    mongoQuery.$orderby[0][query.sort] = 1; // use the parameters for the order by

    //debug
    console.log(mongoQuery);

    var collection = model.query(module, mongoQuery);

    model.subscribe(collection, collectionCount, function(err) {
      if (err) return next(err);

      // save actual module
      model.set('_page.module', module);

      // main data
      collection.ref('_page.'+module);

      // pagination
      console.dir(collectionCount.get());
      collectionCount.refExtra('_page.pagination.collectionCount'); // FIXME: change name of collectionCount to "<model>Count"??
      model.set('_page.pagination.pageSize', limitPerPage);
      model.set('_page.pagination.buttonsCount', 5);

      // FIXME: stored in the database and editable in the admin area
      model.set('_page.filter', [{content: 'Red'}, {content: 'Orange'}, {content: 'Purple'}, {content: 'Blue'}]);
      model.set('_page.order', [{content: 'Title'}]);

      page.render(module);
    });

}
