import React, { useState, } from 'react';
import { HiLibrary } from "react-icons/hi";
import { IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from "react-icons/fa";
import axios from 'axios';
import Spinner from './Spinner';
import { getAuth } from 'firebase/auth';
import { GiBookshelf } from "react-icons/gi";

const Navbar = () => {
    const [nav, setNav] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();
    const user = auth.currentUser;

    const handleNavChange = async (event) => {
        event.preventDefault();
        try {
            const token = await user.getIdToken();
            setLoading(true);

            const response = await axios.post('/api/books/search', { query: nav }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            let fetchedBooks = [];
            if (response.data.message === "Book found in the database") {
                fetchedBooks = [response.data.book]; // When book is found in the database
            } else {
                fetchedBooks = response.data.books; // When book is fetched from the API
            }

            // Pass the fetchedBooks in the state when navigating
            navigate('/search-books', { state: { books: fetchedBooks } });
        } catch (error) {
            console.error(error);
            // Add specific error handling based on the error type
        } finally {
            setLoading(false);
        }
    };

    const handleShelf = () => {
        if(!user){
            navigate('/api/login');
        }
    }

    if (loading) return <Spinner />

    return (
        <div className='bg-blue-500 w-full h-[70px] flex justify-between items-center sticky top-0 z-50'>
            <div className='ml-4'>
                <Link to={"/"}>
                    <HiLibrary className='text-white text-2xl' />
                </Link>
            </div>
            <div className='ml-4' onClick={handleShelf}>
                <Link to={"/api/books/shelf"}>
                    <GiBookshelf className='text-white text-2xl' />
                </Link>
            </div>
            <div className='hidden md:flex flex-grow justify-center'>
                <form action="#" className='flex justify-center items-center rounded-lg bg-white mx-auto p-2' onSubmit={handleNavChange}>
                    <input type="text" placeholder='Search...' value={nav} onChange={(event) => { setNav(event.target.value) }} className='outline-none px-2 py-1 rounded-l-lg w-full' />
                    <button type='submit' className='bg-blue-500 text-white px-3 py-1 rounded-r-lg'>
                        <IoIosSearch />
                    </button>
                </form>
                <div className='hidden md:flex mr-4 flex items-center'>
                    <div className='flex gap-4'>
                        <Link to={'/api/signup'} className='text-white'>Sign Up</Link>
                        <Link to={'/api/login'} className='text-white'>Login</Link>
                        <Link to={'/api/logout'} className='text-white'>Logout</Link>
                    </div>
                </div>
            </div>
            <div className='md:hidden flex justify-end items-center mr-4'>
                <button onClick={() => setShowSearch(!showSearch)}>
                    <FaBars className='text-white text-2xl' />
                </button>
            </div>
            {showSearch && (
                <div className='md:hidden absolute top-[70px] left-0 right-0 bg-blue-500 p-2'>
                    <form action="#" className='flex justify-center items-center rounded-lg bg-white mx-auto p-2' onSubmit={handleNavChange}>
                        <input type="text" placeholder='Search...' value={nav} onChange={(event) => { setNav(event.target.value) }} className='outline-none px-2 py-1 rounded-l-lg w-full' />
                        <button type='submit' className='bg-blue-500 text-white px-3 py-1 rounded-r-lg'>
                            <IoIosSearch />
                        </button>
                    </form>
                    <div className='flex justify-center items-center gap-4 mt-2'>
                        <Link to={'/api/signup'} className='text-white'>Sign Up</Link>
                        <Link to={'/api/login'} className='text-white'>Login</Link>
                        <Link to={'/api/logout'} className='text-white'>Logout</Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar;
