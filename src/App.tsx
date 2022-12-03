import { useState } from 'react'
import reactLogo from './assets/react.svg'
// theme
import ThemeProvider from './theme';
import './App.css'
import Router from './routes';

function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  )
}

export default App
