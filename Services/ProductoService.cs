using CrudAPI.Models;

namespace CrudAPI.Services
{
    public interface IProductoService
    {
        List<Producto> ObtenerTodos();
        Producto? ObtenerPorId(string id);
        Producto Crear(CreateProductoDto dto);
        Producto? Actualizar(string id, UpdateProductoDto dto);
        Producto? ActualizarParcial(string id, UpdateProductoDto dto);
        bool Eliminar(string id);
    }

    public class ProductoService : IProductoService
    {
        private static List<Producto> productos = new()
        {
            new Producto { Id = "1", Nombre = "Producto 1", Descripcion = "Descripción 1", Precio = 100 },
            new Producto { Id = "2", Nombre = "Producto 2", Descripcion = "Descripción 2", Precio = 200 }
        };

        public List<Producto> ObtenerTodos()
        {
            return productos;
        }

        public Producto? ObtenerPorId(string id)
        {
            return productos.FirstOrDefault(p => p.Id == id);
        }

        public Producto Crear(CreateProductoDto dto)
        {
            var nuevoProducto = new Producto
            {
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion,
                Precio = dto.Precio
            };

            productos.Add(nuevoProducto);
            return nuevoProducto;
        }

        public Producto? Actualizar(string id, UpdateProductoDto dto)
        {
            var producto = ObtenerPorId(id);
            if (producto == null)
                return null;

            if (!string.IsNullOrEmpty(dto.Nombre))
                producto.Nombre = dto.Nombre;
            if (!string.IsNullOrEmpty(dto.Descripcion))
                producto.Descripcion = dto.Descripcion;
            if (dto.Precio.HasValue)
                producto.Precio = dto.Precio.Value;

            return producto;
        }

        public Producto? ActualizarParcial(string id, UpdateProductoDto dto)
        {
            var producto = ObtenerPorId(id);
            if (producto == null)
                return null;

            if (!string.IsNullOrEmpty(dto.Nombre))
                producto.Nombre = dto.Nombre;
            if (!string.IsNullOrEmpty(dto.Descripcion))
                producto.Descripcion = dto.Descripcion;
            if (dto.Precio.HasValue)
                producto.Precio = dto.Precio.Value;

            return producto;
        }

        public bool Eliminar(string id)
        {
            var producto = ObtenerPorId(id);
            if (producto == null)
                return false;

            productos.Remove(producto);
            return true;
        }
    }
}
