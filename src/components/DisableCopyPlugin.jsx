// disableCopyPlugin.js
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class DisableCopyPluginpage extends Plugin {
  init() {
    const editor = this.editor;

    // Disable text selection
    editor.editing.view.document.on('selectionChange', (event, data) => {
      if (data) {
        data.preventDefault();
      }
    });

    // Disable copying
    editor.ui.view.listenTo(editor.ui, 'beforeCopy', (event) => {
      event.stop();
    });
  }
}
