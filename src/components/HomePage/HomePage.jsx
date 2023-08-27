// Import necessary dependencies and styles
import React, { useState, useEffect } from "react";
import StickyNote from './../StickyNote/StickyNote';
import logo from "./../../assets/logo.png";
import "./HomePage.css";

export const HomePage = (props) => {
  const email = localStorage.getItem('email');
  const [user, setUser] = useState(null);
  const [errorMsg, setError] = useState('');
  const [isNotePending, setIsNotePending] = useState(false);
  const [isLogoutPending, setIsLogoutPending] = useState(false);
  const [notes, setNotes] = useState([]);

  // Fetch user data and notes when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (email) {
        try {
          const response = await fetch(`http://localhost:5000/api/v1/user?email=${email}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData.data);
            
            const fetchedNotes = userData.data.attributes.notes;
            if (fetchedNotes.length === 0) {
              setError("No current notes");
            } else {
              setNotes(fetchedNotes);
            }
          } else {
            setError("Failed to fetch user data.");
          }
        } catch (error) {
          setError("An unexpected error occurred.");
        }
      }
    };
    fetchUserData();
  }, [email]);


  // Logout function
  const logout = async () => {
    setIsLogoutPending(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/v1/logout`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email
        }),
      });
  
      if (response.ok) {
        setIsLogoutPending(false);
        props.onFormSwitch('login')
      } else {
        setIsLogoutPending(false);
        const error = await response.json();
        setError(error.data.error || "Failed to logout.")
      }
    } catch (error) {
      setIsLogoutPending(false);
      setError("An unexpected error occurred.");
    }
  }

  // Function to handle closing a note
  const handleNoteClose = async (noteId) => {
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/v1/delete_note`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          note_id: noteId
        }),
      });
  
      if (response.ok) {
        setNotes((prevNotes) => prevNotes.filter(note => note.id !== noteId)); // Set notes to a new array excluding the note with the id equal to noteId
        if (notes.length === 1) { // Display error if there are no notes
          setError("No current notes");
        } else {
          setError("");
        }
      } else {
        const error = await response.json();
        setError(error.data.error || "Failed to delete note")
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    }
  }

  // Function to add a new note
  const addNewNote = async () => {
    setIsNotePending(true);
    setError('');
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
        const newNote = await response.json();
        setNotes(prevNotes => [...prevNotes, newNote.data]); // Add new note to array of notes
        setIsNotePending(false);
      } else {
        setIsNotePending(false);
        setError("Couldn't add new note");
      }
    } catch (error) {
      setIsNotePending(false);
      setError("Bad request");
    }
  }

  return (
    <div className="homepage-container">
      <div className="header">
        <div className="title-container">
          <div className="logo-container">
            <img src={logo} alt="Logo" />
          </div>
          <h1 className="app-name">TerraNotes</h1>
        </div>
        <div className="user-actions">
          {user ? (
            <>
              <div className="new-note-container">
                {!isNotePending && <button className="sticky-btn" onClick={addNewNote}>New Note +</button>}
                {isNotePending && <button className="sticky-btn" disabled>Creating Note</button>}
              </div>
              <div className="logout-container">
                {!isLogoutPending && <button onClick={() => logout()}>Logout</button>}
                {isLogoutPending && <button disabled>Logging out</button>}
              </div>
              <div className="user-info">
                <h1>Hello {user.attributes.name}</h1>
                <p>Email: {user.attributes.email}</p>
              </div>
            </>
          ) : (
            <h1>Loading...</h1>
          )}
        </div>
      </div>
      <div className="sticky-notes-container">
        {notes.map((note) => (
          <StickyNote note={note} onClose={() => handleNoteClose(note.id)} key={note.id} />
        ))} 
      </div>
      {notes.length === 0 ? (
        <>
          <div>
            <h1>No current notes</h1>
          </div>
        </>
      ) : (
        <div className="error-msg">
          {errorMsg && <p>{errorMsg}</p>}
        </div>
      )}
    </div>
  );
};