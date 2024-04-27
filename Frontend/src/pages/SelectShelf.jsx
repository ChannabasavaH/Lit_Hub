import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAuth } from 'firebase/auth';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel'
import { useSnackbar } from  'notistack'

const SelectShelf = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedShelf, setSelectedShelf] = useState('');
    const auth = getAuth();
    const user = auth.currentUser;
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const fetchBooks = async (id) => {
        try {
            setLoading(true);
            const token = await user.getIdToken();
            const res = await axios.get(`/api/books/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setBooks(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBooks(id);
    }, [id]);


    const handleBookClick = async (id) => {
        try {
            const token = await user.getIdToken();
            setLoading(true);
            await axios.post(`/api/books/${id}/shelf`, { shelf: selectedShelf }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            enqueueSnackbar("Bood Added Successfully", { variant: "success" })
            navigate('/');
        } catch (error) {
            console.error(error);
            enqueueSnackbar("Error in adding book", { variant: "error" })
        } finally {
            setLoading(false);
        }
    };


    if (loading) return <Spinner />;

    return (
        <div>
            <Navbar />
            <div className='flex flex-wrap justify-center'>
                {books && (
                    <div key={books._id} className='max-w-xs bg-white shadow-lg rounded-lg overflow-hidden m-4 flex'>
                        <img src={books.imageUrl} alt="Not Found" className='w-1/3 h-auto object-cover' />
                        <div className='p-4 flex-1'>
                            <div className='font-bold text-xl mb-2'>{books.title}</div>
                            <p className='text-base'>by {books.author}</p>
                        </div>  
                    </div>
                )}
            </div>
            <div className='my-4 mx-2 p-2 flex justify-center'>
                            <FormControl>
                                <FormLabel id="demo-radio-buttons-group-label" className='text-black-500 text-2xl'>Select A Shelf</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue=""
                                    name="shelf"
                                    value={selectedShelf}
                                    onChange={(event) => {
                                        setSelectedShelf(event.target.value);
                                    }}
                                >
                                    <FormControlLabel value="Want to Read" control={<Radio />} label="Want to Read" labelPlacement='start' />
                                    <FormControlLabel value="Reading" control={<Radio />} label="Reading" labelPlacement='start' />
                                    <FormControlLabel value="Read" control={<Radio />} label="Read" labelPlacement='start' />
                                </RadioGroup>
                            </FormControl>
                        </div>
                        <div className='flex justify-center'>
                            <button className='mx-4 md:mx-4 my-4 p-2 w-40 bg-sky-600 border-black-600 rounded text-center' onClick={() => handleBookClick(books._id)}>Add</button>
                        </div>
            <Footer />
        </div>
    );
}

export default SelectShelf;
