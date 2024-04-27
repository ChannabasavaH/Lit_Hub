import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSnackbar } from 'notistack';

const SearchBooks = () => {
  const location = useLocation();
  const savedBooks = location.state?.books || [];
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleBookClick = (id) => {
    if (id) {
      navigate(`/api/books/${id}`);
      enqueueSnackbar("You can access information", {variant: "success"});
    } else {
      navigate('/');
      enqueueSnackbar("Search Again to access information", {variant: "success"});
    }
  };

  return (
    <div>
      <Navbar />
      <div className='flex flex-wrap justify-center'>
        {Array.isArray(savedBooks[0]) ? (
          savedBooks[0].map((book) => (
            <div key={book._id} className='max-w-xs bg-white shadow-lg rounded-lg overflow-hidden m-4 flex' onClick={() => handleBookClick(book._id)}>
              <img src={book.imageUrl} alt="Not Found" className='w-1/3 h-auto object-cover' />
              <div className='p-4 flex-1'>
                <div className='font-bold text-xl mb-2'>{book.title}</div>
                <p className='text-base'>by {book.author}</p>
              </div>
            </div>
          ))
        ) : (
          savedBooks.map((book) => (
            <div key={book._id} className='max-w-xs bg-white shadow-lg rounded-lg overflow-hidden m-4 flex' onClick={() => handleBookClick(book._id)}>
              <img src={book.imageUrl} alt="Not Found" className='w-1/3 h-auto object-cover' />
              <div className='p-4 flex-1'>
                <div className='font-bold text-xl mb-2'>{book.title}</div>
                <p className='text-base'>by {book.author}</p>
              </div>
            </div>
          ))
        )}
        {!savedBooks[0] && <p>Book Not Found</p>}
      </div>
      <Footer />
    </div>
  );
};

export default SearchBooks;
