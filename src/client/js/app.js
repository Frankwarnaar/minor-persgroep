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
			this.review = new Review();

			/*  ===================================================
				Watchers
				=================================================== */

			const StretchTextareas = require('./watchers/stretch-textareas.js');
			const Notifications = require('./watchers/Notifications.js');
			const ReviewsWatcher = require('./watchers/Reviews');

			this.stretchTextareas = new StretchTextareas();
			new Notifications(this);
			new ReviewsWatcher(this);
		}
	}

	new App();
})();