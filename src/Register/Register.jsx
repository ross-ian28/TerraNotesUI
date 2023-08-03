import React, { useState } from "react";
import logo from "./../logo.png";
import "./Register.css";

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const [errorMsg, setError] = useState('');
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsPending(true);
        setError('');
        await fetch("http://localhost:5000/api/v1/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: pass
          }),
        }).then(res => {
            if (res.ok) {
              console.log(res)
              setIsPending(false);
              console.log("Works perfect")
              props.onFormSwitch('login')
            } else {
              setError(res.json())
              setIsPending(false);
              console.log("api call failed")
            }
          })
          .catch(error => {
            setError(error)
            setPass('');
            console.log("catch error")
            setIsPending(false);
          })
    }



    return (
        <div className="auth-form-container">
            <div className="logo-container">                
                <img src={logo} alt="Logo" />
                <h2>TerraNotes Register</h2>
            </div>
            <form className="register-form" onSubmit={handleSubmit}>
                <label form="name">full name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} type="name" placeholder="yourname" id="name" name="name" />
                <label form="email">email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" name="email" />
                <label form="password">password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                { !isPending && <button type="submit">Register</button>}
                { isPending && <button type="submit" disabled>Registering</button>}
            </form>
            <button className="link-btn" onClick={() => props.onFormSwitch('login')}>Already have an account? Login here</button>
            <div className="error-msg">
                {errorMsg && errorMsg.message}
            </div>
        </div>
    );
}