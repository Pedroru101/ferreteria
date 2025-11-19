# Funcionalidad "Agregar a Cotización"

## Descripción

Implementación completa de la funcionalidad para agregar productos al carrito de cotización desde el modal de producto detallado. Esta funcionalidad cumple con todos los requisitos de la tarea 24 del plan de implementación.

## Características Implementadas

### 1. Agregar Producto al Carrito en localStorage ✅

- Los productos se guardan automáticamente en `localStorage` con la clave `ferreteria_cart`
- Estructura de datos incluye: ID, nombre, categoría, precio, unidad de precio, cantidad e imagen
- Persistencia automática entre sesiones del navegador
- Manejo de productos duplicados (incrementa cantidad si ya existe)

### 2. Actualizar Contador Visual ✅

- Contador en el botón flotante del carrito muestra el total de productos
- Actualización automática en tiempo real al agregar/eliminar productos
- Animación de "bounce" al actualizar el contador
- El contador se oculta cuando el carrito está vacío

### 3. Mostrar Notificación de Éxito ✅

- Notificación visual al agregar productos exitosamente
- Mensaje personalizado con el nombre del producto
- Integración con el sistema de notificaciones existente (`showNotification`)
- Tipos de notificación: success, warning, error

### 4. Permitir Ajustar Cantidad ✅

- Selector de cantidad en el modal de producto
- Botones +/- para incrementar/decrementar
- Input numérico editable manualmente
- Validación de cantidad mínima (1) y máxima (9999)
- Controles de cantidad en el dropdown del carrito
- Actualización en tiempo real del subtotal

## Componentes

### HTML

**Modal de Producto** (`index.html`)
```html
<div class="product-actions">
    <div class="quantity-selector">
        <label for="modalProductQuantity">Cantidad:</label>
        <div class="quantity-controls">
            <button class="quantity-btn" onclick="decreaseModalQuantity()">
                <i class="fas fa-minus"></i>
            </button>
            <input type="number" id="modalProductQuantity" value="1" min="1" max="9999">
            <button class="quantity-btn" onclick="increaseModalQuantity()">
                <i class="fas fa-plus"></i>
            </button>
        </div>
    </div>
    <button class="add-to-quote" onclick="addProductToQuoteFromModal()">
        <i class="fas fa-shopping-cart"></i>
        Agregar a Cotización
    </button>
</div>
```

**Carrito Flotante** (`index.html`)
```html
<div id="quoteCart" class="quote-cart">
    <button class="cart-toggle" id="cartToggle">
        <i class="fas fa-shopping-cart"></i>
        <span class="cart-count" id="cartCount">0</span>
    </button>
    <div class="cart-dropdown" id="cartDropdown">
        <!-- Contenido del carrito -->
    </div>
</div>
```

### JavaScript

**Funciones Principales** (`js/catalog.js`)

```javascript
// Agregar producto al carrito
addToCart(productId, quantity = 1)

// Actualizar cantidad de un producto
updateCartQuantity(productId, quantity)

// Eliminar producto del carrito
removeFromCart(productId)

// Limpiar carrito completo
clearCart()

// Obtener información del carrito
getCartCount()
getCartTotal()
getCartItems()

// Funciones del modal
addProductToQuoteFromModal()
increaseModalQuantity()
decreaseModalQuantity()
```

### CSS

**Estilos del Selector de Cantidad** (`css/catalog.css`)

- `.quantity-selector` - Contenedor del selector
- `.quantity-controls` - Controles de cantidad
- `.quantity-btn` - Botones +/-
- `.quantity-input` - Input numérico
- Estilos responsive para móviles

**Estilos del Carrito Flotante** (`css/catalog.css`)

- `.quote-cart` - Contenedor principal
- `.cart-toggle` - Botón flotante
- `.cart-count` - Contador de productos
- `.cart-dropdown` - Dropdown del carrito
- `.cart-item` - Item individual del carrito

## Flujo de Usuario

1. **Abrir Modal de Producto**
   - Usuario hace clic en un producto del catálogo
   - Se abre el modal con detalles del producto
   - Selector de cantidad inicializado en 1

2. **Ajustar Cantidad**
   - Usuario puede usar botones +/- o escribir directamente
   - Validación automática de valores mínimos y máximos
   - Feedback visual en los controles

3. **Agregar al Carrito**
   - Usuario hace clic en "Agregar a Cotización"
   - Producto se agrega con la cantidad seleccionada
   - Notificación de éxito aparece
   - Contador del carrito se actualiza
   - Modal se cierra automáticamente
   - Cantidad se resetea a 1

4. **Ver Carrito**
   - Usuario hace clic en el botón flotante del carrito
   - Se abre el dropdown con los productos
   - Puede ajustar cantidades o eliminar productos
   - Total se actualiza en tiempo real

5. **Generar Cotización**
   - Usuario hace clic en "Generar Cotización"
   - Se abre el modal de cotización con los productos del carrito
   - Puede continuar con el proceso de cotización

## Almacenamiento en localStorage

### Estructura de Datos

```javascript
{
    "items": [
        {
            "id": "poste_hormigon_2_5",
            "name": "Poste de Hormigón 2.5m",
            "category": "postes",
            "price": 3500,
            "priceUnit": "unidad",
            "quantity": 2,
            "image": ""
        }
    ],
    "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

### Métodos de Almacenamiento

- `saveCartToStorage()` - Guarda el carrito en localStorage
- `loadCartFromStorage()` - Carga el carrito desde localStorage
- Manejo de errores con try-catch
- Validación de datos al cargar

## Validaciones

### Cantidad de Producto

- Mínimo: 1 unidad
- Máximo: 9999 unidades
- Solo números enteros positivos
- Mensaje de error si la cantidad es inválida

### Producto Existente

- Verifica que el producto exista antes de agregar
- Mensaje de error si el producto no se encuentra
- Previene agregar productos inválidos

### Carrito Vacío

- Deshabilita el botón "Generar Cotización" si el carrito está vacío
- Muestra mensaje "No hay productos en el carrito"
- Oculta el contador cuando está en 0

## Accesibilidad

- Etiquetas ARIA en botones (`aria-label`)
- Navegación por teclado completa
- Focus visible en controles
- Mensajes descriptivos para lectores de pantalla
- Contraste de colores WCAG AA

## Responsive Design

### Desktop (1200px+)
- Carrito flotante en la esquina inferior derecha
- Dropdown de 380px de ancho
- Controles de cantidad de 40px

### Tablet (768px - 1199px)
- Carrito flotante ajustado
- Dropdown responsive
- Controles de cantidad de 36px

### Mobile (< 768px)
- Carrito flotante más pequeño (52px)
- Dropdown ocupa casi todo el ancho
- Controles de cantidad de 36px
- Texto y espaciado optimizados

## Testing

### Archivo de Prueba

`test-add-to-cart.html` - Página de prueba con:

- Botones para abrir modales de diferentes productos
- Operaciones del carrito (agregar, actualizar, eliminar, limpiar)
- Visualización de resultados en tiempo real
- Log de todas las operaciones

### Casos de Prueba

1. ✅ Agregar producto con cantidad 1
2. ✅ Agregar producto con cantidad personalizada
3. ✅ Agregar producto duplicado (incrementa cantidad)
4. ✅ Actualizar cantidad desde el modal
5. ✅ Actualizar cantidad desde el carrito
6. ✅ Eliminar producto del carrito
7. ✅ Limpiar carrito completo
8. ✅ Persistencia en localStorage
9. ✅ Actualización del contador visual
10. ✅ Notificaciones de éxito/error

## Integración con Otros Módulos

### Módulo de Cotizaciones

- `exportCartForQuotation()` - Exporta datos del carrito para cotización
- Formato compatible con el sistema de cotizaciones
- Incluye subtotales calculados

### Módulo de Productos

- Carga precios desde `products-data.js` o Google Sheets
- Sincronización automática de datos
- Fallback a precios por defecto

### Sistema de Notificaciones

- Integración con `showNotification()` existente
- Tipos: success, warning, error, info
- Duración y posición configurables

## Configuración

### Variables CSS

```css
--primary: #2d7a3e;
--primary-hover: #236030;
--bg-card: #ffffff;
--bg-secondary: #e8f5e9;
--text-primary: #1a1a1a;
--border-color: #c8e6c9;
--transition-fast: 0.2s;
--transition-normal: 0.3s;
```

### Configuración JavaScript

```javascript
CONFIG.pricing = {
    currency: 'ARS',
    currencySymbol: '$',
    currencyFormat: {
        locale: 'es-AR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }
};
```

## Requisitos Cumplidos

- ✅ **3.10** - Agregar producto al carrito con botón "Agregar a Cotización"
- ✅ **3.11** - Guardar selección en localStorage y mostrar contador
- ✅ **7.4** - Mostrar notificación de éxito al agregar producto

## Próximos Pasos

1. Implementar tarea 25: "Implementar resumen de productos seleccionados"
2. Mejorar animaciones del carrito
3. Agregar opción de guardar carrito para más tarde
4. Implementar compartir carrito por enlace

## Notas Técnicas

- Compatible con navegadores modernos (Chrome, Firefox, Safari, Edge)
- No requiere dependencias externas adicionales
- Código modular y reutilizable
- Documentación inline en el código
- Sin uso de emojis en el código (solo en documentación)

## Autor

Implementado según especificaciones del documento de diseño y requerimientos del sistema integral de alambrados.

## Fecha

Enero 2024
