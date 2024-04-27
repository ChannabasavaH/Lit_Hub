import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Review from '../components/Review';
import ShowReview from './ShowReview';

const ShowBook = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [expanded, setExpanded] = useState(false);
  const auth = getAuth();

  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          setLoading(true);
          const token = await user.getIdToken();
          let res = await axios.get(`/api/books/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setBook(res.data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      } else {
        // Handle the case where there is no signed-in user
        console.log('No user signed in');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth, id]);

  if (loading) return <Spinner />;

  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div className='flex justify-center items-center mx-4 my-4 md:mx-24'>
        {book && (
          <div key={book._id} className='flex-col justify-center w-full md:w-[50%] border-4 border-solid shadow-lg rounded-lg'>
            <div className='mx-4 md:mx-4 my-4 p-4 flex justify-center'>
              <img src={book.imageUrl} alt="not found" className='w-full h-[300px] md:h-[300px] rounded-lg sm-w-full' />
            </div>
            <div className='mx-4 md:mx-4 my-4 p-4 flex-col justify-center text-center'>
              <h2 className='text-xl md:text-2xl text-500-black md:ml-4'>{book.title}</h2>
              <p className='ml-8 md:ml-8 text-base md:text-lg text-300-black'>- by {book.author}</p>
            </div>
            <div className='mx-4 md:mx-4 my-4 p-4 flex-col justify-center text-center'>
            <Link to={`/api/books/${id}/shelf`}>
              <button className='px-4 py-2 w-1/3 bg-sky-600 text-black-600 text-center rounded-md'>Want to Read</button>
            </Link>
            </div>
            <div className='mx-4 md:mx-4 my-2 p-2 flex-col justify-center items-center text-center'>
              <h2 className='text-xl md:text-2xl text-500-black md:ml-4'>Rating</h2>
              <div className='mx-4 md:mx-4 my-2 p-2 flex justify-center'>
                <Review />
              </div>
            </div>
            <div className='mx-4 md:mx-4 my-4 p-4 flex-col justify-center'>
              <h2 className='text-xl md:text-2xl text-500-black md:ml-2 my-2'>Description</h2>
              <p>{expanded ? book.description : `${book.description.slice(0, 200)}...`}
                <button className='text-blue-500 ml-2' onClick={toggleDescription}>
                  {expanded ? 'Read Less' : 'Read More'}
                </button>
              </p>
            </div>
            <div className='mx-4 md:mx-4 my-4 p-4 flex-col items-center'>
              <p className='text-md md:text-md text-500-black md:ml-4'>Pages: {book.pageCount}</p>
              <p className='text-md md:text-md text-500-black md:ml-4'>First Published Date: {book.publishedDate.slice(0, 10)}</p>
            </div>
            <hr />
            <div>
              <h1 className='mx-4 md:mx-4 my-2 p-2 text-2xl md:text-2xl text-center text-500-black'>All Reviews</h1>
              <ShowReview />
            </div>
          </div>
        )}
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default ShowBook;
