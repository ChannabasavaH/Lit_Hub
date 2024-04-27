import React from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PageNotFound = () => {
  return (
    <div>
    <Navbar />
    <div className='text-center my-8'>
      <h1 className='text-3xl font-bold'>404 - Page Not Found</h1>
      <p className='mt-4'>The page you are looking for does not exist.</p>
    </div>
    <Footer />
  </div>
  )
}

export default PageNotFound