(() => {
	document.body.classList.remove('no-js');

	class App {
		constructor() {
			const $nav = document.getElementsByClassName('navigation')[0];

			this.userId = $nav.getAttribute('data-user-id');

			/*  ===================================================
				Components
				=================================================== */

			const Editor = require('./components/Editor.js');
			const Review = require('./components/Review.js');

			new Editor();
			new Review();

			/*  ===================================================
				Watchers
				=================================================== */

			const Notifications = require('./watchers/Notifications.js');
			const StretchTextareas = require('./watchers/stretch-textareas.js');
			const ReviewsWatcher = require('./watchers/Reviews');

			new Notifications(this);
			new StretchTextareas();
			new ReviewsWatcher(this);
		}
	}

	new App();
})();