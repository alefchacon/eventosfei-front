import { useState } from 'react'

import './App.css'
import Navbar from './components/Navbar.jsx'
import Evaluation from './pages/Evaluation.jsx'
import './index.css'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)
  const [showTest1, setShowTest1] = useState(false);
  return (
      <div className='app'>
        <BrowserRouter>

          <Navbar />

          <div className="content">
            <Routes>
              <Route path='/Evaluaciones' element={<Evaluation/>}> </Route>
            </Routes>
          </div>

        </BrowserRouter>
      </div>


  )
}

export default App
