import React, { useState } from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { useParams,useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
import { useSnackbar } from 'notistack';

const Review = () => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(2.5);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleReview = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);
      const user = auth.currentUser;
      let data = {
        review,
        rating,
        user: user.displayName,
      };
      const token = await user.getIdToken();
      let res = await axios.post(`/api/books/${id}/reviews`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setReview(res.data);
      enqueueSnackbar("Review Created Successfully",{variant: "success"});
      navigate(`/`);
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Error Occured In Creating Review",{variant: "error"});
    } finally {
      setReview('');
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className='flex justify-center items-center mx-4 my-4 md:mx-24'>
        <form onSubmit={handleReview}>
          <div className='flex justify-center items-center'>
            <label htmlFor="rating" className="mr-4 text-xl text-black-600"></label>
            <Stack spacing={1}>
              <Rating name="half-rating" id='rating' precision={0.5} onChange={(event, newValue) => { setRating(newValue) }} className='h-16' />
            </Stack>
          </div>
          <div>
            <label htmlFor="review" className="mr-4 text-xl text-black-600"></label>
            <textarea name="review" id="review" cols="40" rows="10" placeholder='Write your review' value={review} onChange={(event) => { setReview(event.target.value) }} className="w-full border-black-600 rounded-md"></textarea>
          </div>
          <div>
            <button className="px-4 py-2 w-1/2 bg-sky-600 text-black-600 text-center rounded-md">Post</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Review;
