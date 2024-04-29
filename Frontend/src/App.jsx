// import './App.css'
import {Routes,Route} from "react-router-dom";
import Home from './pages/Home';
import ShowBook from './pages/ShowBook';
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import SearchBooks from "./pages/SearchBooks";
import SelectShelf from "./pages/SelectShelf";
import ShelfBooks from "./pages/ShelfBooks";
import PageNotFound from "./pages/PageNotFound";


function App() {
  return (
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='api/books/:id' element={<ShowBook />} />
        <Route path='/api/signup' element={<SignUp />} />
        <Route path='/api/login' element={<Login />} />
        <Route path='/api/logout' element={<Logout />} />
        <Route path='/search-books' element={<SearchBooks />} />
        <Route path='/api/books/:id/shelf' element={<SelectShelf />} />
        <Route path='/api/books/shelf' element={<ShelfBooks />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
  )
}

export default App
