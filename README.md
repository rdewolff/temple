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
- wrong model events don't necesserly show error when not used correctly. they
  simply die silently. TODO: example.

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

## Derby bug with display collection object

*Status:* actually working on it

Hi all

While making much progress in the last few days, I think I've run through a bug in Derby 0.6.

The actual app is an app to manage art objects and artists. One part of the app is the "private" one (backend) and the other is the public one (front end). In the backend, I can edit a collection object using ```model.at('collection.'+params.id)```. That was working fine, until... I added the same method to display the collection object detail with the same method : ```model.at('collection.'+params.id)```. When I added this second method, doing the same thing with a different route for my second app :

1. I lost data!! That's the worst part. All the object I tried to view in details where wipped form the database. The object still exist, but all the records have been _deleted_!
2. The system now crash with the following error code :

```
27419 listening. Go to: http://localhost:3000/
Bundle created: temple
Bundle created: public
[TypeError: Cannot set property 'id' of null]

/Users/rdewolff/Projets/temple/node_modules/livedb-mongo/node_modules/mongoskin/node_modules/mongodb/lib/mongodb/connection/server.js:529
        throw err;
              ^
TypeError: Cannot set property 'id' of null
  at Doc.RemoteDoc._updateCollectionData (/Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/lib/Model/RemoteDoc.js:58:17)
  at Doc.RemoteDoc (/Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/lib/Model/RemoteDoc.js:19:8)
  at Collection.add (/Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/lib/Model/collections.js:115:13)
  at Model.getOrCreateDoc (/Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/lib/Model/collections.js:69:44)
  at Model.subscribeDoc (/Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/lib/Model/subscriptions.js:139:18)
  at Query._onChange (/Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/lib/Model/Query.js:442:20)
  at [object Object].callback (/Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/lib/Model/Query.js:268:13)
  at [object Object].Query._onMessage (/Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/lib/client/query.js:150:31)
  at [object Object].Connection.handleMessage (/Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/lib/client/connection.js:178:24)
  at StreamSocket.socket.onmessage (/Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/lib/client/connection.js:124:18)
  at StreamSocket.Channel.socket.onmessage (/Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/lib/Channel.js:19:28)
  at Duplex._write (/Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/lib/Model/connection.server.js:23:12)
  at doWrite (_stream_writable.js:226:10)
  at writeOrBuffer (_stream_writable.js:216:5)
  at Duplex.Writable.write (_stream_writable.js:183:11)
  at Session._send (/Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/lib/server/session.js:325:15)
  at Session._reply (/Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/lib/server/session.js:358:8)
  at /Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/lib/server/session.js:379:28
  at /Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/lib/server/session.js:693:9
  at /Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/lib/server/useragent.js:452:11
  at /Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/lib/server/useragent.js:424:5
  at /Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/node_modules/async/lib/async.js:119:25
  at /Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/node_modules/async/lib/async.js:24:16
  at /Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/lib/server/useragent.js:95:5
  at Object.async.eachSeries (/Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/node_modules/async/lib/async.js:130:20)
  at [object Object].UserAgent._runFilters (/Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/lib/server/useragent.js:92:9)
  at [object Object].UserAgent.filterDoc (/Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/lib/server/useragent.js:100:15)
  at /Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/lib/server/useragent.js:422:11
  at /Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/node_modules/async/lib/async.js:111:13
  at Array.forEach (native)
  at _each (/Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/node_modules/async/lib/async.js:32:24)
  at Object.async.each (/Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/node_modules/async/lib/async.js:110:9)
  at [object Object].UserAgent._filterQueryResults (/Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/lib/server/useragent.js:421:9)
  at /Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/lib/server/useragent.js:450:15
  at /Users/rdewolff/Projets/temple/node_modules/derby/node_modules/racer/node_modules/share/node_modules/livedb/lib/queries.js:112:9
  at /Users/rdewolff/Projets/temple/node_modules/livedb-mongo/mongo.js:247:9
  at /Users/rdewolff/Projets/temple/node_modules/livedb-mongo/node_modules/mongoskin/node_modules/mongodb/lib/mongodb/cursor.js:166:9
  at /Users/rdewolff/Projets/temple/node_modules/livedb-mongo/node_modules/mongoskin/node_modules/mongodb/lib/mongodb/cursor.js:197:31
  at /Users/rdewolff/Projets/temple/node_modules/livedb-mongo/node_modules/mongoskin/node_modules/mongodb/lib/mongodb/cursor.js:686:30
  at Cursor.close (/Users/rdewolff/Projets/temple/node_modules/livedb-mongo/node_modules/mongoskin/node_modules/mongodb/lib/mongodb/cursor.js:939:5)
  at getMore (/Users/rdewolff/Projets/temple/node_modules/livedb-mongo/node_modules/mongoskin/node_modules/mongodb/lib/mongodb/cursor.js:686:12)
  at getAllByGetMore (/Users/rdewolff/Projets/temple/node_modules/livedb-mongo/node_modules/mongoskin/node_modules/mongodb/lib/mongodb/cursor.js:195:3)
  at /Users/rdewolff/Projets/temple/node_modules/livedb-mongo/node_modules/mongoskin/node_modules/mongodb/lib/mongodb/cursor.js:163:7
  at commandHandler (/Users/rdewolff/Projets/temple/node_modules/livedb-mongo/node_modules/mongoskin/node_modules/mongodb/lib/mongodb/cursor.js:628:16)
  at [object Object].<anonymous> (/Users/rdewolff/Projets/temple/node_modules/livedb-mongo/node_modules/mongoskin/node_modules/mongodb/lib/mongodb/db.js:1709:18)
  at [object Object].g (events.js:180:16)
  at [object Object].EventEmitter.emit (events.js:106:17)
  at Server.Base._callHandler (/Users/rdewolff/Projets/temple/node_modules/livedb-mongo/node_modules/mongoskin/node_modules/mongodb/lib/mongodb/connection/base.js:130:25)
  at /Users/rdewolff/Projets/temple/node_modules/livedb-mongo/node_modules/mongoskin/node_modules/mongodb/lib/mongodb/connection/server.js:522:20
  at [object Object].MongoReply.parseBody (/Users/rdewolff/Projets/temple/node_modules/livedb-mongo/node_modules/mongoskin/node_modules/mongodb/lib/mongodb/responses/mongo_reply.js:132:5)
  at [object Object].<anonymous> (/Users/rdewolff/Projets/temple/node_modules/livedb-mongo/node_modules/mongoskin/node_modules/mongodb/lib/mongodb/connection/server.js:481:22)
  at [object Object].EventEmitter.emit (events.js:95:17)
  at [object Object].<anonymous> (/Users/rdewolff/Projets/temple/node_modules/livedb-mongo/node_modules/mongoskin/node_modules/mongodb/lib/mongodb/connection/connection_pool.js:190:13)
  at [object Object].EventEmitter.emit (events.js:98:17)
  at Socket.<anonymous> (/Users/rdewolff/Projets/temple/node_modules/livedb-mongo/node_modules/mongoskin/node_modules/mongodb/lib/mongodb/connection/connection.js:382:22)
  at Socket.EventEmitter.emit (events.js:95:17)
  at Socket.<anonymous> (_stream_readable.js:745:14)
  at Socket.EventEmitter.emit (events.js:92:17)
  at emitReadable_ (_stream_readable.js:407:10)
  at emitReadable (_stream_readable.js:403:5)
  at readableAddChunk (_stream_readable.js:165:9)
  at Socket.Readable.push (_stream_readable.js:127:10)
  at TCP.onread (net.js:528:21)
```

To reproduce the bug, you can use my repo here :

https://github.com/rdewolff/temple.git

1. clone it
2. go in it and install npm dependencies (npm install)
3. run the project with "npm start".
4. open your browser with http://localhost:3000
5. open your browser and
