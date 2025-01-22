import React from "react"
import { Link } from "react-router-dom"

const Dashboard = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          Quiz App
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link to="/all-quizzes" className="text-white hover:text-blue-200">
              All Quizzes
            </Link>
          </li>
          <li>
            <Link to="/create-quiz" className="text-white hover:text-blue-200">
              Create a Quiz
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Dashboard

