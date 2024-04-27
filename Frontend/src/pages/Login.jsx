import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import Spinner from "../components/Spinner";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useSnackbar } from 'notistack';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      await axios.post('/api/login', null, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });

      if (userCredential) {
        window.localStorage.setItem('auth', 'true');
        enqueueSnackbar("Logged In Successfully",{variant : "success"})
        navigate('/');
      }

      console.log("Successfully logged in");
    } catch (error) {
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        setError("Invalid email or password");
        enqueueSnackbar("Error in logging in!!",{variant: "error"})
      } else {
        console.error("Failed to sign in:", error.message);
        setError("An unexpected error occurred. Please try again later.", error);
        enqueueSnackbar("Error in logging in!!",{variant: "error"})
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleButton = () => {
    setShowPass(!showPass);
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className='my-4'>
        <h1 className="text-2xl text-black-600 text-center">Login</h1>
      </div>
      <div className="border-2 border-sky-600 rounded-md flex flex-col w-full md:w-1/2 lg:w-1/3 p-4 mx-auto mb-4">
        <form onSubmit={handleSignin}>
          <div>
            <label htmlFor='email' className="mr-4 text-xl text-black-600">Email</label>
            <input type="email" placeholder='Enter email' id='email' value={email} onChange={(event) => { setEmail(event.target.value) }} className="px-4 py-2 w-full border-2 border-black-600 rounded-md" required />
          </div>
          <div>
            <label htmlFor='password' className="mr-4 text-xl text-black-600">Password</label>
            <div className="relative">
              <input type={showPass ? "text" : "password"} placeholder='Enter password' id='password' value={password} onChange={(event) => { setPassword(event.target.value) }} className="px-4 py-2 w-full border-2 border-black-600 rounded-md" required />
              <MdOutlineRemoveRedEye onClick={toggleButton} className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer" />
            </div>
          </div>
          <div className='my-4'>
            <button className="px-4 py-2 w-full bg-sky-600 text-black-600 text-center rounded-md">Login</button>
          </div>
        </form>
        {error && <p className="text-red-500 text-sm text-center">Enter correct password and email to login</p>}
      </div>
      <div className='m-4 p-2'>
        <Link to={`/api/signup`}>
          <p className='text-black-500 text-xl text-center'>Don't have an account? Click here to Sign Up</p>
        </Link>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Login;
