import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Use BrowserRouter instead of Router
import './styles.css';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import AllQuizes from './components/AllQuizes';
import QuizMaker from './components/QuizMaker';
import ModifyQuiz from './components/ModifyQuiz';

function App() {
  return (
    <div>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Dashboard />
          <main className="p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-quiz" element={<QuizMaker />} />
              <Route path="/modify-quiz/:id" element={<ModifyQuiz />} />
              <Route path="/all-quizzes" element={<AllQuizes />} />
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  );
}

export default App;
