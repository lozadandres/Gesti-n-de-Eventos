import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  MenuItem, 
  Button, 
  Container, 
  Avatar, 
  Tooltip 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

const NavBar = () => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      let userData = null;
      if (userStr && userStr !== "undefined") {
          try {
            userData = JSON.parse(userStr);
          } catch (e) {
            console.error("Error parsing user data:", e);
          }
      }
      
      if (userData && token) {
        setIsLoggedIn(true);
        setUserName(userData.name);
        setIsAdmin(userData.isAdmin || false);
      } else {
        setIsLoggedIn(false);
        setUserName('');
        setIsAdmin(false);
      }
    };

    checkLoginStatus();
    // Listen for storage events (e.g. login/logout in other tabs or components)
    window.addEventListener('storage', checkLoginStatus);
    // Custom event dispatch for immediate updates within the same tab if needed
    window.addEventListener('auth-change', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('auth-change', checkLoginStatus);
    };
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    Swal.fire({
      icon: 'question',
      title: 'Cerrar Sesión',
      text: '¿Estás seguro de que deseas salir?',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: "#3a043a", // Keeping the brand color
      background: '#1e1e1e', // Dark theme background
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserName('');
        setIsAdmin(false);
        
        // Dispatch event so other components know (if they listen)
        window.dispatchEvent(new Event('auth-change'));

        Swal.fire({
            icon: 'success',
            title: 'Hasta pronto',
            timer: 1500,
            showConfirmButton: false,
            background: '#1e1e1e',
            color: '#fff'
        }).then(() => {
           navigate('/login');
        });
      }
    });
  };

  return (
    <AppBar position="fixed" 
        sx={{ 
            background: 'rgba(15, 12, 41, 0.7)', // Glassmorphism base
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: 'none'
        }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* LOGO - Desktop */}
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': { color: 'primary.main' }
            }}
          >
            EVENTOS
          </Typography>

          {/* MENU - Mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/'); }}>
                <Typography textAlign="center">Inicio</Typography>
              </MenuItem>
              {isLoggedIn && (
                  <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/dashboard'); }}>
                    <Typography textAlign="center">Dashboard</Typography>
                  </MenuItem>
              )}
            </Menu>
          </Box>

          {/* LOGO - Mobile */}
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            EVENTOS
          </Typography>

          {/* MENU - Desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
                onClick={() => navigate('/')}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                Inicio
            </Button>
            {isLoggedIn && isAdmin && (
                <Button
                    onClick={() => navigate('/dashboard')}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                >
                    Dashboard
                </Button>
            )}
          </Box>

          {/* USER SETTINGS */}
          <Box sx={{ flexGrow: 0 }}>
            {isLoggedIn ? (
                <>
                    <Tooltip title="Abrir configuración">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                            {userName ? userName.charAt(0).toUpperCase() : <AccountCircleIcon />}
                        </Avatar>
                    </IconButton>
                    </Tooltip>
                    <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    >
                    <MenuItem disabled>
                        <Typography textAlign="center" variant="body2" sx={{ opacity: 0.7 }}>
                            Hola, {userName}
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography textAlign="center">Cerrar Sesión</Typography>
                    </MenuItem>
                    </Menu>
                </>
            ) : (
                <Button 
                    color="primary" 
                    variant="contained" 
                    endIcon={<LoginIcon />}
                    onClick={() => navigate('/login')}
                >
                    Login
                </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavBar;