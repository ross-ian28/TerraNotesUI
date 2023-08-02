import React, { useState } from 'react';
import './App.css';
import { Login } from "./Login";
import { Register } from "./Register";
import { HomePage } from "./HomePage";

function App() {
  const [currentForm, setCurrentForm] = useState('login');
  const [userEmail, setUserEmail] = useState('');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  return (
    <div className="App">
      {currentForm === 'login' ? (
        <Login onFormSwitch={toggleForm} userEmail={setUserEmail}/>
      ) : currentForm === 'register' ? (
        <Register onFormSwitch={toggleForm} />
      ) : (
        <HomePage onFormSwitch={toggleForm} userEmail={setUserEmail}/>
      )}
    </div>
  );
}

export default App;
