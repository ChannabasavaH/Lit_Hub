import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useSnackbar } from 'notistack'

const Logout = () => {
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        window.localStorage.removeItem('auth');
        await axios.post('/api/logout', null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await signOut(auth);
        enqueueSnackbar("Logged Out Successfully", {variant: "success"})
        navigate('/');
      } else {
        console.log("No user is logged in");
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Error in Logging Out", {variant: "error"})
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className='my-4'>
        <h1 className="text-black-600 text-2xl text-center">Logout</h1>
      </div>
      <div className="flex flex-col border-2 border-sky-600 w-full md:w-1/2 lg:w-1/3 mx-auto p-4 rounded-md mb-4">
        <div>
          <p className="text-red-600 text-2xl p-4 my-2">Are you sure you want to logout?</p>
        </div>
        <div>
          <button className="px-4 py-2 w-full bg-red-600 text-black-600 text-center rounded-md" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Logout;
