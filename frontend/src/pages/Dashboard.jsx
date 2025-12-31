import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Grid, Container, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Select, InputLabel, FormControl, Typography, Card } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { getItems, addItem, updateItem, deleteItem } from "../service/itemService";
const Dashboard = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ name: "", date: "", time: "", location: "", description: "" });
    const [editingId, setEditingId] = useState(null);
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");

    // Verificar autenticación y permisos
    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        
        if (!token || !user?.isAdmin) {
            Swal.fire({
                icon: "error",
                title: "Acceso Denegado",
                text: "Debes ser administrador para acceder",
                confirmButtonColor: "#3a043a",
            }).then(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
            });
        }
        
        loadItems();
    }, [navigate]);


    
    const loadItems = async () => {
        try {
            const data = await getItems();
            setItems(data);
            setFilteredItems(data);
        } catch (error) {
            console.error('Error al cargar eventos:', error);
            if (error.message.includes('Sesión expirada')) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sesión Expirada',
                    text: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
                    confirmButtonColor: "#3a043a",
                }).then(() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login");
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar los eventos. Por favor intenta más tarde.',
                    confirmButtonColor: "#3a043a",
                });
            }
        }
    };
    
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateItem(editingId, form);
                Swal.fire({
                    title: "Actualizado",
                    text: "Elemento actualizado con éxito",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                setEditingId(null);
            } else {
                await addItem(form);
                Swal.fire({
                    title: "Agregado",
                    text: "Elemento agregado con éxito",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            }
            setForm({ name: "", date: "", time: "", location: "", description: "" });
            loadItems();
        } catch (error) {
            console.error('Error al guardar evento:', error);
            if (error.message.includes('Sesión expirada')) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sesión Expirada',
                    text: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
                    confirmButtonColor: "#3a043a",
                }).then(() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login");
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo guardar el evento. Por favor intenta más tarde.',
                    confirmButtonColor: "#3a043a",
                });
            }
        }
    };

    const handleEdit = (item) => {
        setForm(item);
        setEditingId(item._id);
        Swal.fire({
            title: "Modo de edición",
            text: `Editando: ${item.name}`,
            icon: "info",
            confirmButtonText: "Entendido",
        });
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
    
        if (result.isConfirmed) {
            try {
                await deleteItem(id);
                Swal.fire("Eliminado", "El elemento ha sido eliminado.", "success");
                loadItems();
            } catch (error) {
                console.error('Error al eliminar evento:', error);
                if (error.message.includes('Sesión expirada')) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Sesión Expirada',
                        text: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
                        confirmButtonColor: "#3a043a",
                    }).then(() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        navigate("/login");
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo eliminar el evento. Por favor intenta más tarde.',
                        confirmButtonColor: "#3a043a",
                    });
                }
            }
        }
    };

    const handleDateFilter = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        const filtered = items.filter(item => item.date === date);
        setFilteredItems(filtered);
    };
    
    const handleLocationFilter = (e) => {
        const location = e.target.value;
        setSelectedLocation(location);
        const filtered = items.filter(item => item.location === location);
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
        <Box sx={{ minHeight: '100vh', pb: 10, pt: 4 }}>
            <Container maxWidth="lg">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box sx={{ 
                        mb: 4, 
                        p: 4, 
                        borderRadius: 4, 
                        background: 'linear-gradient(135deg, rgba(58, 4, 58, 0.8) 0%, rgba(15, 12, 41, 0.9) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                    }}>
                        <Typography variant="h4" sx={{ 
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #fff 30%, #b4ff46 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Panel Administrativo
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                            Gestiona tus eventos de forma profesional
                        </Typography>
                    </Box>
                </motion.div>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ p: 3, height: '100%', bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                                {editingId ? "Editar Evento" : "Agregar Nuevo Evento"}
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="name"
                                            name="name"
                                            label="Nombre del Evento"
                                            variant="filled"
                                            value={form.name}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="date"
                                            name="date"
                                            type="date"
                                            variant="filled"
                                            InputLabelProps={{ shrink: true }}
                                            label="Fecha"
                                            value={form.date}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="time"
                                            name="time"
                                            type="time"
                                            variant="filled"
                                            InputLabelProps={{ shrink: true }}
                                            label="Hora"
                                            value={form.time}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="location"
                                            name="location"
                                            label="Ubicación"
                                            variant="filled"
                                            value={form.location}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="description"
                                            name="description"
                                            label="Descripción"
                                            multiline
                                            rows={3}
                                            variant="filled"
                                            value={form.description}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button 
                                            type="submit" 
                                            variant="contained" 
                                            fullWidth 
                                            sx={{ 
                                                mt: 2,
                                                height: '50px',
                                                borderRadius: 2,
                                                background: editingId ? 'linear-gradient(45deg, #d500f9, #7b1fa2)' : 'linear-gradient(45deg, #b4ff46, #8bc34a)',
                                                color: editingId ? '#fff' : '#000',
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    transform: 'scale(1.02)',
                                                    transition: '0.2s'
                                                }
                                            }}
                                        >
                                            {editingId ? "Actualizar Evento" : "Crear Evento"}
                                        </Button>
                                        {editingId && (
                                            <Button 
                                                fullWidth 
                                                sx={{ mt: 1 }} 
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setForm({ name: "", date: "", time: "", location: "", description: "" });
                                                }}
                                            >
                                                Cancelar Edición
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>
                            </form>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Card sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                                <Typography variant="h6">Eventos Registrados</Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <FormControl size="small" sx={{ minWidth: 150 }}>
                                        <InputLabel>Fecha</InputLabel>
                                        <Select value={selectedDate} label="Fecha" onChange={handleDateFilter}>
                                            <MenuItem value="">Todas</MenuItem>
                                            {dates.map(date => <MenuItem key={date} value={date}>{date}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    <FormControl size="small" sx={{ minWidth: 150 }}>
                                        <InputLabel>Ubicación</InputLabel>
                                        <Select value={selectedLocation} label="Ubicación" onChange={handleLocationFilter}>
                                            <MenuItem value="">Todas</MenuItem>
                                            {locations.map(loc => <MenuItem key={loc} value={loc}>{loc}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    {(selectedDate || selectedLocation) && (
                                        <Button onClick={clearFilters} variant="text" size="small">Limpiar</Button>
                                    )}
                                </Box>
                            </Box>

                            <TableContainer>
                                <Table sx={{ minWidth: 650 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Evento</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Fecha / Hora</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Ubicación</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <AnimatePresence>
                                            {filteredItems.map((item) => (
                                                <TableRow key={item._id} component={motion.tr} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                    <TableCell>
                                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ 
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 1,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden'
                                                        }}>
                                                            {item.description}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <Typography variant="body2">{item.date}</Typography>
                                                            <Typography variant="caption" color="text.secondary">{item.time}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{item.location}</TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Button 
                                                                variant="outlined" 
                                                                size="small" 
                                                                onClick={() => handleEdit(item)}
                                                                sx={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                                                            >
                                                                Editar
                                                            </Button>
                                                            <Button 
                                                                variant="outlined" 
                                                                size="small" 
                                                                color="error"
                                                                onClick={() => handleDelete(item._id)}
                                                            >
                                                                Eliminar
                                                            </Button>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </AnimatePresence>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {filteredItems.length === 0 && (
                                <Box sx={{ py: 6, textAlign: 'center', opacity: 0.5 }}>
                                    <Typography>No se encontraron eventos</Typography>
                                </Box>
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Dashboard;