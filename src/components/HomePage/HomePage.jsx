import React, { useState, useEffect } from "react";
import StickyNote from './../StickyNote/StickyNote'

export const HomePage = (props) => {
  const email = localStorage.getItem('email');
  const [user, setUser] = useState(null);
  const [errorMsg, setError] = useState('');
  const [isNotePending, setIsNotePending] = useState(false);
  const [isLogoutPending, setIsLogoutPending] = useState(false);
  const [isClosePending, setIsClosePending] = useState(false);
  const [notes, setNotes] = useState([]);


  useEffect(() => {
    const fetchUserData = async () => {
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
          if (userData.data.attributes.notes) {
            console.log("set notes")
            setNotes(userData.data.attributes.notes);
          }
        } else {
          setError("Failed to fetch user data.");
        }
      } catch (error) {
        setError("An unexpected error occurred.");
      }
    };
    fetchUserData();
  }, [setUser, email]);

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

  const handleNoteClose = async () => {
    setIsClosePending(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/v1/delete_note`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email
        }),
      });
  
      if (response.ok) {
        setIsClosePending(false);
        props.onFormSwitch('login')
      } else {
        setIsClosePending(false);
        const error = await response.json();
        setError(error.data.error || "Failed to logout.")
      }
    } catch (error) {
      setIsClosePending(false);
      setError("An unexpected error occurred.");
    }
  }

  const addNewNote = async () => {
    setIsNotePending(true);
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
        setIsNotePending(false);
        console.log(response)
      } else {
        setIsNotePending(false);
        const error = await response.json();
      }
    } catch (error) {
      setIsNotePending(false);
    }
  }

  return (
    <div className="homepage-container">
      {user ? (
        <>
          <div className="new-note-container">
            { !isNotePending && <button className="sticky-btn" onClick={addNewNote}>New Note +</button>}
            { isNotePending && <button className="sticky-btn" disabled>Creating Note...</button>}
          </div>
          { !isLogoutPending && <button onClick={() => logout()}>Logout</button>}
          { isLogoutPending && <button  disabled>Logging out</button>}
          <div className="sticky-notes-container">
            {notes.map((note, index) => (
              <StickyNote note={note} onClose={() => handleNoteClose(index)} key={index}/>
            ))}
          </div>
          <h1>Hello {user.attributes.name}</h1>
          <p>Email: {user.attributes.email}</p>
          
          <div className="error-msg">
            {errorMsg && <p>{errorMsg}</p>}
          </div>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};
