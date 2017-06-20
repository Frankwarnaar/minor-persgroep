const Review = require('../components/Review');

const reviewComponent = new Review();

class Reviews {
	constructor(app) {
		this.app = app;
		this.$article = document.querySelector('[data-article-id]');
		this.$review = document.getElementsByClassName('review-form')[0];
		this.$reviewElement = document.querySelector('[name="review-element"]');
		this.$reviewContent = document.querySelector('[name="review"]');
		this.$reviewType = document.querySelector('[name="type"]');
		this.$reviewButtons = document.getElementsByClassName('button--review');
		this.$reviewList = document.getElementById('open-reviews');

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
		this.socket.send(JSON.stringify(info));
	}

	onInputDebounced() {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(this.onInput.bind(this), 400);
	}

	onInput() {
		const review = {
			userId: this.app.userId,
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
			const reviews = data.reviews;
			if (reviews) {
				reviews.forEach(this.updateReview.bind(this));
				// reviewComponent.setupReviewButtons('review');
			}
		}
	}

	updateReview(review) {
		const $existingReview = document.querySelector([`[data-reviewer="${review.userId}"][data-element="${review.element}"]`]);
		if (!$existingReview && review.review.length > 0) {
			const $review = this.createReview(review).$review;
			const $closeButton = $review.children[0];

			$closeButton.addEventListener('click', reviewComponent.closeReview.bind(reviewComponent));

			reviewComponent.positionReview($review, false);
			this.$reviewList.appendChild($review);
		} else if (review.review.length > 0) {
			$existingReview.innerHTML = this.createReview(review).content;
			$existingReview.children[0].addEventListener('click', reviewComponent.closeReview.bind(reviewComponent));
		} else {
			this.$reviewList.removeChild($existingReview);
		}
	}

	createReview(review) {
		const $reviewItem = document.createElement('li');
		const content = `
		<button data-close-review>X</button>
		<p>${review.review}</p>
		<span>type: ${review.type}</span>
		`;

		$reviewItem.classList.add('review');
		$reviewItem.setAttribute('data-unfinished', 'true');
		$reviewItem.setAttribute('data-element', review.element);
		$reviewItem.setAttribute('data-reviewer', review.userId);
		$reviewItem.insertAdjacentHTML('beforeend', content);

		return ({
			$review: $reviewItem,
			content
		});
	}
}

module.exports = Reviews;