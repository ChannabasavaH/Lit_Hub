import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

const ShowReview = () => {
  const [reviews, setReviews] = useState([]);
  const [expanded,setExpanded] = useState(false);
  const { id } = useParams();
  const auth = getAuth();

  const toggleButton = () =>{
    setExpanded(!expanded);
  }

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const user = auth.currentUser;
        const token = await user.getIdToken();
        const res = await axios.get(`/api/books/${id}/reviews`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setReviews(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReviews();
  }, [id, auth]);

  return (
    <div>
      {reviews.map((review) => (
        <div key={review._id} className='m-4 p-4'>
          <div className='flex'>
            <h1 className='text-black-600 text-xl'>{review.user}</h1>
            <p className='ml-2 text-black-200'>rated it</p>
          </div>
          <div>
            <Stack spacing={0} direction="row">
              <Rating name="half-rating-read" value={review.rating} readOnly />
            </Stack>
          </div>
          <div>
            <p>{expanded ? review.review : `${review.review.slice(0,200)}...`}</p>
            <button className='text-blue-500 ml-2' onClick={toggleButton}>
              {expanded? 'Read Less' : 'Read More'}
            </button>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default ShowReview;
