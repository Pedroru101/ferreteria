# Carrito Flotante de Cotización

## Descripción

El carrito flotante es un componente UI que permite a los usuarios agregar productos a una cotización de manera rápida y visual. Se muestra como un botón flotante en la esquina inferior derecha de la pantalla con un contador de productos.

## Características Implementadas

### 1. Botón Flotante
- Botón circular con icono de carrito de compras
- Contador de productos visible cuando hay items en el carrito
- Animación de entrada del contador
- Efecto hover con elevación
- Posicionamiento fijo en la esquina inferior derecha

### 2. Dropdown del Carrito
- Panel desplegable que muestra los productos agregados
- Animación suave de apertura/cierre
- Lista scrolleable de productos
- Información de cada producto: nombre, precio unitario, cantidad
- Controles para aumentar/disminuir cantidad
- Botón para eliminar productos
- Total calculado automáticamente

### 3. Funcionalidades
- Agregar productos desde el modal de producto
- Actualizar cantidades directamente en el carrito
- Eliminar productos individuales
- Limpiar todo el carrito
- Persistencia en localStorage
- Botón "Generar Cotización" que abre el modal de cotización
- Cierre automático al hacer clic fuera del dropdown
- Actualización en tiempo real del contador y totales

## Archivos Modificados

### HTML (index.html)
```html
<!-- Carrito Flotante de Cotización -->
<div id="quoteCart" class="quote-cart">
    <button class="cart-toggle" id="cartToggle">
        <i class="fas fa-shopping-cart"></i>
        <span class="cart-count" id="cartCount">0</span>
    </button>
    <div class="cart-dropdown" id="cartDropdown">
        <!-- Contenido del dropdown -->
    </div>
</div>
```

### CSS (css/catalog.css)
Estilos agregados:
- `.quote-cart` - Contenedor principal
- `.cart-toggle` - Botón flotante
- `.cart-count` - Contador de productos
- `.cart-dropdown` - Panel desplegable
- `.cart-header` - Encabezado del dropdown
- `.cart-items` - Lista de productos
- `.cart-item` - Item individual
- `.cart-footer` - Pie con botón de cotización
- Responsive para mobile, tablet y desktop

### JavaScript (js/catalog.js)
Funciones agregadas:
- `initializeFloatingCart()` - Inicializa el carrito
- `openCartDropdown()` - Abre el dropdown
- `closeCartDropdown()` - Cierra el dropdown
- `toggleCartDropdown()` - Alterna visibilidad
- `openQuotationFromCart()` - Genera cotización
- `updateGenerateQuoteButton()` - Actualiza estado del botón

## Uso

### Agregar Producto al Carrito
```javascript
catalogManager.addToCart('producto_id', cantidad);
```

### Actualizar Cantidad
```javascript
catalogManager.updateCartQuantity('producto_id', nuevaCantidad);
```

### Eliminar Producto
```javascript
catalogManager.removeFromCart('producto_id');
```

### Limpiar Carrito
```javascript
catalogManager.clearCart();
```

### Abrir/Cerrar Dropdown
```javascript
openCartDropdown();
closeCartDropdown();
toggleCartDropdown();
```

### Generar Cotización
```javascript
openQuotationFromCart();
```

## Integración con Otros Módulos

### Modal de Producto
El botón "Agregar a Cotización" en el modal de producto llama a:
```javascript
addProductToQuoteFromModal()
```

### Sistema de Cotizaciones
Al hacer clic en "Generar Cotización", se exportan los datos del carrito:
```javascript
const cartData = catalogManager.exportCartForQuotation();
// Retorna: { items: [...], subtotal: number, itemCount: number }
```

## Persistencia de Datos

Los datos del carrito se guardan automáticamente en localStorage:
```javascript
localStorage.setItem('ferreteria_cart', JSON.stringify({
    items: [...],
    lastUpdated: timestamp
}));
```

## Responsive Design

### Desktop (1200px+)
- Botón: 60x60px
- Dropdown: 380px de ancho
- Posición: bottom 100px, right 30px

### Tablet (768px - 1199px)
- Botón: 56x56px
- Dropdown: 380px de ancho máximo
- Posición: bottom 80px, right 20px

### Mobile (< 768px)
- Botón: 52x52px
- Dropdown: calc(100vw - 30px)
- Posición: bottom 70px, right 15px

## Testing

Archivo de prueba: `test-floating-cart.html`

### Casos de Prueba
1. ✓ Agregar productos al carrito
2. ✓ Actualizar cantidades
3. ✓ Eliminar productos
4. ✓ Limpiar carrito completo
5. ✓ Abrir/cerrar dropdown
6. ✓ Persistencia en localStorage
7. ✓ Actualización del contador
8. ✓ Cálculo de totales
9. ✓ Responsive en diferentes dispositivos
10. ✓ Cierre al hacer clic fuera

### Ejecutar Tests
1. Abrir `test-floating-cart.html` en el navegador
2. Usar los botones de prueba para agregar productos
3. Verificar que el carrito funcione correctamente
4. Probar en diferentes tamaños de pantalla

## Accesibilidad

- Botones con `aria-label` descriptivos
- Navegación por teclado soportada
- Contraste de colores WCAG AA
- Focus visible en elementos interactivos
- Cierre con tecla ESC (implementado en catalog.js)

## Animaciones

- `bounceIn` - Entrada del contador
- `slideUpFade` - Apertura del dropdown
- Transiciones suaves en hover
- Elevación del botón flotante

## Notas de Implementación

1. El carrito se inicializa automáticamente en `DOMContentLoaded`
2. Los productos deben estar cargados antes de agregar al carrito
3. El botón "Generar Cotización" se deshabilita si el carrito está vacío
4. El dropdown se cierra automáticamente al hacer clic fuera
5. Los precios se formatean según la configuración en CONFIG

## Próximas Mejoras

- [ ] Agregar animación al actualizar cantidades
- [ ] Implementar drag & drop para reordenar productos
- [ ] Agregar vista previa de imagen en items del carrito
- [ ] Implementar búsqueda rápida de productos desde el carrito
- [ ] Agregar opción de guardar carrito como favorito
- [ ] Implementar compartir carrito por URL

## Dependencias

- Font Awesome 6.4.0 (iconos)
- config.js (configuración)
- products-data.js (datos de productos)
- catalog.js (gestor del catálogo)
- styles.css (variables CSS globales)

## Compatibilidad

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)
