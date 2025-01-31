import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Dashboars from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import "./index.css"; 

const ConditionalNavBar = () => {
    const location = useLocation();
    const hideNavBarRoutes = ['/login', '/regster', "/Dashboard"];
    
    return !hideNavBarRoutes.includes(location.pathname) ? <NavBar /> : null;
  };
  function App() {
    
  
    return (
      <Router>
        <ConditionalNavBar />
  
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/regster" element={<Register />} />
          <Route path="/dashboard" element={<Dashboars />} />
        </Routes>
  
        
        <Footer />
      </Router>
    );
  }
  
  export default App;
