import React, { useState } from 'react';
import './StickyNote.css';

export default function StickyNote({ note, onClose, index }) {
  const email = localStorage.getItem('email');
  const [currentNotes, setCurrentNotes] = useState(note.attributes.contents);
  console.log(currentNotes) 

  const handleNoteChange = (index, newValue) => {
    setCurrentNotes(prevNotes => {
      const newNotes = [...prevNotes];
      newNotes[index] = newValue;
      return newNotes;
    });
  };

  return (
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
            value={note}
            onChange={(e) => handleNoteChange(index, e.target.value)}
          ></textarea>
        </div>
    </div>
  );
}

