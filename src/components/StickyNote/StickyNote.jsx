import { useState, useRef, useEffect } from 'react';
import './StickyNote.css';

export default function StickyNote({ onClose }) {
  const [isDragging, setIsDragging] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const stickyNoteRef = useRef();

  useEffect(() => {
    function handleMouseUp() {
      setIsDragging(false);
    }

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  function handleMouseDown(e) {
    setIsDragging(true);
    setOffsetX(e.clientX - stickyNoteRef.current.getBoundingClientRect().left);
    setOffsetY(e.clientY - stickyNoteRef.current.getBoundingClientRect().top);
  }

  function handleMouseMove(e) {
    if (isDragging) {
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      stickyNoteRef.current.style.left = x + 'px';
      stickyNoteRef.current.style.top = y + 'px';
    }
  }

  return (
    <div className="note-page-container">
      <div className="new-note-container">
        <button className="sticky-btn">New Note +</button>
      </div>
      <div
        className="sticky-note-container"
        ref={stickyNoteRef}
        onMouseDown={handleMouseDown}
      >
        <div
          className="sticky-note-header"
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
        >
          <div>StickyNote</div>
          <div className="close" onClick={onClose}>
            &times;
          </div>
        </div>
        <textarea name="" id="" cols="17" rows="9"></textarea>
      </div>
    </div>
  );
}
