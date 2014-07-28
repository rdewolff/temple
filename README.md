temple
=============


# TODO

## Private

### artist detail

- bind the tab with the data like in the example from Derbyjs

# Mongodb

## Backup

```
mongodump -d <our database name> -o <directory_backup>
```

## Restore

And to "restore/import" that, i used (from directory_backup/dump/):
```
mongorestore <our database name>
```

## Via JSON files

```
mongoexport -d temple -c collection -o data.json
```
```
mongoimport -d temple -c artist data.json
```

## Convert any mongodb to livedb compatible

To use your standard mongodb database with livedb, you need to ad a few info in
the database. That's why the tool IGOR has been created.

https://github.com/share/igor

# Dependencies

Temple use NPM for it's npm dependencies and bower.

## Node.js NPM

## Bower

- Keypress : http://dmauro.github.io/Keypress/

# Tweaks

## Styling

### Sidr CSS cleaned

public/component/sidr/stylesheets/jquery.sidr.light.css : removed the following styles :

```
font-family:"lucida grande",tahoma,verdana,arial,sans-serif;font-size:15px;
```
To avoid collision with bootstrap in the left menu

# Known bugs

- If you change page while the temple-panel is still open, it won't ropen. You
  have to reload the whole page for it to work again.

# Derby.js notes

## Difficulties & questions

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

## Mail to Derby.js Google group

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
