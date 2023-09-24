import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5';
// import '@ckeditor/ckeditor5-theme-lark/theme/lark.css';


export default defineConfig({
  plugins: [
    react(),
    ckeditor5({
      language: 'en',
      toolbar: {
        items: [
          "exportPDF",
          "exportWord",
          "|",
          "findAndReplace",
          "selectAll",
          "|",
          "heading",
          "|",
          "bold",
          "italic",
          "strikethrough",
          "underline",
          "code",
          "subscript",
          "superscript",
          "removeFormat",
          "|",
          "bulletedList",
          "numberedList",
          "todoList",
          "|",
          "outdent",
          "indent",
          "|",
          "undo",
          "redo",
          "-",
          "fontSize",
          "fontFamily",
          "fontColor",
          "fontBackgroundColor",
          "highlight",
          "|",
          "alignment",
          "|",
          "link",
          "imageUpload", // Add the image upload tool
          "blockQuote",
          "insertTable",
          "mediaEmbed",
          "codeBlock",
          "htmlEmbed",
          "|",
          "specialCharacters",
          "horizontalLine",
          "pageBreak",
          "|",
          "textPartLanguage",
          "|",
          "sourceEditing",
        ],
        shouldNotGroupWhenFull: true,
      },
      
      image: {
        toolbar: ["imageTextAlternative", "|", "imageStyle:full", "imageStyle:side"],
      },
      fontSize: {
        options: [9, 10, 11, 12, 14, 16, 18, 20, 24],
      },
      alignment: {
        options: ["left", "center", "right", "justify"],
      },
    }
    ),
  ],
  envDir: './src/',
  optimizeDeps: {
    include: ['quill', 'react-quill', 'quill-table-module'],
  },
});
