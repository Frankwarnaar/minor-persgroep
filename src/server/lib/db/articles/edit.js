const ObjectId = require('mongodb').ObjectID;

function postArticle(db, article, id) {
	return db.collection('articles').update(
		{_id: ObjectId(id)},
		{
			$set: {
				title: article.title,
				content: article.content
			}
		}
	);
}

module.exports = postArticle;