# CRUD con ASP.NET Core

API REST completa con CRUD (Create, Read, Update, Delete) + PATCH y HEAD, desarrollada con ASP.NET Core 7.

## Requisitos

- .NET 7 SDK o superior instalado
- Visual Studio Code o Visual Studio 2022

## Instalación

1. Abre una terminal en la carpeta del proyecto
2. Restaura las dependencias:
   ```bash
   dotnet restore
   ```

## Ejecutar el servidor

Desde la carpeta del proyecto:

```bash
dotnet run
```

El servidor se ejecutará en:
- **HTTP**: `http://localhost:5000`
- **HTTPS**: `https://localhost:5001`

La interfaz web estará disponible en `http://localhost:5000`

## Swagger UI

Accede a la documentación interactiva en:
- `https://localhost:5001/swagger/ui` (HTTPS)
- `http://localhost:5000/swagger/ui` (HTTP)

## Endpoints de la API

### Base URL
```
http://localhost:5000/api/productos
```

### 1. GET - Obtener todos los productos
```
GET /api/productos
```

Respuesta:
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "nombre": "Producto 1",
    "descripcion": "Descripción del producto",
    "precio": 100.00
  }
]
```

### 2. GET - Obtener producto por ID
```
GET /api/productos/{id}
```

Ejemplo: `GET /api/productos/123e4567-e89b-12d3-a456-426614174000`

### 3. HEAD - Verificar existencia de productos
```
HEAD /api/productos
```

Headers devueltos:
- `X-Total-Items`: Número total de productos

### 4. HEAD - Verificar existencia de un producto
```
HEAD /api/productos/{id}
```

Headers devueltos:
- `X-Item-Found`: true
- `X-Item-Id`: ID del producto

### 5. POST - Crear nuevo producto
```
POST /api/productos
Content-Type: application/json

{
  "nombre": "Nuevo Producto",
  "descripcion": "Descripción del producto",
  "precio": 150.00
}
```

Respuesta (201 Created):
```json
{
  "id": "nuevo-uuid",
  "nombre": "Nuevo Producto",
  "descripcion": "Descripción del producto",
  "precio": 150.00
}
```

### 6. PUT - Actualizar producto completamente
```
PUT /api/productos/{id}
Content-Type: application/json

{
  "nombre": "Producto Actualizado",
  "descripcion": "Nueva descripción",
  "precio": 250.00
}
```

### 7. PATCH - Actualizar parcialmente
Actualiza solo los campos especificados:

```
PATCH /api/productos/{id}
Content-Type: application/json

{
  "precio": 300.00
}
```

Respuesta:
```json
{
  "mensaje": "Producto actualizado parcialmente",
  "item": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "nombre": "Producto 1",
    "descripcion": "Descripción original",
    "precio": 300.00
  }
}
```

### 8. DELETE - Eliminar producto
```
DELETE /api/productos/{id}
```

Respuesta:
```json
{
  "mensaje": "Producto eliminado",
  "item": { /* datos del producto eliminado */ }
}
```

## Ejemplos con cURL

```bash
# Obtener todos los productos
curl http://localhost:5000/api/productos

# Obtener un producto específico
curl http://localhost:5000/api/productos/1

# Crear un nuevo producto
curl -X POST http://localhost:5000/api/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Producto 3","descripcion":"Descripción 3","precio":300}'

# Actualizar completamente (PUT)
curl -X PUT http://localhost:5000/api/productos/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Modificado","descripcion":"Nueva desc","precio":500}'

# Actualizar parcialmente (PATCH)
curl -X PATCH http://localhost:5000/api/productos/1 \
  -H "Content-Type: application/json" \
  -d '{"precio":350}'

# Verificar existencia (HEAD)
curl -I http://localhost:5000/api/productos

# Eliminar un producto
curl -X DELETE http://localhost:5000/api/productos/1
```

## Estructura del proyecto

```
CrudAPI/
├── Controllers/
│   └── ProductosController.cs      # Controlador con todos los endpoints
├── Models/
│   ├── Producto.cs                 # Modelo de dominio
│   └── ProductoDto.cs              # DTOs para crear/actualizar
├── Services/
│   └── ProductoService.cs          # Lógica de negocio
├── wwwroot/
│   ├── index.html                  # Interfaz web
│   ├── styles.css                  # Estilos CSS
│   └── script.js                   # Lógica JavaScript
├── Program.cs                      # Configuración de la aplicación
└── CrudAPI.csproj                  # Archivo del proyecto
```

## Características

✅ **CRUD Completo**: Create, Read, Update, Delete
✅ **PATCH**: Actualización parcial de recursos
✅ **HEAD**: Verificación de existencia sin descargar datos
✅ **CORS Habilitado**: Acepta peticiones desde cualquier origen
✅ **Swagger UI**: Documentación interactiva
✅ **Interfaz Web**: UI moderna y responsiva
✅ **Validaciones**: Validación de datos en servidor
✅ **Almacenamiento en memoria**: No requiere base de datos

## Notas importantes

- Los datos se almacenan en memoria y se perderán al reiniciar la aplicación
- Para persistencia de datos, implementar Entity Framework Core con una base de datos
- La interfaz web se sirve automáticamente en la raíz (`/`)
- Todos los endpoints devuelven JSON
