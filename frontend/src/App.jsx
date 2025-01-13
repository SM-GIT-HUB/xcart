import { Route, Routes } from "react-router-dom"

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<h1 className="text-[20px]">Hello world!</h1>} />
      </Routes>
    </div>
  )
}

export default App