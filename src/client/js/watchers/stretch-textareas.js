class StretchTextareas {
	constructor() {
		this.$textareas = document.querySelectorAll('[data-stretch]');
		this.init();
	}

	init() {
		this.$textareas.forEach($textarea => {
			$textarea.addEventListener('input', this.autoGrow.bind(this, $textarea));
		});
	}

	autoGrow($textarea) {
		$textarea.classList.add('stretched');
		$textarea.style.height = `${$textarea.scrollHeight}px`;
	}
}

module.exports = StretchTextareas;