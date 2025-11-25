const API_URL = 'http://localhost:5000/api/productos';

// Elementos del DOM
const productForm = document.getElementById('productForm');
const productsList = document.getElementById('productsList');
const clearBtn = document.getElementById('clearBtn');
const productId = document.getElementById('productId');
const nombreInput = document.getElementById('nombre');
const descripcionInput = document.getElementById('descripcion');
const precioInput = document.getElementById('precio');
const submitBtn = document.getElementById('submitBtn');
const loadingSpinner = document.getElementById('loadingSpinner');

// Cargar productos al iniciar
loadProducts();

// Event Listeners
productForm.addEventListener('submit', handleSubmit);
clearBtn.addEventListener('click', clearForm);

// Función para cargar todos los productos
async function loadProducts() {
    showSpinner(true);
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const products = await response.json();
        
        productsList.innerHTML = '';
        
        if (products.length === 0) {
            productsList.innerHTML = '<p class="empty-message">No hay productos. ¡Crea uno!</p>';
        } else {
            products.forEach(product => {
                const productCard = createProductCard(product);
                productsList.appendChild(productCard);
            });
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        productsList.innerHTML = '<p class="empty-message">Error al cargar los productos. Verifica la conexión.</p>';
        showAlert('Error al cargar los productos: ' + error.message, 'error');
    } finally {
        showSpinner(false);
    }
}

// Crear tarjeta de producto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <h3>${escapeHtml(product.nombre)}</h3>
        <p class="product-id">ID: ${product.id}</p>
        <p>${escapeHtml(product.descripcion)}</p>
        <p class="price">$${product.precio.toFixed(2)}</p>
        <div class="product-actions">
            <button class="btn-edit" onclick="editProduct('${product.id}', '${escapeHtml(product.nombre)}', '${escapeHtml(product.descripcion)}', ${product.precio})">Editar</button>
            <button class="btn-patch" onclick="patchProduct('${product.id}')">Patch</button>
            <button class="btn-delete" onclick="deleteProduct('${product.id}', '${escapeHtml(product.nombre)}')">Eliminar</button>
        </div>
    `;
    return card;
}

// Manejar envío del formulario
async function handleSubmit(e) {
    e.preventDefault();
    
    const id = productId.value;
    const nombre = nombreInput.value.trim();
    const descripcion = descripcionInput.value.trim();
    const precio = parseFloat(precioInput.value);
    
    if (!nombre || !descripcion || isNaN(precio)) {
        showAlert('Por favor, completa todos los campos correctamente', 'error');
        return;
    }
    
    const data = { nombre, descripcion, precio };
    
    try {
        if (id) {
            // Actualizar producto existente
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                showAlert('Producto actualizado correctamente', 'success');
            } else {
                showAlert('Error al actualizar el producto', 'error');
            }
        } else {
            // Crear nuevo producto
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                showAlert('Producto creado correctamente', 'success');
            } else {
                showAlert('Error al crear el producto', 'error');
            }
        }
        
        clearForm();
        loadProducts();
    } catch (error) {
        console.error('Error:', error);
        showAlert('Ocurrió un error inesperado', 'error');
    }
}

// Editar producto
function editProduct(id, nombre, descripcion, precio) {
    productId.value = id;
    nombreInput.value = nombre;
    descripcionInput.value = descripcion;
    precioInput.value = precio;
    submitBtn.textContent = 'Actualizar Producto';
    nombreInput.focus();
    
    // Scroll al formulario
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// PATCH - Actualizar parcialmente un producto
async function patchProduct(id) {
    const precioActual = prompt('Ingresa el nuevo precio (déjalo vacío para no cambiar):');
    
    if (precioActual === null) return;
    
    const data = {};
    if (precioActual !== '') {
        data.precio = parseFloat(precioActual);
        if (isNaN(data.precio)) {
            showAlert('El precio debe ser un número válido', 'error');
            return;
        }
    }
    
    if (Object.keys(data).length === 0) {
        showAlert('No hay nada que actualizar', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showAlert('Producto actualizado parcialmente', 'success');
            loadProducts();
        } else {
            showAlert('Error al actualizar el producto', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Ocurrió un error al actualizar', 'error');
    }
}

// Eliminar producto
async function deleteProduct(id, nombre) {
    if (!confirm(`¿Estás seguro de que deseas eliminar "${nombre}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showAlert('Producto eliminado correctamente', 'success');
            loadProducts();
        } else {
            showAlert('Error al eliminar el producto', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Ocurrió un error al eliminar', 'error');
    }
}

// Limpiar formulario
function clearForm() {
    productForm.reset();
    productId.value = '';
    submitBtn.textContent = 'Crear Producto';
}

// Mostrar alertas
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} show`;
    alert.textContent = message;
    
    document.querySelector('.form-section').insertBefore(alert, document.querySelector('.form-section').firstChild);
    
    setTimeout(() => {
        alert.remove();
    }, 4000);
}

// Mostrar/ocultar spinner
function showSpinner(show) {
    loadingSpinner.style.display = show ? 'block' : 'none';
}

// Escapar HTML para evitar XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
