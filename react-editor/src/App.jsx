import React, { useState, useEffect } from 'react'; // Make sure useEffect is imported
import './App.css';
import Button from './components/Button';
import Editor from './components/Editor';

function App() {
  const [openedEditor, setOpenedEditor] = useState('html');
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [srcDoc, setSrcDoc] = useState(''); // Stores compiled output
  const [logs,setLogs] = useState([]);


  const onTabClick = (editorName) => {
    setOpenedEditor(editorName);
  };

  // Compile inputs into an HTML document with a 250ms debounce
  useEffect(() => {

    setLogs([]);

    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <style>${css}</style>
            <script>
            const _log = console.log;
            console.log = (...args) => {
              _log(...args); // Keep regular browser console logging active
              window.parent.postMessage({ type: 'CONSOLE_LOG', data: args.join(' ') }, '*');
            };

            // Catch runtime JavaScript execution errors too!
            window.onerror = function(message) {
              window.parent.postMessage({ type: 'CONSOLE_ERROR', data: message }, '*');
              return false;
            };
          </script>
          </head>
          <body>
            ${html}
            <script>${js}</script>
          </body>
        </html>
      `);
    }, 250);

    return () => clearTimeout(timeout);
  }, [html, css, js]);

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
      <p>Welcome to the editor!</p>
      <div className="tab-button-container">
        <Button title="HTML" onClick={() => onTabClick('html')} />
        <Button title="CSS" onClick={() => onTabClick('css')} />
        <Button title="Javascript" onClick={() => onTabClick('js')} />
      </div>

      <div className="editors-wrapper">
        {openedEditor === 'html' ? (
          <Editor language="xml" value={html} setEditorState={setHtml} />
        ) : openedEditor === 'css' ? (
          <Editor language="css" value={css} setEditorState={setCss} />
        ) : (
          <Editor language="javascript" value={js} setEditorState={setJs} />
        )}
      </div>

      {/* Modern Live Iframe Output Preview Section */}
      <div className="output-container" style={{ marginTop: '20px', height: '40vh', borderTop: '2px solid #ccc' }}>
        <iframe
          srcDoc={srcDoc}
          title="output-preview"
          sandbox="allow-scripts"
          frameBorder="0"
          width="100%"
          height="100%"
        />
      </div>
      {/* UPDATED CUSTOM CONSOLE LOG TERMINAL COMPONENT */}
      <div className="console-container" style={{
        background: '#1e1e1e',
        color: '#00ff00',
        fontFamily: 'monospace',
        padding: '10px',
        height: '150px',
        overflowY: 'auto',
        borderTop: '2px solid #333',
        textAlign: 'left'
      }}>
        {/* Header with Title and Clear Button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #333', 
          paddingBottom: '5px', 
          marginBottom: '5px' 
        }}>
          <span style={{ color: '#aaa', fontWeight: 'bold' }}>Console Output</span>
          <button 
            onClick={() => setLogs([])}
            style={{
              background: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              padding: '3px 8px',
              cursor: 'pointer',
              fontSize: '11px',
              fontFamily: 'sans-serif'
            }}
            onMouseOver={(e) => e.target.style.background = '#444'}
            onMouseOut={(e) => e.target.style.background = '#333'}
          >
            Clear Console
          </button>
        </div>

        {/* Log Output List */}
        {logs.length === 0 ? (
          <span style={{ color: '#666', fontStyle: 'italic' }}>Console is clear. Try writing console.log() in JS tab.</span>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={{ 
              color: log.type === 'error' ? '#ff3333' : '#00ff00',
              marginBottom: '4px',
              whiteSpace: 'pre-wrap'
            }}>
              {log.type === 'error' ? '❌ ' : '❯ '} {log.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
