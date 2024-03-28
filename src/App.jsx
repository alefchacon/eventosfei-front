import { useState } from 'react'

import './App.css'
import Navbar from './components/Navbar.jsx'
import Form from './components/Form.jsx'
import './index.css'
import { ThemeProvider } from '@emotion/react'


function App() {
  const [count, setCount] = useState(0)

  return (
      <div className='main-content'>
        <Navbar />
        <div className="test">
          <Form></Form>
        </div>

      </div>


  )
}

export default App
