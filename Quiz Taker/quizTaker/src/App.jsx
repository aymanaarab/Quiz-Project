import './App.css'
import QuizTaker from './components/QuizTaker'
import { BrowserRouter, Route, Routes } from 'react-router'
import Register from './components/Register'
import Login from './components/Login'


function App() {

 return <BrowserRouter>
 <Routes>
 <Route path="/" element={<Login/>} />
 <Route path="/login" element={<Login/>} />
 <Route path="/sign-up" element={<Register />} />
      <Route path='/quiz' element={<QuizTaker />} />
 </Routes>
 </BrowserRouter> 

}

export default App
