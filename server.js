const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware - CORS primero
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Base de datos simulada (almacenamiento en memoria)
let items = [
    { id: '1', nombre: 'Producto 1', descripcion: 'Descripción 1', precio: 100 },
    { id: '2', nombre: 'Producto 2', descripcion: 'Descripción 2', precio: 200 }
];

// GET - Obtener todos los items
app.get('/api/items', (req, res) => {
    res.json(items);
});

// GET - Obtener un item por ID
app.get('/api/items/:id', (req, res) => {
    const item = items.find(i => i.id === req.params.id);
    if (!item) {
        return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.json(item);
});

// POST - Crear un nuevo item
app.post('/api/items', (req, res) => {
    const { nombre, descripcion, precio } = req.body;

    // Validación
    if (!nombre || !descripcion || !precio) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const newItem = {
        id: uuidv4(),
        nombre,
        descripcion,
        precio
    };

    items.push(newItem);
    res.status(201).json(newItem);
});

// PUT - Actualizar un item completamente
app.put('/api/items/:id', (req, res) => {
    const item = items.find(i => i.id === req.params.id);
    if (!item) {
        return res.status(404).json({ error: 'Item no encontrado' });
    }

    const { nombre, descripcion, precio } = req.body;

    // Actualizar solo los campos proporcionados
    if (nombre) item.nombre = nombre;
    if (descripcion) item.descripcion = descripcion;
    if (precio) item.precio = precio;

    res.json(item);
});

// PATCH - Actualizar parcialmente un item
app.patch('/api/items/:id', (req, res) => {
    const item = items.find(i => i.id === req.params.id);
    if (!item) {
        return res.status(404).json({ error: 'Item no encontrado' });
    }

    const { nombre, descripcion, precio } = req.body;

    // Actualizar solo los campos que se proporcionen
    if (nombre !== undefined) item.nombre = nombre;
    if (descripcion !== undefined) item.descripcion = descripcion;
    if (precio !== undefined) item.precio = precio;

    res.json({ mensaje: 'Item actualizado parcialmente', item });
});

// HEAD - Obtener headers sin cuerpo (similar a GET)
app.head('/api/items', (req, res) => {
    res.set('X-Total-Items', items.length);
    res.set('Content-Type', 'application/json');
    res.sendStatus(200);
});

// HEAD - Obtener headers de un item específico
app.head('/api/items/:id', (req, res) => {
    const item = items.find(i => i.id === req.params.id);
    if (!item) {
        return res.sendStatus(404);
    }
    res.set('X-Item-Found', 'true');
    res.set('X-Item-Id', item.id);
    res.set('Content-Type', 'application/json');
    res.sendStatus(200);
});

// DELETE - Eliminar un item
app.delete('/api/items/:id', (req, res) => {
    const index = items.findIndex(i => i.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Item no encontrado' });
    }

    const deletedItem = items.splice(index, 1);
    res.json({ mensaje: 'Item eliminado', item: deletedItem[0] });
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
