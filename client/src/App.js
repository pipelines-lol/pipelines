import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateProfile from './pages/CreateProfile';

// context
import { useAuthContext } from "./hooks/useAuthContext";

// components
import Navbar from './components/Navbar';
import EditProfile from './pages/EditProfile';

function App() {

  const { user } = useAuthContext();

  return (
    <Router>
      <div className='flex flex-col w-screen min-h-screen bg-gray-100'>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          { user && <Route path="/create" element={<CreateProfile />} /> }
          { user && user.profileCreated && <Route path="/edit" element={<EditProfile />} /> }
        </Routes>
      </div>
    </Router>
  );
}

export default App;