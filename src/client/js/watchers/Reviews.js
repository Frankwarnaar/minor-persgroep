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
			const {reviews, finishedReview} = data;
			if (reviews) {
				reviews.forEach(this.updateReview.bind(this));
				this.updateCountButtons();
			} else {
				const $unfinishedReviews = document.querySelectorAll('.review[data-unfinished]');
				[...$unfinishedReviews].forEach($review => {
					this.$reviewList.removeChild($review);
				});
			}

			if (finishedReview) {
				const $newReview = this.createReview(finishedReview, true).$review;
				const $closeButton = $newReview.children[2];

				$closeButton.addEventListener('click', this.app.review.closeReview.bind(this.app.review));
				this.$reviewList.appendChild($newReview);
				this.app.review.positionReview($newReview);
				this.updateCountButtons();
			}
		}
	}

	updateReview(review) {
		const $existingReview = document.querySelector([`[data-reviewer="${review.userId}"][data-element="${review.element}"]`]);
		if (!$existingReview && review.review.length > 0) {
			const $review = this.createReview(review).$review;
			const $closeButton = $review.children[2];

			$closeButton.addEventListener('click', this.app.review.closeReview.bind(this.app.review));

			this.app.review.positionReview($review, false);
			this.$reviewList.appendChild($review);
		} else if (review.review.length > 0) {
			$existingReview.innerHTML = this.createReview(review).content;
			$existingReview.children[0].addEventListener('click', this.app.review.closeReview.bind(this.app.review));
		} else if ($existingReview) {
			this.$reviewList.removeChild($existingReview);
		}
	}

	updateCountButtons() {
		const $buttons = document.querySelectorAll('button[data-review-element]');
		[...$buttons].forEach($button => {
			const dataElement = $button.getAttribute('data-review-element');
			const $finishedReviews = document.querySelectorAll(`[data-element="${dataElement}"]:not([data-unfinished]):not([data-handled])`);
			const finishedCount = $finishedReviews.length;

			const $unfinishedReviews = document.querySelectorAll(`[data-element="${dataElement}"][data-unfinished]:not([data-handled])`);
			const unfinishedCount = $unfinishedReviews.length;

			if (unfinishedCount > 0) {
				$button.innerHTML = `${finishedCount} (${unfinishedCount})`;
				$button.setAttribute('data-has-unfinished-reviews', 'true');
				$button.classList.remove('hidden');
			} else if (finishedCount > 0) {
				$button.innerHTML = finishedCount;
				$button.classList.remove('hidden');
				$button.removeAttribute('data-has-unfinished-reviews');
			} else {
				$button.classList.add('hidden');
				$button.removeAttribute('data-has-unfinished-reviews');
			}
		});
	}

	createReview(review, finished) {
		const $reviewItem = document.createElement('li');
		let content = `
		<h3>Review</h3>
		<date>${review.date ? new Date(review.date).toLocaleString() : 'Nu'}</date>
		<button data-close-review>X</button>
		<p>${review.review}</p>
		<p>type: ${review.type}</p>
		`;

		$reviewItem.classList.add('review');
		$reviewItem.setAttribute('data-element', review.element);
		$reviewItem.setAttribute('data-reviewer', review.userId);

		if (!finished) {
			$reviewItem.setAttribute('data-unfinished', 'true');
			content += '<p><em>Deze review wordt momenteel geschreven</em></p>';
		}
		content += '<a href="/tour/review">Wat is dit?</a>';

		$reviewItem.insertAdjacentHTML('beforeend', content);
		return ({
			$review: $reviewItem,
			content
		});
	}
}

module.exports = Reviews;