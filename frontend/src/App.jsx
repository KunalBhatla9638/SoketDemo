import { Toaster } from "react-hot-toast"
import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import Register from "./pages/Register"

const App = () => {
  return (
    <>
    <Toaster position="top-right" />
    <Routes>
      <Route path="/" element={<Register/>}/>
      <Route path="/home" element={<HomePage/>}/>
    </Routes>
    </>
  )
}
export default App