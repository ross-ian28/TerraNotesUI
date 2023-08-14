import React, { useState } from 'react';
import './StickyNote.css';

export default function StickyNote({ note, onClose, index }) {
  const email = localStorage.getItem('email');
  const [currentNotes, setCurrentNotes] = useState(note.attributes.contents);
  console.log(currentNotes) 
  const [isPending, setIsPending] = useState(false);

  const handleNoteChange = (index, newValue) => {
    setCurrentNotes(prevNotes => {
      const newNotes = [...prevNotes];
      newNotes[index] = newValue;
      return newNotes;
    });
  };
  
  const addNewNote = async () => {
    setIsPending(true);
    try {
      const response = await fetch(`http://localhost:5000/api/v1/new_note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email
        }),
      });
  
      if (response.ok) {
        setIsPending(false);
        console.log(response)
      } else {
        setIsPending(false);
        const error = await response.json();
      }
    } catch (error) {
      setIsPending(false);
    }
  }

  return (
    <div className="note-page-container">
        <div className="new-note-container">
            <button className="sticky-btn" onClick={addNewNote}>
              New Note +
            </button>
            <button className="sticky-btn" onClick={addNewNote}>
              Creating Note +
            </button>
        </div>
      {currentNotes.map((note, index) => (
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
      ))}
    </div>
  );
}

