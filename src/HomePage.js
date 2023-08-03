import React, { useState, useEffect } from "react";

export const HomePage = (props) => {
  const email = localStorage.getItem('email');
  const [user, setUser] = useState(null);
  const [errorMsg, setError] = useState('');

  useEffect(() => {
    console.log(email)
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/user?email=${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        });
    
        if (response.ok) {
          const userData = await response.json(); // Await the JSON data
          setUser(userData.data); // Update the user state with the fetched data
          console.log("Works perfect")
          console.log(userData.data); // Check the updated user state
          props.onFormSwitch('homepage')
        } else {
          console.log(response)
          setError("Invalid Credential")
          console.log(errorMsg)
          console.log("api call failed")
        }
      } catch (error) {
        console.log(error)
        setError(error)
        console.log("catch error")
      }
    };
    

    fetchUserData();
  }, []);

  return (
    <div className="homepage-container">
      {user ? (
        <>
          <h1>Hello {user.attributes.name}</h1>
          <p>Email: {user.attributes.email}</p>

          <div className="error-msg">
                {errorMsg && errorMsg.message}
            </div>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};
