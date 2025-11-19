# Gestión de Productos - Panel de Administración

## Descripción General

El módulo de gestión de productos permite a los administradores crear, editar, eliminar y gestionar el catálogo de productos del sitio cuando **Google Sheets no está configurado**. Todos los datos se guardan en `localStorage` del navegador.

## Características

### 1. Crear Productos
- Agregar nuevos productos con nombre, categoría, descripción, precio y stock
- Crear nuevas categorías sobre la marcha
- Validación de datos en tiempo real
- Timestamps automáticos de creación y actualización

### 2. Editar Productos
- Modificar cualquier campo del producto
- Actualizar precios y stock
- Historial de cambios con timestamps
- Validación de datos antes de guardar

### 3. Eliminar Productos
- Eliminar productos individuales con confirmación
- Protección contra eliminación accidental

### 4. Búsqueda y Filtrado
- Buscar productos por nombre en tiempo real
- Filtrar por categoría
- Limpiar filtros rápidamente

### 5. Importación/Exportación
- **Exportar**: Descargar todos los productos en formato JSON
- **Importar**: Cargar productos desde un archivo JSON
- Fusión inteligente de datos (actualiza existentes, agrega nuevos)

### 6. Gestión de Categorías
- Crear categorías automáticamente
- Ver todas las categorías disponibles
- Filtrar por categoría

## Estructura de Datos

### Formato de Producto

```javascript
{
    id: "prod_1705315800000_abc123",           // ID único generado automáticamente
    name: "Poste de Hormigón 2.5m",            // Nombre del producto
    category: "Postes",                        // Categoría
    description: "Descripción del producto",   // Descripción (opcional)
    price: 3500,                               // Precio en ARS
    stock: 150,                                // Cantidad en stock
    createdAt: "2024-01-15T10:30:00.000Z",    // Fecha de creación
    updatedAt: "2024-01-15T10:30:00.000Z"     // Fecha de última actualización
}
```

### Almacenamiento en localStorage

```
Clave: ferreteria_products
Valor: Array JSON de productos
```

## Cómo Usar

### Acceder al Panel de Administración

1. Abre `admin.html` en tu navegador
2. Ingresa la contraseña (por defecto: `admin123`)
3. Haz clic en la pestaña "Productos"

### Agregar un Producto

1. Haz clic en el botón "Agregar Producto"
2. Completa los campos requeridos:
   - **Nombre**: Nombre del producto
   - **Categoría**: Selecciona una existente o crea una nueva
   - **Descripción**: Información adicional (opcional)
   - **Precio**: Precio en ARS
   - **Stock**: Cantidad disponible
3. Haz clic en "Guardar Producto"

### Editar un Producto

1. Busca el producto en la tabla
2. Haz clic en el botón "Editar"
3. Modifica los campos necesarios
4. Haz clic en "Guardar Cambios"

### Eliminar un Producto

1. Busca el producto en la tabla
2. Haz clic en el botón "Eliminar"
3. Confirma la eliminación

### Buscar y Filtrar

1. Usa el campo de búsqueda para buscar por nombre
2. Usa el dropdown de categoría para filtrar
3. Haz clic en "Limpiar" para resetear los filtros

### Exportar Productos

1. Haz clic en el botón "Exportar"
2. Se descargará un archivo JSON con todos los productos
3. El archivo se nombra automáticamente: `productos_YYYY-MM-DD.json`

### Importar Productos

1. Haz clic en el botón "Importar"
2. Selecciona un archivo JSON válido
3. Los productos se fusionarán con los existentes:
   - Si el ID existe, se actualiza
   - Si el ID es nuevo, se agrega

## Validación de Datos

El sistema valida automáticamente:

- ✓ Nombre del producto (requerido, no vacío)
- ✓ Categoría (requerida, no vacía)
- ✓ Precio (número válido, >= 0)
- ✓ Stock (número válido, >= 0)
- ✓ Descripción (opcional, sin límite de caracteres)

## Integración con el Catálogo

Los productos creados en el panel de administración se cargan automáticamente en:

1. **Catálogo del sitio**: Los productos aparecen en la sección de productos
2. **Calculadora**: Los productos están disponibles para cotizaciones
3. **Comparador**: Los productos pueden compararse

## Configuración

### Cambiar la Contraseña de Admin

1. Abre la consola del navegador (F12)
2. Ejecuta:
   ```javascript
   localStorage.setItem('ferreteria_admin_password', btoa('nueva_contraseña'));
   ```
3. Recarga la página

### Usar Google Sheets en lugar de localStorage

Si deseas usar Google Sheets para gestionar productos:

1. Abre `config.js`
2. Cambia `enableGoogleSheets` a `true`
3. Configura el `spreadsheetId` y `apiKey`
4. El panel de administración mostrará un botón para recargar desde Google Sheets

## Limitaciones

- **Almacenamiento**: Los datos se guardan en localStorage (límite típico: 5-10MB)
- **Sincronización**: Los cambios solo se guardan en el navegador actual
- **Respaldo**: Se recomienda exportar regularmente los productos como backup

## Troubleshooting

### Los productos no se guardan

- Verifica que localStorage esté habilitado en el navegador
- Comprueba que no hayas alcanzado el límite de almacenamiento
- Abre la consola (F12) para ver mensajes de error

### No puedo importar un archivo

- Asegúrate de que el archivo sea JSON válido
- Verifica que tenga la estructura correcta con la clave `products`
- Intenta exportar un archivo existente para ver el formato correcto

### Los productos no aparecen en el catálogo

- Verifica que `CONFIG.products.enableGoogleSheets` sea `false`
- Recarga la página del sitio
- Abre la consola para ver si hay errores

## Ejemplos

### Exportar e Importar Productos

```javascript
// Exportar
const products = JSON.parse(localStorage.getItem('ferreteria_products'));
const exportData = {
    exportDate: new Date().toISOString(),
    totalProducts: products.length,
    products: products
};
console.log(JSON.stringify(exportData, null, 2));

// Importar
const importedData = JSON.parse(jsonString);
const currentProducts = JSON.parse(localStorage.getItem('ferreteria_products') || '[]');
const merged = [...currentProducts, ...importedData.products];
localStorage.setItem('ferreteria_products', JSON.stringify(merged));
```

### Actualizar Precios en Lote

```javascript
const products = JSON.parse(localStorage.getItem('ferreteria_products'));
const percentageIncrease = 1.1; // 10% de aumento

products.forEach(p => {
    p.price = p.price * percentageIncrease;
    p.updatedAt = new Date().toISOString();
});

localStorage.setItem('ferreteria_products', JSON.stringify(products));
```

### Obtener Estadísticas

```javascript
const products = JSON.parse(localStorage.getItem('ferreteria_products'));

const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
    categories: [...new Set(products.map(p => p.category))],
    lowStock: products.filter(p => p.stock < 10)
};

console.log(stats);
```

## Testing

Se incluye un archivo de prueba automatizado: `test-product-management-automated.js`

Para ejecutar las pruebas:

```bash
node test-product-management-automated.js
```

Las pruebas verifican:
- ✓ Crear productos
- ✓ Leer productos
- ✓ Actualizar productos
- ✓ Eliminar productos
- ✓ Validación de datos
- ✓ Gestión de categorías
- ✓ Exportación/Importación
- ✓ Búsqueda y filtrado

## Requisitos

- Navegador moderno con soporte para:
  - localStorage
  - JSON
  - ES6 (clases, arrow functions)
  - FileReader API (para importación)
  - Blob API (para exportación)

## Navegadores Soportados

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Notas de Seguridad

⚠️ **Importante**: Esta implementación usa una contraseña simple hasheada con Base64. Para producción:

1. Implementa autenticación real en el backend
2. Usa HTTPS
3. Implementa control de acceso basado en roles
4. Audita los cambios de productos
5. Realiza backups regulares

## Soporte

Para reportar problemas o sugerencias, contacta al equipo de desarrollo.

---

**Última actualización**: 2024-01-15
**Versión**: 1.0.0
