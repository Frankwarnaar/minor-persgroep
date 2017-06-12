const StretchTextareas = require('../watchers/stretch-textareas.js');

const stretchTextareas = new StretchTextareas();

class Review {
	constructor() {
		this.$article = document.querySelector('[data-review=true]');
		this.$review = document.getElementsByClassName('review-form')[0];
		this.$closeReview = document.getElementById('close-review');
		this.$reviewElement = document.querySelector('[name=review-element]');
		this.$reviewContent = document.querySelector('[name=review]');
		this.history = {};

		this.init();
	}

	init() {
		if (this.$article) {
			this.originalContent = this.$article.innerHTML;
			this.showEl(this.$review, false);
			this.showEl(this.$closeReview, true);

			this.setupReviewButtons();
			this.bindEvents();
		}
	}

	setupReviewButtons() {
		this.$articleElements = document.querySelectorAll('[data-child]');

		this.$reviewButtons = [...this.$articleElements].map(child => {
			const button = document.createElement('button');
			const img = document.createElement('img');

			img.setAttribute('src', '/img/icons/review.svg');
			img.setAttribute('alt', 'review');
			button.appendChild(img);
			child.appendChild(button);

			return button;
		});
	}

	bindEvents() {
		if (this.$closeReview) {
			this.$closeReview.addEventListener('click', this.closeReview.bind(this));
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
		this.removeSelection();
		$parent.classList.add('highlight');

		this.$reviewElement.value = $parent.getAttribute('data-child');
		this.previousParent = $parent;
	}

	removeSelection() {
		[...this.$articleElements].forEach($element => {
			$element.classList.remove('highlight');
		});
	}

	setReviewContent($element) {
		this.$reviewContent.value = this.history[$element] || '';
	}

	storeReviewContent() {
		const $selectedElement = document.getElementsByClassName('highlight')[0];
		this.history[$selectedElement.getAttribute('data-child')] = this.$reviewContent.value;
	}

	positionReview($el) {
		const windowWidth = window.innerWidth;
		const articleWidth = this.$article.offsetWidth;
		const breakpoint = 968;

		const yPosition = windowWidth > breakpoint ? $el.offsetTop : $el.offsetTop + $el.offsetHeight;
		const width = windowWidth > breakpoint ? `calc(${windowWidth - articleWidth}px - 2rem - ((100vw - 40em) / 5))` : 'calc(100vw - 2rem)';

		this.$review.setAttribute('data-position', true);
		this.$review.setAttribute('style', `top: ${yPosition}px;
		width: ${width}`);

		this.showEl(this.$review, true);
	}

	closeReview(e) {
		this.showEl(this.$review, false);
		this.removeSelection();
		e.preventDefault();
	}
}

module.exports = Review;