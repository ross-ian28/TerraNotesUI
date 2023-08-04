import React, { useState } from "react";
import logo from "./../logo.png";
import "./Login.css";

export const Login = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [errorMsg, setError] = useState('');
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsPending(true);
        setError('');
        try {
          const response = await fetch(`http://localhost:5000/api/v1/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: email,
              password: pass
            }),
          });
      
          if (response.ok) {
            setIsPending(false);
            localStorage.setItem('email', email);
            console.log("Works perfect")
            props.onFormSwitch('homepage')
          } else {
            const error = await response.json();
            setError(error.data.error)
            setIsPending(false);
            console.log("api call failed")
          }
        } catch (error) {
          setIsPending(false);
          setError(error)
          setPass('');
          console.log("catch error")
        }
    }



    return (
        <div className="auth-form-container">
            <div className="logo-container">                
                <img src={logo} alt="Logo" />
                <h2>TerraNotes Login</h2>
            </div>
            <form className="login-form" onSubmit={handleSubmit}>
                <label form="email">email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" name="email" />
                <label form="password">password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                { !isPending && <button type="submit">Login</button>}
                { isPending && <button type="submit" disabled>Logging in</button>}
            </form>
            <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here</button>
            <div className="error-msg">
                {errorMsg}
            </div>
        </div>
    );
}