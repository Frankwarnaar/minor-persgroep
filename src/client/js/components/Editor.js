class Editor {
	constructor() {
		this.$container = document.getElementById('editor');
		this.$textarea = document.getElementById('editor-content');
		if (this.$container && Quill) {
			this.createEditor();
		}
	}

	createEditor() {
		this.editor = new Quill('#editor', {
			theme: 'snow'
		});
		this.$textarea.classList.add('hidden');
		this.editorParent = this.$container.parentElement;
		this.textArea = document.querySelector('[name="content"]');

		this.fillTextArea();

		this.editor.on('text-change', this.fillTextArea.bind(this));
	}

	fillTextArea() {
		const content = this.$container.children[0].innerHTML;
		const contentEl = document.createElement('html');
		contentEl.innerHTML = content;
		[...contentEl.getElementsByTagName('body')[0].children].forEach((child, i) => {
			child.setAttribute('data-child', i);
		});
		this.textArea.value = contentEl.getElementsByTagName('body')[0].innerHTML;
	}
}

module.exports = Editor;