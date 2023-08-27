import React, { useState, useCallback, useEffect } from 'react';
import Draggable from "react-draggable";
import './StickyNote.css';

export default function StickyNote({ note, onClose, index }) {
  const [currentNote, setCurrentNote] = useState(note.attributes.contents);
  const [x_position, setxPosition] = useState(note.attributes.x_position || 0);
  const [y_position, setyPosition] = useState(note.attributes.y_position || 0);
  const [errorMsg, setError] = useState('');

  useEffect(() => {
    setxPosition(note.attributes.x_position || 0);
    setyPosition(note.attributes.y_position || 0);
    }, [note]);

  const handleNoteChange = useCallback(async (newValue) => {
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/v1/edit_note`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: note.id,
          contents: newValue
        }),
      });

      if (!response.ok) {
        console.error("Failed to update note contents");
      }
    } catch (error) {
      setError("An unexpected error occurred while updating note");
    }
  }, [note.id]);

  const handleDragStop = async (position) => {
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/v1/edit_note_position`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: note.id,
          x_position: position.x,
          y_position: position.y
        }),
      });
      if (response.ok) {
        const responseData = await response.json();
        setxPosition(responseData.data.attributes.x_position);
        setyPosition(responseData.data.attributes.y_position);
      } else {
        console.error("Failed to update note position");
      }
    } catch (error) {
      setError("An unexpected error occurred while updating note position");
    }
  };
  
  const headerHeight = document.querySelector(".header").offsetHeight;
  return (
      <Draggable 
        defaultPosition={{ 
          x: x_position,
          y: y_position 
        }}
        onStop={(e, position) => handleDragStop(position)}
        // Stop sticky note from being dragged above the header
        bounds={() => {
          return { top: headerHeight, left: 0, right: 0, bottom: window.innerHeight - 70 };
        }} 
        > 
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
              value={currentNote}
              onChange={(e) => {
                setCurrentNote(e.target.value);
                handleNoteChange(e.target.value);


              }}            ></textarea>
            <div className="sticky-note-err">
             {errorMsg && <p><hr className="sticky-note-footer"></hr>{errorMsg}</p>}
            </div>
          </div>
      </div>
    </Draggable>
  );
}

