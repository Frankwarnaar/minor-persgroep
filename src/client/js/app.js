(() => {
	const App = require('./modules/App.js');
	const app = new App();

	/*  ===================================================
		Components
		=================================================== */

	const Editor = require('./components/Editor.js');
	const Review = require('./components/Review.js');

	const editor = new Editor();
	const review = new Review();

	/*  ===================================================
		Watchers
		=================================================== */

	const StretchTextareas = require('./watchers/stretch-textareas.js');
	const stretchTextareas = new StretchTextareas();
})();