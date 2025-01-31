import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Importa SweetAlert2
import { TextField, Button, Grid, Container, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, InputLabel, FormControl, AppBar, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
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

    // Función para cerrar sesión
    const handleLogout = () => {
        Swal.fire({
            title: "Cerrar Sesión",
            text: "¿Estás seguro de querer salir?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3a043a",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, salir",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
            }
        });
    };
    
    const loadItems = async () => {
        const data = await getItems();
        setItems(data);
        setFilteredItems(data);
    };
    
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            await deleteItem(id);
            Swal.fire("Eliminado", "El elemento ha sido eliminado.", "success");
            loadItems();
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
        <Container maxWidth="md">
            <AppBar position="static" sx={{ mb: 4, bgcolor: "#3a043a" }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Panel Administrativo
                    </Typography>
                    <Button 
                        color="inherit" 
                        onClick={handleLogout}
                        sx={{ textTransform: 'none' }}
                    >
                        Cerrar Sesión
                    </Button>
                </Toolbar>
            </AppBar>
            <h1>CRUD App con React y Express</h1>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            fullWidth
                            id="name"
                            name="name"
                            label="Nombre"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            fullWidth
                            id="date"
                            name="date"
                            type="date"
                            value={form.date}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            fullWidth
                            id="time"
                            name="time"
                            type="time"
                            value={form.time}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            fullWidth
                            id="location"
                            name="location"
                            label="Ubicación"
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
                            rows={4}
                            value={form.description}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" sx={{bgcolor: "#3a043a"}}>
                            {editingId ? "Actualizar" : "Agregar"}
                        </Button>
                    </Grid>
                </Grid>
            </form>


            <Box mt={3}>
                <h2>Eventos</h2>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth={true}>
                            <InputLabel id="date-label">Fecha:</InputLabel>
                            <Select value={selectedDate} onChange={handleDateFilter}>
                                <MenuItem value="">Filtrar por fecha</MenuItem>
                                {dates.map(date => (
                                    <MenuItem key={date} value={date}>{date}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth={true}>
                            <InputLabel id="location-label">Ubicación:</InputLabel>
                            <Select value={selectedLocation} onChange={handleLocationFilter}>
                                <MenuItem value="">Filtrar por ubicación</MenuItem>
                                {locations.map(location => (
                                    <MenuItem key={location} value={location}>{location}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button variant="contained" onClick={clearFilters} style={{height:55}} sx={{bgcolor: "#3a043a"}}>Limpiar filtros</Button>
                    </Grid>
                </Grid>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Hora</TableCell>
                                <TableCell>Ubicación</TableCell>
                                <TableCell>Descripción</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredItems.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell>{item.time}</TableCell>
                                    <TableCell>{item.location}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>
                                        <Button size="small" onClick={() => handleEdit(item)} sx={{bgcolor: "#3a043a", color:"#fff"}}>
                                            Editar
                                        </Button>
                                        <Button size="small" onClick={() => handleDelete(item._id)} sx={{bgcolor: "red", color:"#fff"}}>
                                            Eliminar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Box>
        </Container>
    );
};

export default Dashboard;