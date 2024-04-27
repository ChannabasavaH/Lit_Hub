import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAuth } from 'firebase/auth';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/api/login');
    }
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const token = await user.getIdToken();
        const res = await axios('/api/books',{
          headers:{
            Authorization: `Bearer ${token}`
          }
        })
        setBooks(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleBookClick = (bookId) => {
    navigate(`/api/books/${bookId}`);
  };
  
  
  if (loading) return <Spinner />;

  return (
    <div>
      <Navbar />
      <div className='flex flex-wrap justify-center'>
        {books.map((book) => (
          <div key={book._id} className='max-w-xs bg-white shadow-lg rounded-lg overflow-hidden m-4 flex' onClick={() => handleBookClick(book._id)}>
            <img src={book.imageUrl} alt="Not Found" className='w-1/3 h-auto object-cover' />
            <div className='p-4 flex-1'>
              <div className='font-bold text-xl mb-2'>{book.title}</div>
              <p className='text-base'>by {book.author}</p>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
