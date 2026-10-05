import React from 'react'
function Button({ title, onClick, active }) {
  return (
    <button
      className={`editor-tab-button ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
}

export default Button;