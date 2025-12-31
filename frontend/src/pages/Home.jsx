import { useState, useEffect } from "react";
import { 
    Grid, 
    Container, 
    Typography, 
    Box, 
    Card, 
    CardContent, 
    Chip, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Button 
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Swal from 'sweetalert2';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { getItems } from "../service/itemService";

// Helper for animations
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
};

const Home = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const data = await getItems();
            setItems(data);
            setFilteredItems(data);
        } catch (error) {
            console.error('Error al cargar eventos:', error);
            if (error.message && error.message.includes('Sesión expirada')) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sesión Expirada',
                    text: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
                    confirmButtonColor: "#b4ff46",
                    background: '#1e1e1e',
                    color: '#fff'
                }).then(() => {
                    window.location.href = '/login';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar los eventos. Por favor intenta más tarde.',
                    confirmButtonColor: "#d500f9",
                    background: '#1e1e1e',
                    color: '#fff'
                });
            }
        }
    };

    const handleDateFilter = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        filterItems(date, selectedLocation);
    };
    
    const handleLocationFilter = (e) => {
        const location = e.target.value;
        setSelectedLocation(location);
        filterItems(selectedDate, location);
    };

    const filterItems = (date, location) => {
        let filtered = items;
        if (date) {
            filtered = filtered.filter(item => item.date === date);
        }
        if (location) {
            filtered = filtered.filter(item => item.location === location);
        }
        setFilteredItems(filtered);
    };

    const clearFilters = () => {
        setSelectedDate("");
        setSelectedLocation("");
        setFilteredItems(items);
    }

    const dates = [...new Set(items.map(item => item.date))];
    const locations = [...new Set(items.map(item => item.location))];

    return (
        <Box sx={{ minHeight: '100vh', pb: 10 }}>
            {/* HERO SECTION */}
            <Box
                sx={{
                    pt: { xs: 15, md: 20 },
                    pb: { xs: 8, md: 10 },
                    textAlign: 'center',
                    background: 'radial-gradient(circle at 50% 20%, rgba(180, 260, 70, 0.15) 0%, rgba(15, 12, 41, 0) 60%)'
                }}
            >
                <Container maxWidth="md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography variant="h1" gutterBottom sx={{ 
                            background: 'linear-gradient(45deg, #fff 30%, #b4ff46 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-2px'
                        }}>
                            Descubre Experiencias <br /> Inolvidables
                        </Typography>
                        <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
                            Explora los mejores eventos, conciertos y talleres en tu ciudad.
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* FILTERS */}
                <Box sx={{ mb: 6, p: 3, borderRadius: 4, bgcolor: 'background.paper', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="date-label">Filtrar por Fecha</InputLabel>
                                <Select
                                    labelId="date-label"
                                    value={selectedDate}
                                    label="Filtrar por Fecha"
                                    onChange={handleDateFilter}
                                >
                                    <MenuItem value=""><em>Todas las fechas</em></MenuItem>
                                    {dates.map(date => (
                                        <MenuItem key={date} value={date}>{date}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="location-label">Filtrar por Ubicación</InputLabel>
                                <Select
                                    labelId="location-label"
                                    value={selectedLocation}
                                    label="Filtrar por Ubicación"
                                    onChange={handleLocationFilter}
                                >
                                    <MenuItem value=""><em>Todas las ubicaciones</em></MenuItem>
                                    {locations.map(location => (
                                        <MenuItem key={location} value={location}>{location}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button 
                                variant="outlined" 
                                fullWidth 
                                onClick={clearFilters}
                                startIcon={<SearchOffIcon />}
                                color="secondary"
                                sx={{ height: '40px' }}
                            >
                                Limpiar Filtros
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                {/* EVENTS GRID */}
                <Grid container spacing={4}>
                    <AnimatePresence>
                        {filteredItems.map((item, i) => (
                            <Grid item xs={12} sm={6} md={4} key={item._id} component={motion.div} layout
                                custom={i}
                                initial="hidden"
                                animate="visible"
                                variants={cardVariants}
                            >
                                <Card sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    position: 'relative',
                                    overflow: 'visible',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 30px rgba(0,0,0,0.5)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}>
                                    <Box sx={{ 
                                        position: 'absolute', 
                                        top: -15, 
                                        right: 20, 
                                        bgcolor: 'primary.main', 
                                        color: '#000', 
                                        fontWeight: 'bold', 
                                        py: 0.5, 
                                        px: 2, 
                                        borderRadius: 20,
                                        zIndex: 1,
                                        boxShadow: '0 4px 10px rgba(180, 260, 70, 0.4)'
                                    }}>
                                        {item.date}
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1, pt: 4 }}>
                                        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 700 }}>
                                            {item.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {item.description}
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                                            <Chip icon={<AccessTimeIcon />} label={item.time} size="small" variant="outlined" />
                                            <Chip icon={<LocationOnIcon />} label={item.location} size="small" variant="outlined" color="secondary" />
                                        </Box>
                                    </CardContent>
                                    
                                    <Box sx={{ p: 2, pt: 0 }}>
                                        <Button variant="contained" fullWidth>
                                            Ver Detalles
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </AnimatePresence>
                </Grid>

                {filteredItems.length === 0 && (
                    <Box sx={{ textAlign: 'center', mt: 10, opacity: 0.5 }}>
                        <SearchOffIcon sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h6">No hay eventos que coincidan con tu búsqueda.</Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default Home;