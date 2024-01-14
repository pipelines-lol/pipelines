import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// pages
import Home from './pages/Home';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Login from './pages/Login';
import Signup from './pages/Signup';

import Discover from './pages/Discover';

import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Suggestions from './pages/Suggestions';


// import Test from './testing/Test';

// context
import { useAuthContext } from "./hooks/useAuthContext";

// components
import Search from './pages/Search';


function App() {

  const { user } = useAuthContext();

  return (
    <Router>
      <div className='flex flex-col w-screen min-h-screen bg-gray-100'>
        <Navbar />

        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/search" element={<Search />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/discover" element={<Discover />} />
          
          { user && user.profileCreated && <Route path="/edit" element={<EditProfile />} /> }

          { /* User Profiles */ }
          <Route path="/user/:id" element={<Profile />} />

          { /* Suggestions */ }
          <Route path = "/Suggestions" element = {<Suggestions />} />

          { /* TESTING */ }
          { /* process.env.REACT_APP_NODE_ENV === "DEV" && <Route path="/test" element={<Test />} /> */ }
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;