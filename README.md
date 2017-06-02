# Media creation app for De Persgroep

NOTE: This app is still in development

This app is a plaform for young writers. Young people (20 - 30 years old) seem to lose interest in the news these days. By making a platform for these people and making them involved in writing the articles, the articles become more relevant for the target group itself. 

Within the platform, writers can review articles from other people. This way, writers can learn from others, and the platform becomes a community. Reviewers receive score for their reviews. The amount of score relies on the type of review (syntax, style or content). With this score, a ranking is made up of best reviewers. The best reviewers might be rewarded with payments from De Persgroep. For the Persgroep, it is interesting to reward reviewers, because they make the content on their platform better. This should lead to more visitors.

## Installation
The first is [setting up a mongo database](http://mongodb.github.io/node-mongodb-native/2.2/quick-start/quick-start/). Make sure you edit the url to the database in `cfg.js` in the root of the project to the url of your database.

After that, take the next steps:
```
$ git clone https://github.com/Frankwarnaar/minor-persgroep.git
$ npm install
$ npm run build
$ npm start
```

## Development
After installation, run:
```
$ npm run dev
```

## Features
* [x] Edit articles with a rich content editor
* [ ] Review articles with a basic html form
* [ ] Enhance the review with javascript, to make it possible to review the article inline
* [ ] Save reviews realtime
