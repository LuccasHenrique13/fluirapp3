import React, { useState } from 'react';
import './style/Auth.css';

function AuthPage({ onLogin, onRegister }) {
  const [isLoginView, setIsLoginView] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');

  const handleDateChange = (e) => {
    let value = e.target.value;

    value = value.replace(/\D/g, '');

    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }

    if (value.length > 5) {
      value = value.slice(0, 5) + '/' + value.slice(5);
    }

    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    setDob(value);
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLoginView) {
      onLogin(email, password);
    } else {
      onRegister(email, name, password, dob);

      setEmail('');
      setPassword('');
      setName('');
      setDob('');

      setIsLoginView(true);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>{isLoginView ? 'Entrar' : 'Criar uma conta'}</h2>

          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {!isLoginView && (
            <div className="input-group">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLoginView && (
            <div className="input-group">
              <label htmlFor="dob">Data de Nascimento</label>
              <input
                type="text"
                placeholder="DD/MM/AAAA"
                id="dob"
                value={dob}
                onChange={handleDateChange}
                required
              />
            </div>
          )}


          <button type="submit" className="auth-button">
            {isLoginView ? 'Entrar' : 'Criar conta'}
          </button>

          <div className="auth-toggle">
            {isLoginView ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
            <span onClick={() => setIsLoginView(!isLoginView)}>
              {isLoginView ? 'Registre-se' : 'Entrar'}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
