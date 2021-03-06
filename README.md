# Writic
![screenshot of this app](https://raw.githubusercontent.com/Frankwarnaar/minor-persgroep/master/readme_screens/review.png)

This app is a plaform for young writers. Young people (20 - 30 years old) seem to lose interest in the news these days. By making a platform for these people and making them involved in writing the articles, the articles become more relevant for the target group itself.

Within the platform, writers can review articles from other people. This way, writers can learn from others, and the platform becomes a community. Reviewers receive score for their reviews. The amount of score relies on the type of review (syntax, style or content). With this score, a ranking is made up of best reviewers. The best reviewers might be rewarded with payments from De Persgroep. For the Persgroep, it is interesting to reward reviewers, because they make the content on their platform better. This should lead to more visitors.

## Installation
First run in your terminal:
```bash
git clone https://github.com/Frankwarnaar/minor-persgroep.git
```

After that, [set up a mongo database](http://mongodb.github.io/node-mongodb-native/2.2/quick-start/quick-start/). Make sure you edit the url to the database in `.env.sample`. Rename `.env.sample` to `.env`. These files can be found in the root of the project.

After that run the next command in your terminal:

```bash
npm install
gulp build
npm start
```

## Development
After installation, run in your terminal:
```bash
gulp
```
Start watch and browser-sync tasks

### Build tasks

#### Main tasks
* Start `watch`, `browser-sync` and `server` tasks
```bash
gulp default
```
* Start build
```bash
gulp build
```
* Clean dist folder
```bash
gulp clean
```

#### Sub tasks
* Start server that restarts on changes
```bash
gulp server
```

* Start all watch tasks
```bash
gulp watch
```

* Watch views, refresh browser-sync on changes
```bash
gulp watch:html
```

* Watch scss files for changes, rebuild to css on changes
```bash
gulp watch:styles
```

* Compile scss to css
```bash
gulp styles
```

* Watch for changes in javascript if debug is enabled in config, otherwise build once
```bash
gulp watchify
```

* Start browser-sync server for displaying changes in client side code realtime in the browsr
```bash
gulp browser-sync
```

* Compress images
```bash
gulp images
```

## Features

### Must haves
* [x] Create articles
* [x] Edit articles
* [x] Review articles with a basic form, under each article
* [x] Show the reviews already done on an article
* [x] Get an overview of the reviews on your article

### Should haves
* [x] Close reviews
* [x] Show reviews, aligned to the selected paragraph / title
* [x] Notify an author when there are new reviews on his/her article

### Could haves
* [x] Show when someone else is reviewing the same article as you
* [x] Send an author a push notification when there are new reviews
* [ ] Save reviews realtime
* [x] Edit reviews
* [ ] Review offline, and publish these reviews when connection is reastablished
* [ ] Comment on reviews
* [ ] Rate reviews
* [ ] Version control on articles to show on what content reviews were done

### Would haves
* [ ] Create ranking with reviewers
* [ ] Dashboard for authors and reviewers to watch their statistics
* [ ] Create ranking with authors
* [ ] General comments on articles
* [ ] Compare versions of an article

## Process

### Week 1
* [x] Initial concept
* [x] Setup database
* [x] Setup routes
  * [x] index
  * [x] articles
  * [x] reviews
* [x] Write/edit articles

### Week 2
* [x] Setup login system
* [x] Notifications
* [x] Get an overview of unclosed reviews at your articles
* [x] Close reviews on your article

### Week 3
* [x] Enhance inline reviewing (like Google Docs comments)
* [x] Display reviews inline (in review mode and at your articles)
* [x] Notify an author when there are new reviews on his/her article

### Week 4
* [x] Show it when others are reviewing the same article as you are realtime
* [x] Notifications with service worker
* [x] Guide for users

### Week 5
* [x] final fixes
* [x] Poster

## Project structure

### Code base

* **src**: In the root there is a `src` folder. This folder contains all the original source code and files, before compiling, transpiling or compression.
  * **client**: code used client side
    * **img**: original images
    * **styles**: styling done with scss
      * **_helpers**: helper classes
      * **_variables**: variables used for styling
      * **base**: core layout syling
      * **fonts**: styling code for fonts
      * **patterns**: styling for components, by the [atomic design methodology](http://bradfrost.com/blog/post/atomic-web-design/).
        * **atoms**: smallest components
        * **molecules**: components that contain a group of atoms
        * **organisms**: components that contains a group of molecules
        * **templates**: styling for template layouts
      * **vendor**: third party styling
     * **js**: javascript
       * **components**: scripts used for components
       * **watchers**: scripts that just listen to events
  * **server**: code used server side
    * **lib**: reusable code for the routes.
    * **routes**: routers that handle requests for a certain part of the application
    * **views**: templates that are being rendered for the user
      * **patterns**: templates for components, , by the [atomic design methodology](http://bradfrost.com/blog/post/atomic-web-design/)
        * **atoms**: smallest components
        * **molecules**: components that contain a group of atoms
        * **organisms**: components that contains a group of molecules

### Data model

In the database, there are the next collections:

#### 1. users
Users have the next keys:
* `_id`: unique id (ObjectId)
* `name` (object)
  * `first`: first name (string)
  * `last`: last name (string)
* `email`: email adres (string)
* `password`: hashed password (string)
* `author`: Whether the user is an author or not (boolean)

#### 2. articles
Articles have the next keys:
* `_id`: unique id (ObjectId)
* `title`: title of the article (string)
* `content`: content of the article (string)
* `authorId`: id of the user that has written the article (ObjectId)
* `timestamp`: epoch timestamp, of the moment of publication of the article (double)

#### 3. reviews
Reviews have the next keys:
* `_id`: unique id (ObjectId)
* `element`: data-child attribute of the child of the article the review has been done on (string)
* `type`: type of review (string: `content`, `style` or `grammer`)
* `articleId`: id of the article the review is about (ObjectId)
* `userId`: id of the user who wrote the review (ObjectId)
* `timestamp`: epoch timestamp of the moment the review has been published on (double)
* `read`: Whether the author of the article has already been notified (boolean)
* `handled`: Whether the review has already been handled (boolean)
* `accepted`: whether the review has already been accepted (boolean)

## Courses
This app contains work from the next courses:
## 1. Web app from scratch
The whole client side javascript is built with the structure learned at WAFS. This can be found at [src/client/js](https://github.com/Frankwarnaar/minor-persgroep/tree/master/src/client/js)
## 2. Browser technologies
The following things are progressive enhanced:
1. The reviewing system
  * [Server side baseline code](https://github.com/Frankwarnaar/minor-persgroep/blob/master/src/server/routes/review.js)
  * [Client side javascript enhancements](https://github.com/Frankwarnaar/minor-persgroep/blob/master/src/client/js/components/Review.js)
2. Notifications
  * [Server side notifications in navigation](https://github.com/Frankwarnaar/minor-persgroep/blob/master/src/server/app.js#L75)
  * [Client side realtime enhanced notifications](https://github.com/Frankwarnaar/minor-persgroep/blob/master/src/client/js/watchers/Notifications.js)
## 3. Performance matters
The app uses a service worker for viewing pages offline and for notifying the user when there are new reviews on his/her articles with push notifications.
* [Service worker](https://github.com/Frankwarnaar/minor-persgroep/blob/master/src/client/js/sw.js)
* [Notifications](https://github.com/Frankwarnaar/minor-persgroep/blob/master/src/client/js/watchers/Notifications.js)

Besides that, some optimizations are done, like:
* [Minify js & css](https://github.com/Frankwarnaar/minor-persgroep/pull/23/commits)
* [Use picture elements with different sizes for big images](https://github.com/Frankwarnaar/minor-persgroep/pull/26)
## 4. Realtime web
The app has a realtime enhancement to show when someone is reviewing the same article. 
* [Server side code](https://github.com/Frankwarnaar/minor-persgroep/blob/master/src/server/routes/review.js#L113)
* [Client side code](https://github.com/Frankwarnaar/minor-persgroep/blob/master/src/client/js/watchers/Reviews.js)


## Reflection
What I'm the most proud of, is the way I've approached this project. From the start, I've built everything progressive enhanced, starting by making it work server side. Where value was added for the user, I enhanced my project with javascript and realtime features. 

Besides that, I'm proud of my workflow. What I did during the project, was writing down all possible features that this project would have, prioritize them and work out the most important ones. This way, in my eyes, I came to a really decent product.
