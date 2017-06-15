const StretchTextareas = require('../watchers/stretch-textareas.js');
const getPosition = require('../utils/getPosition.js');

new StretchTextareas();

class Review {
	constructor() {
		this.$article = document.querySelector('[data-align-reviews=true]') || document.getElementsByClassName('ql-editor')[0];
		this.$review = document.getElementsByClassName('review-form')[0];
		this.$closeReviews = document.querySelectorAll('[data-close-review]');
		this.$reviewElement = document.querySelector('[name=review-element]');
		this.$reviewContent = document.querySelector('[name=review]');
		this.$reviews = document.querySelectorAll('.review[data-element]');
		this.history = {};

		this.init();
	}

	init() {
		if (this.$article) {
			this.originalContent = this.$article.innerHTML;

			if (this.$article.getAttribute('data-review') === 'true') {
				this.setupReviewButtons();
			}

			this.bindEvents();
		}

		if (this.$review) {
			this.showEl(this.$review, false);
		}
		if (this.$reviews) {
			[...this.$reviews].forEach($review => {
				if (!$review.hasAttribute('data-handled')) {
					this.positionReview($review);
				}
			});
		}
		if (this.$closeReviews) {
			[...this.$closeReviews].forEach($closeReview => {
				if ($closeReview.parentElement.hasAttribute('data-position')) {
					this.showEl($closeReview, true);
				}
			});
		}
	}

	setupReviewButtons() {
		this.$articleElements = document.querySelectorAll('[data-child]');

		this.$reviewButtons = [...this.$articleElements].map($child => {
			const $button = document.createElement('button');
			const $img = document.createElement('img');

			$button.classList.add('btn--review');

			$img.setAttribute('src', '/img/icons/review.svg');
			$img.setAttribute('alt', 'review');

			$button.appendChild($img);
			$child.appendChild($button);

			return $button;
		});
	}

	bindEvents() {
		if (this.$closeReviews) {
			[...this.$closeReviews].forEach($closeReview => {
				$closeReview.addEventListener('click', this.closeReview.bind(this));
			});
		}

		if (this.$reviewButtons) {
			this.$reviewButtons.forEach($button => {
				$button.addEventListener('click', this.onReviewButtonClick.bind(this, $button));
			});
		}

		if (this.$reviewContent) {
			this.$reviewContent.addEventListener('input', this.storeReviewContent.bind(this));
		}
	}

	showEl($el, show) {
		$el.classList[show ? 'remove' : 'add']('hidden');
	}

	onReviewButtonClick($button) {
		const $parent = $button.parentElement;

		this.setReviewContent($parent.getAttribute('data-child'));

		this.positionReview($parent);
		this.showEl(this.$review, true);
		this.removeSelection();
		$parent.classList.add('highlight');

		this.$reviewElement.value = $parent.getAttribute('data-child');
		this.previousParent = $parent;
	}

	removeSelection() {
		if (this.$articleElements) {
			[...this.$articleElements].forEach($element => {
				$element.classList.remove('highlight');
			});
		}
	}

	setReviewContent($element) {
		this.$reviewContent.value = this.history[$element] || '';
	}

	storeReviewContent() {
		const $selectedElement = document.getElementsByClassName('highlight')[0];
		this.history[$selectedElement.getAttribute('data-child')] = this.$reviewContent.value;
	}

	positionReview($review) {
		const windowWidth = window.innerWidth;
		const articleWidth = this.$article.classList.contains('ql-editor') ? this.$article.offsetWidth + (2 * 16) :  this.$article.offsetWidth;
		const breakpoint = 993;
		const reviewIsTarget = $review.hasAttribute('data-element');
		let $target = reviewIsTarget ? document.querySelector(`[data-child='${$review.getAttribute('data-element')}']`) : $review;

		if (!$target) {
			$target = document.getElementsByClassName('ql-editor')[0].children[$review.getAttribute('data-element')];
		}

		$review = reviewIsTarget ? $review : this.$review;

		if ($target) {
			const yPosition = windowWidth > breakpoint ? getPosition($target).y : getPosition($target).y +  $target.offsetHeight;
			const width = windowWidth > breakpoint ? `calc(${windowWidth - articleWidth}px - 2rem - ((100vw - 40em) / 5))` : 'calc(100vw - 2rem)';

			$review.setAttribute('data-position', true);
			$review.setAttribute('style', `top: ${yPosition}px; width: ${width}`);
		}
	}

	closeReview(e) {
		this.showEl(e.target.parentElement, false);
		this.removeSelection();
		e.preventDefault();
	}
}

module.exports = Review;