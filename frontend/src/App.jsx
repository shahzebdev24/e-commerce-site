import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import CategoryPage from './pages/CategoryPage'
import OurStory from './pages/OurStory'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
    <div className='w-full bg-black text-white text-xs py-2 overflow-hidden'>
        <div className='flex whitespace-nowrap animate-marquee'>
          {[...Array(4)].map((_, i) => (
            <span key={i} className='mx-12'>
              Free Delivery on Orders Above AED 500 &nbsp;&nbsp;|&nbsp;&nbsp; Cash on Delivery Available &nbsp;&nbsp;|&nbsp;&nbsp; Easy Returns & Exchanges within 10 Days &nbsp;&nbsp;|&nbsp;&nbsp; 100% Authentic Products Guaranteed &nbsp;&nbsp;|&nbsp;&nbsp; Shop the Latest Summer Collection 2025
            </span>
          ))}
        </div>
      </div>
      
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      {/* Sliding Ribbon */}
      
      <NavBar />
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/category/:categoryName' element={<CategoryPage />} />
        <Route path='/our-story' element={<OurStory />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
      </Routes>
      <Footer />
    </div>
    </>
  )
}

export default App
