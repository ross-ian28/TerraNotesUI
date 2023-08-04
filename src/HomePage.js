import React, { useState, useEffect } from "react";

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
          props.onFormSwitch('login')
        }
      } catch (error) {
        console.log(error)
      }
    };
    fetchUserData();
  }, []);

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
        setError(error.data.error)
      }
    } catch (error) {
      setIsPending(false);
      setError(error)
    }
  }
  return (
    <div className="homepage-container">
      {user ? (
        <>
          { !isPending && <button onClick={() => logout()}>Logout</button>}
          { isPending && <button  disabled>Logging in</button>}
          <h1>Hello {user.attributes.name}</h1>
          <p>Email: {user.attributes.email}</p>

          <div className="error-msg">
                {errorMsg}
          </div>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};
