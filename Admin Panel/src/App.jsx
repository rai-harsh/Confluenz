import Navbar from './Components/Navbar'
import Items from './Pages/Items'
import Home from './Pages/Home'
import Tiles from './Components/Tiles'
import MemberForm from './Pages/MemberForm'
import './App.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom'



function App() {
  return (
    <>
      
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/categories' element={<Items type="categories" />} />
          <Route path="/categories/:categoryType" element={<Tiles />} />
          <Route path='/photowalks' element={<Items type="photowalks" />} />
          <Route path="/photowalks/:photowalkType" element={<Tiles />} />
          <Route path='/events' element={<Items type="events" />} />
          <Route path='/events/:eventType' element={<Tiles />} />
          <Route path='/member-form' element={<MemberForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App
