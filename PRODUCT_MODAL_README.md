# Modal de Producto Detallado

## Descripción

Modal interactivo que muestra información detallada de productos del catálogo, incluyendo especificaciones técnicas, resistencias, aplicaciones recomendadas y disponibilidad.

## Características Implementadas

### 1. Estructura HTML
- Modal responsive con overlay oscuro
- Diseño de dos columnas (imagen + información)
- Botón de cierre con animación
- Secciones dinámicas según tipo de producto

### 2. Información Mostrada

#### Básica
- Nombre del producto
- Categoría y subcategoría
- Precio formateado
- Unidad de precio
- Descripción
- Badge de "Destacado" (si aplica)

#### Disponibilidad
- En Stock (verde)
- Stock Limitado (naranja) - muestra cantidad
- Sin Stock (rojo)

#### Especificaciones Técnicas
Grid de 2 columnas con:
- Material
- Altura/Dimensiones
- Peso
- Durabilidad
- Otras especificaciones según tipo de producto

#### Resistencia (para postes)
Barras de progreso animadas para:
- Resistencia a humedad (0-10)
- Resistencia a plagas (0-10)
- Resistencia al fuego (0-10)

#### Aplicaciones Recomendadas
Tags con usos sugeridos:
- Rural
- Industrial
- Residencial
- Seguridad
- etc.

### 3. Funcionalidad

#### Apertura del Modal
```javascript
openProductModal(productId)
```
- Carga datos del producto desde catalogManager
- Puebla todos los campos dinámicamente
- Muestra/oculta secciones según disponibilidad de datos
- Anima la entrada del modal

#### Cierre del Modal
- Botón X en esquina superior derecha
- Click en el backdrop (fondo oscuro)
- Tecla ESC
- Restaura scroll del body

#### Agregar a Cotización
```javascript
addProductToQuoteFromModal()
```
- Agrega el producto al carrito
- Cierra el modal automáticamente
- Muestra notificación de éxito

## Uso

### Desde HTML
```html
<button onclick="openProductModal('poste_hormigon_2_5')">
    Ver Detalles
</button>
```

### Desde JavaScript
```javascript
const productId = 'poste_hormigon_2_5';
openProductModal(productId);
```

### Integración con Product Cards
```javascript
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
        const productId = card.dataset.productId;
        openProductModal(productId);
    });
});
```

## Estructura de Datos Requerida

El producto debe tener la siguiente estructura:

```javascript
{
    id: 'producto_id',
    name: 'Nombre del Producto',
    category: 'postes',
    subcategory: 'hormigon',
    description: 'Descripción detallada...',
    price: 3500,
    priceUnit: 'unidad', // opcional, default: 'unidad'
    stock: 150,
    image: 'ruta/imagen.jpg', // opcional
    featured: true, // opcional
    specs: {
        material: 'Hormigón armado',
        height: '2.5m',
        diameter: '12cm',
        weight: '45kg',
        durability: '50+ años',
        resistance: { // opcional, para postes
            humidity: 10,
            pests: 10,
            fire: 10
        }
    },
    applications: ['Rural', 'Industrial', 'Residencial'] // opcional
}
```

## Estilos CSS

Los estilos están integrados en `styles.css` bajo la sección "CATALOG MODAL STYLES".

### Variables CSS Utilizadas
- `--bg-card`: Fondo del modal
- `--primary`: Color principal
- `--secondary`: Color secundario
- `--text-primary`: Texto principal
- `--text-secondary`: Texto secundario
- `--text-muted`: Texto atenuado
- `--border-color`: Color de bordes
- `--gradient-primary`: Gradiente principal

### Responsive
- Desktop (>768px): Layout de 2 columnas
- Tablet/Mobile (≤768px): Layout de 1 columna
- Mobile (≤480px): Ajustes de padding y tamaños

## Testing

Archivo de prueba incluido: `test-product-modal.html`

Para probar:
1. Abrir `test-product-modal.html` en el navegador
2. Hacer clic en cualquier producto
3. Verificar que se muestre toda la información
4. Probar cerrar con X, backdrop y ESC
5. Probar agregar a cotización

## Accesibilidad

- Botón de cierre con `aria-label`
- Navegación por teclado (ESC para cerrar)
- Focus trap dentro del modal
- Contraste WCAG AA cumplido
- Textos alternativos en imágenes

## Animaciones

- Fade in del backdrop (0.3s)
- Slide up del contenido (0.3s)
- Rotación del botón cerrar al hover
- Animación de barras de resistencia (0.6s)
- Transiciones suaves en todos los elementos

## Compatibilidad

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

## Dependencias

- Font Awesome 6.4.0 (iconos)
- config.js (configuración)
- products-data.js (datos de productos)
- catalog.js (gestor de catálogo)

## Notas de Implementación

1. El modal se agrega al final del `<body>` en `index.html`
2. Los estilos están en `styles.css` (no requiere CSS separado)
3. La funcionalidad está en `catalog.js`
4. Compatible con modo claro/oscuro automáticamente
5. No requiere librerías externas adicionales

## Próximas Mejoras (Opcionales)

- [ ] Galería de imágenes múltiples
- [ ] Zoom en imagen
- [ ] Compartir en redes sociales
- [ ] Comparar con otros productos
- [ ] Historial de productos vistos
- [ ] Productos relacionados
