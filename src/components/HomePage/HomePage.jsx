import React, { useState, useEffect } from "react";
import StickyNote from './../StickyNote/StickyNote'

export const HomePage = (props) => {
  const email = localStorage.getItem('email');
  const [user, setUser] = useState(null);
  const [errorMsg, setError] = useState('');
  const [isPending, setIsPending] = useState(false);


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
        } else {
          setError("Failed to fetch user data.");
        }
      } catch (error) {
        setError("An unexpected error occurred.");
      }
    };
    fetchUserData();
  }, [setUser, props, email]);

  const logout = async () => {
    setIsPending(true);
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
        setIsPending(false);
        props.onFormSwitch('login')
      } else {
        setIsPending(false);
        const error = await response.json();
        setError(error.data.error || "Failed to logout.")
      }
    } catch (error) {
      setIsPending(false);
      setError("An unexpected error occurred.");
    }
  }
  return (
    <div className="homepage-container">
      {user ? (
        <>
          { !isPending && <button onClick={() => logout()}>Logout</button>}
          { isPending && <button  disabled>Logging in</button>}
          <StickyNote />
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
