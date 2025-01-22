import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Use BrowserRouter instead of Router
import './styles.css';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import AllQuizes from './components/AllQuizes';
import CreateQuiz from './components/CreateQuiz';
import QuizMaker from './components/QuizMaker';

function App() {
  return (
    <div>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Dashboard />
          <main className="p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/all-quizzes" element={<AllQuizes />} />
              <Route path="/create-quiz" element={<QuizMaker />} />
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  );
}

export default App;
