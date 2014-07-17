temple
=============


# TODO

## Private

### artist detail

- bind the tab with the data like in the example from Derbyjs

# Mongodb dump and restore
```
mongodump -d <our database name> -o <directory_backup>
```

And to "restore/import" that, i used (from directory_backup/dump/):
```
mongorestore <our database name>
```

# Derby.js notes

## Problems

- pass data to view : how to do it properly?
- split logic
- file upload


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
