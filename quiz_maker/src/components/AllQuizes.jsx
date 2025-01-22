import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Quiz from './Quiz';


export default function AllQuizes() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get('http://localhost:3000/quizzes');
                setQuizzes(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch quizzes');
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    if (loading) return <button className=" btn btn-square">
    <span className="loading loading-spinner"></span>
  </button>
    

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">All Quizzes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                    <Quiz 
                        key={quiz._id} 
                        quiz={quiz}
                    />
                ))}
            </div>
            {quizzes.length === 0 && (
                <p className="text-center text-gray-500 mt-10">No quizzes available</p>
            )}
        </div>
    );
}
