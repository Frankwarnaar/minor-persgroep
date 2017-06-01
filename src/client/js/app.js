(() => {
	const App = require('./modules/App.js');
	const app = new App();

	const Editor = require('./components/Editor.js');
	const Review = require('./components/Review.js');

	const editor = new Editor();
	const review = new Review();
})();