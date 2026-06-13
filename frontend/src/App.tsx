import { Routes, Route } from 'react-router'
import SearchPage from './pages/SearchPage'
import FigurePage from './pages/FigurePage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/figures/:slug" element={<FigurePage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}

export default App
