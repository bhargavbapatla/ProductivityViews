import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { TreeView } from './components/treeView/treeView'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>Front-End Developer Test: Tree View</h1>
      <TreeView />
    </div>
  )
}

export default App
