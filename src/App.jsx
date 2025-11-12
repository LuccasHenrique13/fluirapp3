import React, { useState } from 'react';
import Board from './components/Board';
import AuthPage from './components/AuthPage';
import './App.css';

const PRE_CONFIGURED_USER = {
  email: 'teste@fluir.com',
  password: '123',
  name: 'Usuário Teste',
  dob: '01/01/2000'
};

function App() {
  const [registeredUser, setRegisteredUser] = useState(PRE_CONFIGURED_USER);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (email, password) => {
    if (!registeredUser) {
      alert('Nenhum usuário cadastrado. Por favor, registre-se primeiro.');
      return;
    }

    if (email === registeredUser.email && password === registeredUser.password) {
      setCurrentUser(registeredUser);
      setIsLoggedIn(true);
    } else {
      alert('E-mail ou senha incorretos!');
    }
  };

  const handleRegister = (email, name, password, dob) => {
    setRegisteredUser({
      email: email,
      name: name,
      password: password,
      dob: dob
    });

    alert('Cadastro realizado com sucesso! Agora, por favor, faça o login.');
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <Board user={currentUser} />
      ) : (
        <AuthPage onLogin={handleLogin} onRegister={handleRegister} />
      )}
    </div>
  );
}

export default App;
