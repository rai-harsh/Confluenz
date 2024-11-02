import { useState } from 'react'
import Photowalk from './Pages/Photowalk'
import Event from './Pages/Event'
import Items from './Pages/Items'
import ImageUploadForm from './Components/ImageUploadForm'
import Tiles from './Components/Tiles'
import './App.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom'



function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ImageUploadForm />} />
          <Route path='/categories' element={<Items type="categories" />} />
          <Route path="/categories/:categoryType" element={<Tiles />} />
          <Route path='/photowalks' element={<Items type="photowalks" />} />
          <Route path="/photowalks/:photowalkType" element={<Tiles />} />
          <Route path='/events' element={<Items type="events" />} />
          <Route path='/events/:eventType' element={<Tiles />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App
