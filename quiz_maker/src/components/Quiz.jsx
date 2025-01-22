import React from 'react'

export default function Quiz({quiz}) {
  return (
    <div className="card bg-primary text-primary-content w-96">
    <div className="card-body">
      <h2 className="card-title"> {quiz.title}</h2>
      <p>Questions : {quiz.questions.length}</p>
      <div className="card-actions justify-end">
        <button className="btn">Modify</button>
      </div>
    </div>
  </div>
  )
}
