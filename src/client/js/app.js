(() => {
	document.body.classList.remove('no-js');

	/*  ===================================================
		Components
		=================================================== */

	const Editor = require('./components/Editor.js');
	const Review = require('./components/Review.js');
	const Notifications = require('./components/Notifications.js');

	new Editor();
	new Review();
	new Notifications();

	/*  ===================================================
		Watchers
		=================================================== */

	const StretchTextareas = require('./watchers/stretch-textareas.js');

	new StretchTextareas();
})();