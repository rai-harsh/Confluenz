import Home from './Pages/Home.jsx'
import Events from './Pages/Events.jsx'
import Photowalks from './Pages/Photowalks.jsx'
import Navbar from './Components/Navbar.jsx'
import Footer from './Components/Footer.jsx'
import AboutUs from './Pages/AboutUs.jsx'
import Gallery from './Components/Gallery.jsx'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Walk from './Pages/Description.jsx'
import AdminLogin from './Pages/AdminLogin.jsx'
function App() {

  return (
    <>
    <BrowserRouter>
      <Navbar/>
      <Routes>  
        <Route path='/' element={<Home/>}/>
        <Route path='category/:categoryType' element={<Gallery />}/>
        <Route path='Events' element={<Events/>}/>
        <Route path='Events/:eventId' element={<Walk/>}/>
        <Route path='Photowalks' element={<Photowalks/>}/> 
        <Route path='Photowalks/:walkId' element={<Walk/>}/>
        <Route path='AboutUs' element={<AboutUs/>}/>
        <Route path='AdminLogin' element={<AdminLogin/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
    </>
      
  ) 
}

export default App
