import React, { useEffect, useState, } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/Header';
import GrammarChecker from './pages/GrammarChecker';
import PlagiarismChecker from './pages/PlagiarismChecker';
import TextCompletion from './pages/TextCompletion';
import Paraphraser from './pages/Paraphraser';
import Dashboard from './pages/Dashboard';
import './App.css';

function App({ user, updateUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      updateUser(JSON.parse(storedUser));
    }
  }, [updateUser]);

  const handleCallbackResponse = async (response) => {
    if (response) {
      const decodedToken = jwtDecode(response.credential);

      const { name, email } = decodedToken;

      const userObject = { name, email };
      updateUser(userObject);

      await saveUserToDatabase(userObject);

      navigate("/homepage");
    }
  };

  const handleSignout = async () => {
    localStorage.removeItem('user');
    updateUser(null);
    navigate("/");
  };

  const saveUserToDatabase = async (userObject) => {
    try {
      await axios.post('https://writing-assistant-backend.vercel.app/api/user', userObject);
    } catch (error) {
    }
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "249943764427-g7s2qfnr5tdkt8671j4inmg1kvt2b9c1.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });

    if (!user) {
      google.accounts.id.renderButton(
        document.getElementById("signInDiv"),
        { theme: "outline", size: "large" }
      );
    }

    google.accounts.id.prompt();
  }, [user]);

  return (
    <div className="App">
      {!user ? (
        <>
          <h1>Log in</h1>
          <p>to continue using WorthSmith</p>
          <div id="signInDiv" className="google-signin"></div>
        </>
      ) : (
        <>
          <h1>Welcome, {user.name} ({user.email})</h1>
          <p>Press the button below if you want to signout. See you next time!</p>
          <button onClick={handleSignout} className="signout-button">Sign Out</button>
        </>
      )}
    </div>
  );
}

function AppWrapper() {
  const [user, setUser] = useState(null);

  const updateUser = (newUser) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<App user={user} updateUser={updateUser} />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/grammar-checker" element={<GrammarChecker user={user} />} />
        <Route path="/plagiarism-checker" element={<PlagiarismChecker user={user} />} />
        <Route path="/text-completion" element={<TextCompletion user={user} />} />
        <Route path="/paraphraser" element={<Paraphraser user={user} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;
