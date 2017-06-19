class Reviews {
	constructor(app) {
		this.app = app;
		this.$article = document.querySelector('[data-article-id]');
		this.$review = document.getElementsByClassName('review-form')[0];
		this.$reviewElement = document.querySelector('[name="review-element"]');
		this.$reviewContent = document.querySelector('[name="review"]');
		this.$reviewType = document.querySelector('[name="type"]');
		this.$reviewButtons = document.getElementsByClassName('button--review');

		if (this.$review && this.$article) {
			this.articleId = this.$article.getAttribute('data-article-id');
			this.init();
		}
	}

	init() {
		try {
			this.socket = new WebSocket(`ws://${window.location.hostname}:8000`, 'echo-protocol');
			this.socket.onopen = this.setupSocket.bind(this);
			this.socket.onmessage = this.handleMessage.bind(this);
			this.bindEvents();
		} catch (e) {
			console.log(e);
		}
	}

	bindEvents() {
		this.$reviewContent.addEventListener('input', this.onInputDebounced.bind(this));
		this.$reviewType.addEventListener('input', this.onInput.bind(this));
	}

	setupSocket() {
		const info = {
			articleId: this.$article.getAttribute('data-article-id'),
			userId: this.app.userId
		};
		console.log(info);
		this.socket.send(JSON.stringify(info));
	}

	onInputDebounced() {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(this.onInput.bind(this), 400);
	}

	onInput() {
		const review = {
			user: this.app.userId,
			articleId: this.articleId,
			element: this.$reviewElement.value,
			review: this.$reviewContent.value,
			type: this.$reviewType.value
		};

		this.socket.send(JSON.stringify({review}));
	}

	handleMessage({data}) {
		data = JSON.parse(data);
		if (data) {
			console.log(data);
			const reviews = data.reviews;
			if (reviews) {
				console.log(reviews);
				// this.setNotificationsCount(count);
			}
		}
	}
}

module.exports = Reviews;