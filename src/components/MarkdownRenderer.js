import { marked } from "marked";
import prism from "prismjs";

// Configure marked for syntax highlighting
marked.setOptions({
  highlight: function (code, lang) {
    if (prism.languages[lang]) {
      return prism.highlight(code, prism.languages[lang], lang);
    } else {
      return code;
    }
  },
});

const MarkdownRenderer = ({ content }) => {
  const parsedContent = marked(content);
  
  return (
    <div dangerouslySetInnerHTML={{ __html: parsedContent }} />
  );
};

export default MarkdownRenderer; 