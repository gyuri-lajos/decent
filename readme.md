# decent 5

### The Garden and The Wall

**What** Decent is a secure scuttlebutt server for your website. It hosts a minimal lite client so that visitors to your website can use [secure-scuttlebutt](http://scuttlebot.io) to write their own posts, and write on your wall. 

**Why?** The reason I started developing with the original [scuttlebutt](http://github.com/dominictarr/scuttlebutt) back in 2012 was because I wanted a distributed social network running on my website. Decent attempts to be a social network for your website by leveraging ssb's distributed database, with a few modifications:

+ A Decent pub is also the moderator. This means whoever controls the Decent pub decides what it wants to replicate. We accomplish this by setting `friends: { hops: 1}` in the config. This keeps the amount of information on a Decent pub manageable by only showing a corner of the scuttleverse, instead of all of it
+ Limiting it to 1 hop makes the database pretty small, because you're not syncing the entire scuttleverse
+ While anyone can view and post to a Decent pub, new users won't replicate by default. Someone will have to follow them for them to replicate across the scuttleverse 
+ No private messages. If you want private messages, install [mvd](http://github.com/evbogue/mvd) on your computer
+ Everyone gets a 'Wall' in Decent, making the UI easy for new users to write messages to each other or to the website creator
+ Decent has mutable messages, so anyone can edit their messages. There is no 'delete' on Decent, because ssb is an append only log, and I don't want to give anyone the false sense of thinking that deleted messages actually go away. They do not.

Setting Decent up this way makes it a Garden (because your pub curates the data hosted on it by only showing users followed by the pub) and The Wall (gives users an easy way to talk to you from your website)

In some ways Decent is a compromise, because the people who use Decent are not full peers on the network. However, I hope to encourage people to install a full ssb client on their desktop by limiting access to private messages on Decent pubs. In an ideal world everyone would run their own ssb server on their own computer, but we need to face that we are not living in an ideal world where everyone has the technical ability to install a complicated distributed social network written in Node.js on their computer right now.

In an ideal world Decent would include two features that are not available right now:

+ A full peer in the browser 
+ The ability to easily delete a feed with the click of a single button

Right now the server has to run on a VPS, and to delete someone's feed you need to unfollow and/or block a client and then resync your scuttlebot database from scratch.

Try Decent at http://decent.evbogue.com/

Remember! The first rule of Decent is: be decent.

### history

`decent` is a fork of [mvd](http://github.com/evbogue/mvd) 

In previous versions of Decent it was an 'altnet'. Decent now uses the main network key, and only shows a corner of the scuttleverse.

---
MIT
