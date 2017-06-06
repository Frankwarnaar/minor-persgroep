class StretchTextareas {
	constructor() {
		this.textareas = document.querySelectorAll('[data-stretch]');
		this.bindEvents();
	}

	bindEvents() {
		this.textareas.forEach(textarea => {
			textarea.addEventListener('input', this.autoGrow.bind(this, textarea));
		});
	}

	autoGrow(textarea) {
		textarea.style.height = '5px';
		textarea.style.height = `${textarea.scrollHeight + 5}px`;
	}
}

module.exports = StretchTextareas;