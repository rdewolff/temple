# Temple

## Installation

```
git clone https://github.com/rdewolff/temple.git
cd temple
npm install
npm start
```

## Model

### Admin Properties

#### Required properties

- Languages : 2 letter code separated by coma. Example : FR, DE, EN

### Mongodb structure

to complete

```
collection {
  id
  accessionNr
  title
  yearFrom
  publish
  materialTechnique
  description
  file [
    {
      id:
      fileOriginalFilename:
      fileName:
      fileSize:
    }
  ]
}

artist {
  id
  firstname
  lastname
  domain
  gender
  lastname
  birthday
  birthcountry
  birthplace
  deathday
  address
  citizenship
}

collectionArtist {
  collection_id
  artist_id
}

```

### Application model

- ```_session.search``` :

## TODO

- dynamic page loading. Pseudo code :

```
controller

for each view
  app.get(/auto/{view.location})
  subscribe to {view.data}
  todo: filter, paging

function label(field)

view
  label('fieldname')
  data('fieldname')
```

- remove delete button on edit form when adding new object
- build guided tour of temple
- improve collection - artist link (on private collection edit page) to work with reactive function. Or better way?
- check if the various reactive function are not causing problems with similar names (getCollectionArtistLinkedIds())
- add a global debug param or use the one for the environment provided by js/derby
- rename 'app' to 'private'

Cf. specification document [https://docs.google.com/document/d/1LaTlhE7MRqVQabxxX4uBnHOJha9I_-ZU1Y43ri5kXmI]

## Mongodb

### Chambook startup

```mongod --dbpath /Users/rdewolff/Data/mongodb```

### Backup

Backup the wanted database in specific directory :
```
mongodump -d <our database name> -o <directory_backup>
```

### Restore

Restore the backed up database from specific directory :
```
mongorestore <our database directory> --drop
```

Note: the ```--drop``` option will empty the database first.

### Via JSON files

```
mongoexport -d temple -c collection -o data.json
```
```
mongoimport -d temple -c artist data.json
```

### Convert any mongodb to livedb compatible

To use your standard mongodb database with livedb, you need to ad a few info in
the database. That's why the tool IGOR has been created.

https://github.com/share/igor

## Dependencies

Temple use NPM for it's npm dependencies and bower.

### Node.js NPM

Actual version :

- node v0.10.31
- npm v1.4.24

Mac OS X : to update node and npm to last stable version, run :
```
brew update && brew upgrade node && npm update npm -g
```

For more info, refer to the ```package.json``` file.

### Bower

- Keypress : http://dmauro.github.io/Keypress/

## Tweaks

### Styling

#### Sidr CSS cleaned

public/component/sidr/stylesheets/jquery.sidr.light.css : removed the following styles :

```
font-family:"lucida grande",tahoma,verdana,arial,sans-serif;font-size:15px;
```
To avoid collision with bootstrap in the left menu

## Known bugs

- If you change page while the temple-panel is still open, it won't ropen. You
  have to reload the whole page for it to work again.

## Derby.js notes

### Difficulties & questions

- pass data to view : how to do it properly?
- split logic
- file upload
- list of reserved keyword not to use in our source code var name or function name
- list of properties like $render.ns that we can use
- component event list (init, etc..?)
- understand client vs server side rendering
- schema illustrating derby, components, etc... one image = 1000 words :)
- component interaction : use the model? exchange other info?
- do component share external JS like jQuery?
- how to use other external JS libs? Can I include them in my views? Should I "browserify" them?
- good practice
  - I feel like I have done many mistakes because there are multiple way to do
  things and the error are not very expressfull. So sometimes you can end up
  doing stuff that works (partially?) but not in the good way. And that's usually
  later that you discover your mistakes and you have to rewrite part of your app.
  Having a "Good practice" section in the doc would help newbies to get started
  and take the good road directly!
  - model.query() : when no query object passed in parameter, error should be more expressfull
- how does the ```<includes:>``` link with ```{{@static}}/file``` work?
- serving static content in components (like with the codemirror) is really a mess.. any way
  to make that better in the futur?
- most common type of object used in derby and their methods and properties ! this is a must have!
- should components have a static content path?
- can we do model.ref() in component or that does make no sense? Do we _have to_ use
  the modle.set() to handle data in our components? Seems not the case.
- can we call model.on() in a composant create methode or that would
  register many times the same trigger?
- how to pass parameter from a view to a component index.js ?
- No distinct query in Derby/Racer ?
- wrong model events don't necesserly show error when not used correctly. they
  simply die silently. TODO: example.
- how to query the model in the app.get() controller, and then re-run the query on
  change of something? Should we share object? Simply re run a new query, subscribe
  again to it and ref() it ? What's the best practice??? Am struggling to try to
  do this properly to filter a collection displayed based on the user input.
- How to use the RefList correctly? Can we use it for a N to N relationship between 2 collections?
- Can we clone an object with object.at('col.'+id) and then change it's ID with new model.id() and add it? or can that cause strange behaviors?
- Dropdown don't get selected when used in a loop (example in Admin Fields Views)
- Problem converting db with Igor. Cf new thread started 20.8.2014 : https://groups.google.com/forum/#!topic/derbyjs/S4pPpk_Djik
- What happen if you subscribe to one collection in one place, and then, on some user action, you want to update the data displayed and re-subscribe to the same collection with different criteria?? Does Derby handle this correctly or will the system crash at some point?


### Mail to Derby.js Google group

In reply to : https://groups.google.com/forum/#!topic/derbyjs/tcj4Ezeh2-A

```
Hi all

Thanks for the great feedback. Appreciate to be able to follow up.

Concerning the knowledge gaps, I have been fighting with a few problems and will
try to resume them here. I know these gaps don't concern only Derby.js. But if
you want to make people use your framework and love it and participate in it's
development, you have to help them come to you :)

Knowledge Gaps
Here a few elements I could write down
List of all the properties we can use (like <view name="{{$render.ns}}"/>)
Docs : have a doc in http://devdocs.io/ !
Common error page would be helpfull
```

### Derby bug with display collection object

*Status:* actually working on it

Hi all

While making much progress in the last few days, I think I've run through a bug in Derby 0.6.

The actual app is an app to manage art objects and artists. One part of the app
is the "private" one (backend) and the other is the public one (front end). In the
backend, I can edit a collection object using ```model.at('collection.'+params.id)```.
That was working fine, until... I added the same method to display the collection
object detail with the same method : ```model.at('collection.'+params.id)```. When
I added this second method, doing the same thing with a different route for my
second app :

1. I lost data!! That's the worst part. All the object I tried to view in details where wipped form the database. The object still exist, but all the records have been _deleted_!
2. The system now crash with the following error code :
