# CRUD Simple con Express

API REST sencilla con operaciones CRUD completas.

## Instalación

```bash
npm install
```

## Ejecutar

```bash
npm start
```

O en modo desarrollo con auto-reinicio:

```bash
npm run dev
```

## Endpoints

### 1. GET - Obtener todos los items
```
GET http://localhost:3000/api/items
```

Respuesta:
```json
[
  {
    "id": "1",
    "nombre": "Producto 1",
    "descripcion": "Descripción 1",
    "precio": 100
  }
]
```

### 2. GET - Obtener un item por ID
```
GET http://localhost:3000/api/items/:id
```

Ejemplo: `GET http://localhost:3000/api/items/1`

### 3. POST - Crear un nuevo item
```
POST http://localhost:3000/api/items
Content-Type: application/json

{
  "nombre": "Nuevo Producto",
  "descripcion": "Descripción del producto",
  "precio": 150
}
```

### 4. PUT - Actualizar un item completamente
```
PUT http://localhost:3000/api/items/:id
Content-Type: application/json

{
  "nombre": "Producto Actualizado",
  "descripcion": "Descripción actualizada",
  "precio": 250
}
```

### 5. PATCH - Actualizar parcialmente un item
Actualiza solo los campos especificados sin afectar los demás:

```
PATCH http://localhost:3000/api/items/:id
Content-Type: application/json

{
  "precio": 300
}
```

Respuesta:
```json
{
  "mensaje": "Item actualizado parcialmente",
  "item": {
    "id": "1",
    "nombre": "Producto 1",
    "descripcion": "Descripción 1",
    "precio": 300
  }
}
```

### 6. HEAD - Obtener headers de todos los items
Similar a GET pero solo devuelve headers sin cuerpo:

```
HEAD http://localhost:3000/api/items
```

Headers devueltos:
- `X-Total-Items`: Número total de items

### 7. HEAD - Obtener headers de un item específico
```
HEAD http://localhost:3000/api/items/:id
```

Headers devueltos:
- `X-Item-Found`: true/false
- `X-Item-Id`: ID del item

### 8. DELETE - Eliminar un item
```
DELETE http://localhost:3000/api/items/:id
```

Ejemplo: `DELETE http://localhost:3000/api/items/1`

## Estructura de datos

Cada item tiene:
- `id`: Identificador único (UUID)
- `nombre`: Nombre del producto
- `descripcion`: Descripción del producto
- `precio`: Precio del producto

## Ejemplo de uso con curl

```bash
# Obtener todos los items
curl http://localhost:3000/api/items

# Obtener un item específico
curl http://localhost:3000/api/items/1

# Crear un nuevo item
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Producto 3","descripcion":"Descripción 3","precio":300}'

# Actualizar un item completamente (PUT)
curl -X PUT http://localhost:3000/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Producto Modificado","precio":500}'

# Actualizar parcialmente un item (PATCH) - solo precio
curl -X PATCH http://localhost:3000/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{"precio":350}'

# Obtener headers de todos los items (HEAD)
curl -I http://localhost:3000/api/items

# Obtener headers de un item específico (HEAD)
curl -I http://localhost:3000/api/items/1

# Eliminar un item
curl -X DELETE http://localhost:3000/api/items/1
```
