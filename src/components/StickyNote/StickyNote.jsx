import React, { useState } from 'react';
import Draggable from "react-draggable";
import './StickyNote.css';

export default function StickyNote({ note, onClose, index }) {
  const [currentNotes, setCurrentNotes] = useState(note.attributes.contents);

  const handleNoteChange = (newValue) => {
    setCurrentNotes(newValue);
  };

  return (
    <Draggable>
      <div className="note-page-container">
          <div className="sticky-note-container" key={index}>
            <div className="sticky-note-header">
              <div className="close" onClick={onClose}>
                &times;
              </div>
            </div>
            <textarea
              name={`Sticky note ${note.id}`}
              id = {note.id}
              cols="17"
              rows="9"
              value={currentNotes[index]}
              onChange={(e) => handleNoteChange(e.target.value)}
            ></textarea>
          </div>
      </div>
    </Draggable>
  );
}

