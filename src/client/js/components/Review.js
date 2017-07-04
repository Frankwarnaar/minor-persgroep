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
		this.$reviewList = document.querySelector('[data-open-reviews]');
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

			if (this.$article.getAttribute('data-align-reviews') === 'true' || this.$article.classList.contains('ql-editor')) {
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
					this.transferReview($review);
				}
			});
		}
	}

	setupReviewContainers() {
		if (this.$articleElements.length > 1) {
			[...this.$articleElements].forEach($element => {
				const $container = this.createContainer();
				$element.appendChild($container);
			});
		} else if (this.$article.classList.contains('ql-editor')) {
			const $children = [...document.querySelectorAll('[data-child="title"]'), ...this.$article.children];
			[...$children].forEach(($child, i) => {
				const $container = this.createContainer();
				$container.setAttribute('data-review-container-child', i === 0 ? 'title' : i - 1);
				this.$reviewList.appendChild($container);
				this.positionEl($container);
			});
		}
	}

	createContainer() {
		const $container = document.createElement('div');
		const $button = document.createElement('button');
		$button.innerHTML = 'X';
		$button.addEventListener('click', this.closeContainer.bind(this, $container));
		$container.classList.add('reviews-wrapper');
		$container.classList.add('hidden');
		$container.appendChild($button);

		return $container;
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
				this.$reviewList.appendChild($button);
				this.positionEl($button, true);
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

		this.positionEl($parent);

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
		const $reviewsWrapper = document.querySelector(`[data-child="${dataChild}"] .reviews-wrapper`) || document.querySelector(`[data-review-container-child="${dataChild}"]`);
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
			const $target = document.querySelector(`[data-child="${target}"] .reviews-wrapper`) || document.querySelector(`[data-review-container-child="${target}"]`);
			$review.parentElement.removeChild($review);
			$target.appendChild($review);
		}
	}

	positionEl($element, isButton) {
		const windowWidth = window.innerWidth;
		const articleWidth = this.$article.classList.contains('ql-editor') ? this.$article.offsetWidth + (2 * 16) :  this.$article.offsetWidth;
		const breakpoint = 993;
		const elementIsTarget = $element.hasAttribute('data-element');
		let $target;

		if (elementIsTarget) {
			const targetAttribute = $element.getAttribute('data-element');
			$target = document.querySelector(`[data-child="${targetAttribute}"]`) || document.querySelector('.ql-editor').children[targetAttribute];
		} else if ($element.getAttribute('data-review-container-child')) {
			const targetAttribute = $element.getAttribute('data-review-container-child');
			$target = document.querySelector(`[data-child="${targetAttribute}"]`) || document.querySelector('.ql-editor').children[targetAttribute];
		} else {
			$target = $element;
			$element = this.$review;
		}

		if ($target) {
			const yPosition = windowWidth > breakpoint || isButton ? getPosition($target).y : getPosition($target).y +  $target.offsetHeight;
			const width = windowWidth > breakpoint ? `calc(${windowWidth - articleWidth}px - 2rem - ((100vw - 40rem) / 5))` : 'calc(100vw - 2rem)';

			$element.setAttribute('data-position', true);
			$element.setAttribute('data-is-button', true);
			$element.setAttribute('style', `top: ${yPosition}px; ${!isButton ? 'width: ' + width : ''}`);
		}

		if (elementIsTarget && `#${$element.getAttribute('id')}` !== window.location.hash && !isButton) {
			this.showEl($element, false);
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
		this.removeSelection();
	}
}

module.exports = Review;