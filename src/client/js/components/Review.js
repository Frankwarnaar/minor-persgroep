const StretchTextareas = require('../watchers/stretch-textareas.js');

const stretchTextareas = new StretchTextareas();

class Review {
	constructor() {
		this.$article = document.querySelector('[data-review=true]');
		this.$review = document.getElementsByClassName('review-form')[0];
		this.$reviewQuote = document.querySelector('[name=content]');
		this.$closeReview = document.getElementById('close-review');

		this.init();
	}

	init() {
		if (this.$article) {
			this.bindEvents();
			this.originalContent = this.$article.innerHTML;
			this.showEl(this.$review, false);
			this.showEl(this.$closeReview, true);
		}
	}

	bindEvents() {
		if (window.getSelection) {
			document.addEventListener('selectionchange', this.surroundSelection.bind(this));
		}
		if (this.$closeReview) {
			this.$closeReview.addEventListener('click', this.closeReview.bind(this));
		}
	}

	showEl($el, show) {
		$el.classList[show ? 'remove' : 'add']('hidden');
	}

	// Source surroundSelection method: http://jsfiddle.net/VRcvn/
	surroundSelection() {
		this.selection = window.getSelection().toString();

		if (this.selection !== this.prevSelection && this.selection.length > 0) {
			if (this.timeout) {
				clearTimeout(this.timeout);
			}

			this.timeout = setTimeout((() => {
				const span = document.createElement('span');

				if (window.getSelection) {
					const selection = window.getSelection();
					if (selection.rangeCount) {
						const range = selection.getRangeAt(0).cloneRange();
						range.surroundContents(span);
						selection.removeAllRanges();
						selection.addRange(range);
					}
				}
				this.prevSelection = this.selection;
				if (this.$review) {
					this.positionReview(span);
					this.$reviewQuote.value = span.innerHTML;
					stretchTextareas.autoGrow(this.$reviewQuote);
				}
			}).bind(this), 1000);
		}
	}

	positionReview(span) {
		this.$review.setAttribute('data-position', true);
		const yPosition = span.getBoundingClientRect().top;
		this.$review.setAttribute('style', `top: ${yPosition + 20}px`);
		this.showEl(this.$review, true);
	}

	closeReview(e) {
		this.showEl(this.$review, false);
		e.preventDefault();
		this.$article.innerHTML = this.originalContent;
	}
}

module.exports = Review;