class Review {
	constructor() {
		this.article = document.querySelector('[data-review]');
		if (this.article) {
			this.bindEvents();
		}
	}

	bindEvents() {
		document.addEventListener('selectionchange', this.onSelectionChange.bind(this));
	}

	onSelectionChange(e) {
		const selection = {
			text: window.getSelection().toString(),
			$el: window.getSelection().baseNode.parentElement
		};
		// console.log(selection);
	}
}

module.exports = Review;