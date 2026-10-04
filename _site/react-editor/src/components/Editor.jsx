import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';

// Changed 'mdnLike' to 'eclipse' and lowercase 'noctisLilac'
import { dracula, material, eclipse, tokyoNight, noctisLilac } from '@uiw/codemirror-themes-all';

const Editor = ({ language, value, setEditorState }) => {
  const [theme, setTheme] = useState('dracula');

  const getLanguageExtension = () => {
    if (language === 'xml') return html();
    if (language === 'css') return css();
    return javascript();
  };

  const getThemeExtension = () => {
    switch (theme) {
      case 'material': return material;
      case 'eclipse': return eclipse;
      case 'tokyo-night': return tokyoNight;
      case 'noctis-lilac': return noctisLilac;
      default: return dracula;
    }
  };

  return (
    <div className="editor-container" style={{ padding: '10px' }}>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="themes">Choose a theme: </label>
        <select 
          id="themes"
          value={theme} 
          onChange={(el) => setTheme(el.target.value)}
        >
          <option value="dracula">Dracula</option>
          <option value="material">Material</option>
          <option value="eclipse">Eclipse (Light)</option>
          <option value="tokyo-night">Tokyo Night</option>
          <option value="noctis-lilac">Noctis Lilac</option>
        </select>
      </div>

      <CodeMirror
        value={value}
        height="350px"
        theme={getThemeExtension()}
        extensions={[getLanguageExtension()]}
        onChange={(val) => setEditorState(val)}
        basicSetup={{
          lineNumbers: true,
          lineWrapping: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
        }}
      />
    </div>
  );
};

export default Editor;
