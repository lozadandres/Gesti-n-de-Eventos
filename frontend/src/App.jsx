import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import "./index.css"; 

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';

const ConditionalNavBar = () => {
    const location = useLocation();
    const hideNavBarRoutes = ['/login', '/regster']; // Removed Dashboard from hide list to show nav there potentially
    
    return !hideNavBarRoutes.includes(location.pathname) ? <NavBar /> : null;
  };

  function App() {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <ConditionalNavBar />
    
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/regster" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
    
          <Footer />
        </Router>
      </ThemeProvider>
    );
  }
  
  export default App;
