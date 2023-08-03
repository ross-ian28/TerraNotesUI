import React, { useState, useEffect } from "react";

export const HomePage = (props) => {
  const [user, setUser] = useState(null);
  const [errorMsg, setError] = useState('');

  useEffect(() => {
    console.log(props)
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: props.userEmail
          }),
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData); // Update the user state with the fetched data
          console.log(user)
          console.log(response)
        } else {
          setError('Something went wrong');
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData(); // Call the fetchUserData function on component mount
  }, []);

  return (
    <div className="homepage-container">
      {user ? (
        <>
          <h1>Hello, {user.name}</h1>
          <p>Email: {user.email}</p>

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
