const ObjectId = require('mongodb').ObjectID;

function postArticle(db, article, userId) {
	return db.collection('articles').insert({
		title: article.title,
		authorId: ObjectId(userId),
		content: article.content,
		timestamp: new Date().getTime()
	});
}

module.exports = postArticle;