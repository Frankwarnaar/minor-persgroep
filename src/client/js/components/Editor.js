class Editor {
	constructor() {
		this.container = document.getElementById('editor');
		if (this.container) {
			this.createEditor();
		}
	}

	createEditor() {
		this.editorParent = this.container.parentElement;
		this.textArea = document.createElement('textarea');
		this.textArea.setAttribute('name', 'content');
		this.textArea.setAttribute('hidden', 'true');

		this.editorParent.appendChild(this.textArea);

		this.editor = new Quill('#editor', {
			theme: 'snow'
		});
		this.fillTextArea();

		this.editor.on('text-change', this.fillTextArea.bind(this));
	}

	fillTextArea() {
		const content = this.container.children[0].innerHTML;
		this.textArea.value = content;
		console.log(this.textArea.value);
	}
}

module.exports = Editor;