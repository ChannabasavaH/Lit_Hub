import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom';

const ShelfBooks = () => {
  const [shelf, setShelf] = useState('');
  const [shelfBooks, setShelfBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleChange = (event) => {
    setShelf(event.target.value);
  };

  useEffect(() => {
    const fetchShelfBooks = async () => {
      try {
        setLoading(true);
        const token = await user.getIdToken();
        const response = await axios.get(`/api/books/shelf?shelf=${shelf}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setShelfBooks(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchShelfBooks();
  }, [shelf]);

  const handleBookClick = (id) => {
    if (id) {
      navigate(`/api/books/${id}`);
    } else {
      navigate("/");
    }
  }

  if (loading) return <Spinner />

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className='m-4 p-2'>
        <h1 className='text-black-600 text-xl text-center'>Your Shelf Books</h1>
      </div>
      <div className='m-4 p-2 flex justify-center'>
        <label htmlFor="shelfSelect" className='text-black-600 text-xl'>Select a shelf:</label>
        <select id="shelfSelect" value={shelf} onChange={handleChange}>
          <option value="">All</option>
          <option value="Want to Read">Want to Read</option>
          <option value="Reading">Reading</option>
          <option value="Read">Read</option>
        </select>
      </div>
      <div className='flex flex-wrap justify-center'>
        {shelfBooks.map((book) => (
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

export default ShelfBooks;
