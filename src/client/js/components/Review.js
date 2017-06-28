const getPosition = require('../utils/getPosition.js');

class Review {
	constructor() {
		this.$article = document.querySelector('[data-align-reviews=true]') || document.getElementsByClassName('ql-editor')[0];
		this.$review = document.getElementsByClassName('review-form')[0];
		this.$closeReviews = document.querySelectorAll('[data-close-review]');
		this.$articleElements = document.querySelectorAll('[data-child]');
		this.$reviewElement = document.querySelector('[name=review-element]');
		this.$reviewContent = document.querySelector('[name=review]');
		this.$reviews = document.querySelectorAll('.review[data-element]');
		this.history = {};

		this.init();
	}

	init() {
		if (this.$article) {
			this.originalContent = this.$article.innerHTML;

			if (this.$article.classList.contains('ql-editor')) {
				this.setupEditorButtons();
			} else {
				this.setupReviewButtons('review');
			}

			if (this.$article.getAttribute('data-align-reviews') === 'true') {
				this.setupReviewContainers();
			}

			if (this.$article.getAttribute('data-review') === 'true') {
				this.setupReviewButtons('form');
			}

			this.bindEvents();
		}

		if (this.$review) {
			this.showEl(this.$review, false);
		}
		if (this.$reviews) {
			[...this.$reviews].forEach($review => {
				if (!$review.hasAttribute('data-handled')) {
					if (this.$article.classList.contains('ql-editor')) {
						this.positionReview($review);
					} else {
						this.transferReview($review);
					}
				}
			});
		}
	}

	setupReviewContainers() {
		[...this.$articleElements].forEach($element => {
			const $container = document.createElement('div');
			const $button = document.createElement('button');
			$button.innerHTML = 'X';
			$button.addEventListener('click', this.closeContainer.bind(this, $container));
			$container.classList.add('reviews-wrapper');
			$container.classList.add('hidden');
			$container.appendChild($button);
			$element.appendChild($container);
		});
	}

	setupReviewButtons(type) {
		this[`$${type}Buttons`] = [...this.$articleElements].map($child => {
			const $button = document.createElement('button');
			$button.classList.add('btn--review');

			switch (type) {
				case 'review':
					const dataChild = $child.getAttribute('data-child');
					const $reviews = document.querySelectorAll(`[data-element="${dataChild}"]:not([data-handled])`);
					const count = $reviews.length;
					if (count > 0) {
						$button.innerHTML = $reviews.length;
					}
					$button.setAttribute('data-show-reviews', 'true');
					$button.setAttribute('data-review-element', dataChild);
					$button.setAttribute('title', 'Aantal reviews');
					break;
				default:
					const $img = document.createElement('img');

					$img.setAttribute('src', '/img/icons/review.svg');
					$img.setAttribute('alt', 'review');

					$button.setAttribute('title', 'Schrijf nieuwe review');
					$button.appendChild($img);
					$button.setAttribute('data-show-review-form', 'true');
			}

			if (!$button.innerHTML) {
				this.showEl($button, false);
			}
			$child.appendChild($button);

			return $button;
		});
	}

	setupEditorButtons() {
		const $title = document.querySelector('[data-child="title"]');
		const $children = [...document.querySelectorAll('.ql-editor > *')];
		$children.push($title);

		this.$reviewButtons = [...$children].map(($child, i) => {
			const $button = document.createElement('button');
			const dataChild = $child.getAttribute('data-child') || i;

			const $reviews = document.querySelectorAll(`[data-element="${dataChild}"]:not([data-handled])`);
			const count = $reviews.length;

			$button.classList.add('btn--review');
			if (count > 0) {
				$button.innerHTML = $reviews.length;
				$button.setAttribute('data-show-reviews', 'true');
				$button.setAttribute('data-element', dataChild);
			}

			if ($button.innerHTML) {
				document.querySelector('[data-open-reviews]').appendChild($button);
				this.positionReview($button, true);
			}

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

		if (this.$formButtons) {
			this.$formButtons.forEach($button => {
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

	onReviewButtonClick($button, $parent) {
		const dataElement = $button.getAttribute('data-element');
		if (dataElement) {
			$parent = document.querySelector('.ql-editor').children[dataElement];
		} else {
			$parent = $parent.classList ? $parent : $button.parentElement;
		}

		if ($button.hasAttribute('data-show-review-form')) {
			this.showReviewForm($parent);
		} else {
			this.showReviews($parent, dataElement || $parent.getAttribute('data-child'));
		}
	}

	showReviewForm($parent) {
		this.setReviewContent($parent.getAttribute('data-child'));

		this.positionReview($parent);

		$parent.classList.toggle('highlight');

		this.$reviewElement.value = $parent.getAttribute('data-child');

		if (this.$previousParent !== $parent) {
			this.showEl(this.$review, true);
		} else {
			this.showEl(this.$review, this.$review.classList.contains('hidden'));
		}

		this.$previousParent = $parent;
	}

	showReviews($parent, dataChild) {
		this.removeSelection();
		if ($parent) {
			$parent.classList.add('highlight');
		}
		const $reviewsWrapper = document.querySelector(`[data-child="${dataChild}"] .reviews-wrapper`);
		if ($reviewsWrapper) {
			this.showEl($reviewsWrapper, true);
		} else {
			const $reviews = document.querySelectorAll(`[data-element="${dataChild}"]`);
			[...$reviews].forEach($review => this.showEl($review, true));
		}
	}

	removeSelection() {
		const $editor = document.getElementsByClassName('ql-editor')[0];
		if (this.$articleElements) {
			[...this.$articleElements].forEach($element => {
				$element.classList.remove('highlight');
			});
		}
		if ($editor) {
			if ($editor.children) {
				[...$editor.children].forEach($element => {
					$element.classList.remove('highlight');
				});
			}
		}
	}

	setReviewContent($element) {
		this.$reviewContent.value = this.history[$element] || '';
	}

	storeReviewContent() {
		const $selectedElement = document.getElementsByClassName('highlight')[0];
		this.history[$selectedElement.getAttribute('data-child')] = this.$reviewContent.value;
	}

	transferReview($review) {
		const target = $review.getAttribute('data-element');
		if (target) {
			const $target = document.querySelector(`[data-child="${target}"] .reviews-wrapper`);
			$review.parentElement.removeChild($review);
			$target.appendChild($review);
		}
	}

	positionReview($review, isButton) {
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
			const yPosition = windowWidth > breakpoint || isButton ? getPosition($target).y : getPosition($target).y +  $target.offsetHeight;
			const width = windowWidth > breakpoint ? `calc(${windowWidth - articleWidth}px - 2rem - ((100vw - 40rem) / 5))` : 'calc(100vw - 2rem)';

			$review.setAttribute('data-position', true);
			$review.setAttribute('data-is-button', true);
			$review.setAttribute('style', `top: ${yPosition}px; ${!isButton ? 'width: ' + width : ''}`);
		}

		if (reviewIsTarget && `#${$review.getAttribute('id')}` !== window.location.hash && !isButton) {
			this.showEl($review, false);
		}
	}

	closeReview(e) {
		const $parent = e.target.parentElement;
		this.showEl($parent, false);
		if (!document.querySelector(`.review[data-element="${$parent}"]:not(.hidden)`)) {
			this.removeSelection();
		}
		e.preventDefault();
	}

	closeContainer($container) {
		this.showEl($container, false);
		$container.parentElement.classList.remove('highlight');
	}
}

module.exports = Review;