using CrudAPI.Models;
using CrudAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CrudAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly IProductoService _productoService;

        public ProductosController(IProductoService productoService)
        {
            _productoService = productoService;
        }

        // GET - Obtener todos los productos
        [HttpGet]
        public ActionResult<IEnumerable<Producto>> ObtenerTodos()
        {
            var productos = _productoService.ObtenerTodos();
            return Ok(productos);
        }

        // GET - Obtener producto por ID
        [HttpGet("{id}")]
        public ActionResult<Producto> ObtenerPorId(string id)
        {
            var producto = _productoService.ObtenerPorId(id);
            if (producto == null)
                return NotFound(new { error = "Producto no encontrado" });

            return Ok(producto);
        }

        // HEAD - Verificar existencia de todos los productos
        [HttpHead]
        public IActionResult VerificarProductos()
        {
            var productos = _productoService.ObtenerTodos();
            Response.Headers.Append("X-Total-Items", productos.Count.ToString());
            return Ok();
        }

        // HEAD - Verificar existencia de un producto específico
        [HttpHead("{id}")]
        public IActionResult VerificarProducto(string id)
        {
            var producto = _productoService.ObtenerPorId(id);
            if (producto == null)
                return NotFound();

            Response.Headers.Append("X-Item-Found", "true");
            Response.Headers.Append("X-Item-Id", producto.Id);
            return Ok();
        }

        // POST - Crear nuevo producto
        [HttpPost]
        public ActionResult<Producto> Crear([FromBody] CreateProductoDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nombre) || 
                string.IsNullOrWhiteSpace(dto.Descripcion) || 
                dto.Precio <= 0)
            {
                return BadRequest(new { error = "Todos los campos son requeridos y el precio debe ser mayor a 0" });
            }

            var producto = _productoService.Crear(dto);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = producto.Id }, producto);
        }

        // PUT - Actualizar producto completamente
        [HttpPut("{id}")]
        public ActionResult<Producto> Actualizar(string id, [FromBody] UpdateProductoDto dto)
        {
            var producto = _productoService.Actualizar(id, dto);
            if (producto == null)
                return NotFound(new { error = "Producto no encontrado" });

            return Ok(producto);
        }

        // PATCH - Actualizar parcialmente
        [HttpPatch("{id}")]
        public ActionResult<object> ActualizarParcial(string id, [FromBody] UpdateProductoDto dto)
        {
            var producto = _productoService.ActualizarParcial(id, dto);
            if (producto == null)
                return NotFound(new { error = "Producto no encontrado" });

            return Ok(new { mensaje = "Producto actualizado parcialmente", item = producto });
        }

        // DELETE - Eliminar producto
        [HttpDelete("{id}")]
        public ActionResult<object> Eliminar(string id)
        {
            var producto = _productoService.ObtenerPorId(id);
            if (producto == null)
                return NotFound(new { error = "Producto no encontrado" });

            _productoService.Eliminar(id);
            return Ok(new { mensaje = "Producto eliminado", item = producto });
        }
    }
}
