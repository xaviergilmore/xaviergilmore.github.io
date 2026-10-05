import React, { useState, useEffect } from 'react';
import './App.css';
import Button from './components/Button';
import Editor from './components/Editor';

function App() {
  const [openedEditor, setOpenedEditor] = useState('html');
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [srcDoc, setSrcDoc] = useState(''); 
  const [logs, setLogs] = useState([]);
  const [hidePreview, setHidePreview] = useState(false);

  // 1. Read layout properties safely after DOM has painted
  useEffect(() => {
    const containerNode = document.getElementById('react-editor-root');
    if (containerNode) {
      setHidePreview(containerNode.getAttribute('data-hide-preview') === 'true');
    }
  }, []);

  const onTabClick = (editorName) => {
    setOpenedEditor(editorName);
  };

  // Compile inputs into an HTML document with a 250ms debounce
useEffect(() => {
  const timeout = setTimeout(() => {

    // Clear output from the previous execution
    setLogs([]);

    setSrcDoc(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>

          <script>
            (function() {
              const _log = console.log;

              console.log = (...args) => {
                _log(...args);

                window.parent.postMessage({
                  type: 'CONSOLE_LOG',
                  data: args.join(' ')
                }, '*');
              };

              window.onerror = function(message) {
                window.parent.postMessage({
                  type: 'CONSOLE_ERROR',
                  data: message
                }, '*');

                return true;
              };
            })();
          </script>
        </head>

        <body>
          ${html}

          <script>
            ${js}
          </script>
        </body>
      </html>
    `);

  }, 250);

  return () => clearTimeout(timeout);

}, [html, css, js]);

  // Hook into cross-frame message bridges
  useEffect(() => {
    const handleConsoleMessage = (event) => {
      if (event.data && event.data.type === 'CONSOLE_LOG') {
        setLogs((prev) => [...prev, { type: 'log', text: event.data.data }]);
      }
      if (event.data && event.data.type === 'CONSOLE_ERROR') {
        setLogs((prev) => [...prev, { type: 'error', text: event.data.data }]);
      }
    };

    window.addEventListener('message', handleConsoleMessage);
    return () => window.removeEventListener('message', handleConsoleMessage);
  }, []);

  return (
    <div className="App">
      <div className={`sandbox-container ${hidePreview ? 'no-preview-layout' : ''}`}>
        <div className="tab-button-container">
          <Button title="HTML" onClick={() => onTabClick('html')} />
          <Button title="CSS" onClick={() => onTabClick('css')} />
          <Button title="Javascript" onClick={() => onTabClick('js')} />
        </div>
        
        <div className="top-row-container">
          <div className="editor-left">
            <div className="editors-wrapper">
              {openedEditor === 'html' ? (
                <Editor language="xml" value={html} setEditorState={setHtml} />
              ) : openedEditor === 'css' ? (
                <Editor language="css" value={css} setEditorState={setCss} />
              ) : (
                <Editor language="javascript" value={js} setEditorState={setJs} />
              )}
            </div>
          </div>

          {/* 3. Conditional Layout Engine Check */}
          {!hidePreview && (
            <div className="editor-right">
              <div className="output-container">
                <iframe
                  srcDoc={srcDoc}
                  title="output-preview"
                  sandbox="allow-scripts"
                  width="100%"
                  height="100%"
                  scrolling="yes"
                />
              </div>
            </div>
          )}
        </div>

        {/* 4. Refactored Code Terminal Tray */}
        <div className="console-container">
          <div className="console-header">
            <span className="console-title">Console Output</span>
            <button className="console-clear-btn" onClick={() => setLogs([])}>
              Clear Console
            </button>
          </div>

          <div className="console-log-area">
            {logs.length === 0 ? (
              <span className="console-placeholder">Console is clear. Try writing console.log() in JS tab.</span>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`console-line ${log.type === 'error' ? 'is-error' : 'is-log'}`}>
                  {log.type === 'error' ? '❌ ' : '❯ '} {log.text}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;


