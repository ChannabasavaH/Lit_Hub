import React from 'react';
import { FaInstagram, FaLinkedin, FaFacebookSquare } from "react-icons/fa";

const Footer = () => {
    return (
        <div className='bg-blue-500 w-full'>
            <div className='flex justify-center items-center py-2'>
                <FaFacebookSquare className='text-xl mx-3' />
                <FaInstagram className='text-xl mx-3' />
                <FaLinkedin className='text-xl mx-3' />
            </div>
            <div className='flex justify-center items-center py-1'>
                <p className='text-xl'>&copy;Litrary-Hub Private Limited</p>
            </div>
            <div className='flex justify-center items-center py-1'>
                <p className='text-l mx-3'>Privacy</p>
                <p className='text-l'>Terms and Conditions</p>
            </div>
        </div>
    );
}

export default Footer;
