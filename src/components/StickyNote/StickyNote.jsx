import React, { useState, useEffect } from 'react';
import Draggable from "react-draggable";
import throttle from 'lodash.throttle';
import './StickyNote.css';

export default function StickyNote({ note, onClose, index }) {
  const [currentNote, setCurrentNote] = useState(note.attributes.contents);
  const [x_position, setxPosition] = useState(note.attributes.x_position || 0);
  const [y_position, setyPosition] = useState(note.attributes.y_position || 0);
  const [errorMsg, setError] = useState('');

  const throttledNoteChange = throttle(async (newValue) => {
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
      console.error("An unexpected error occurred while updating note contents");
    }
  }, 500);

  const handleNoteChange = (newValue) => {
    setCurrentNote(newValue);
    throttledNoteChange(newValue);
  };

  useEffect(() => {
    return () => {
      throttledNoteChange.cancel();
    };
  }, []);

  const handleDragStop = async (position) => {
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
  

  return (
      <Draggable 
        defaultPosition={{ 
          x: x_position, 
          y: y_position 
        }}
        onStop={(e, position) => handleDragStop(position)} 
      >
      <div className="note-page-container">
          <div className="sticky-note-container" key={index}>
            <div className="sticky-note-header">
              <div className="close" onClick={onClose}>
                &times;
              </div>
            </div>
            {errorMsg && <p>{errorMsg}</p>}
            <textarea
              name={`Sticky note ${note.id}`}
              id = {note.id}
              cols="17"
              rows="9"
              value={currentNote}
              onChange={(e) => handleNoteChange(e.target.value)}
            ></textarea>
          </div>
      </div>
    </Draggable>
  );
}

