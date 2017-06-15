# Media creation app for De Persgroep

NOTE: This app is still in development

This app is a plaform for young writers. Young people (20 - 30 years old) seem to lose interest in the news these days. By making a platform for these people and making them involved in writing the articles, the articles become more relevant for the target group itself.

Within the platform, writers can review articles from other people. This way, writers can learn from others, and the platform becomes a community. Reviewers receive score for their reviews. The amount of score relies on the type of review (syntax, style or content). With this score, a ranking is made up of best reviewers. The best reviewers might be rewarded with payments from De Persgroep. For the Persgroep, it is interesting to reward reviewers, because they make the content on their platform better. This should lead to more visitors.

## Installation
The first is [setting up a mongo database](http://mongodb.github.io/node-mongodb-native/2.2/quick-start/quick-start/). Make sure you edit the url to the database in `.env`, after cloning, in the root of the project to the url of your database.

```console
git clone https://github.com/Frankwarnaar/minor-persgroep.git
npm install
npm run build
npm start
```

## Development
After installation, run:
```console
npm run dev
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
* [ ] Show reviews, aligned to the selected paragraph / title
* [ ] Notify an author when there are new reviews on his/her article
* [ ] Version control on articles to on what content reviews were done

### Could haves
* [ ] Save reviews realtime
* [ ] Review offline, and publish these reviews when connection is reastablished
* [ ] Review articles offline and publish your review later
* [ ] Show when someone else is reviewing the same article as you
* [ ] Comment on reviews
* [ ] Rate reviews

### Would haves
* [ ] Create ranking with reviewers
* [ ] Dashboard for authors and reviewers to watch their statistics
* [ ] Create ranking with authors
* [ ] General comments on articles

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
* [ ] Display reviews inline (in review mode and at your articles)

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
        * **tempaltes**: styling for template layouts
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
