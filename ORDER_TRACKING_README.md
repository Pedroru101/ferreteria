# Sistema de Consulta de Estado de Pedidos

## Descripción

Sistema completo para que los clientes puedan consultar el estado de sus pedidos ingresando el número de orden. Muestra información detallada del pedido, productos, total y un historial completo de cambios de estado.

## Características Implementadas

### 1. Sección de Consulta
- Formulario de búsqueda con input para número de orden
- Botón de consulta con icono de búsqueda
- Validación de entrada
- Búsqueda con Enter o botón
- Mensajes de ayuda informativos

### 2. Visualización de Estado
- **Encabezado del Pedido**
  - Número de orden destacado
  - Estado actual con badge de color
  - Icono según el estado

- **Detalles del Cliente**
  - Fecha del pedido
  - Nombre del cliente
  - Teléfono de contacto
  - Email (si está disponible)
  - Dirección de instalación (si está disponible)

- **Lista de Productos**
  - Nombre del producto
  - Cantidad solicitada
  - Precio por producto
  - Subtotal por ítem
  - Servicio de instalación (si aplica)

- **Total del Pedido**
  - Total destacado con diseño especial
  - Formato de moneda argentina

- **Historial de Estados**
  - Timeline visual con línea conectora
  - Cada cambio de estado con:
    - Badge de color según estado
    - Fecha y hora del cambio
    - Nota o comentario del cambio
  - Estado actual animado con efecto pulse
  - Orden cronológico inverso (más reciente primero)

### 3. Manejo de Errores
- Mensaje cuando no se encuentra el pedido
- Diseño amigable con icono
- Sugerencias de acción
- Botón directo a WhatsApp para ayuda

### 4. Diseño Responsive
- Adaptado para móviles, tablets y desktop
- Grid flexible para detalles
- Botones apilados en móvil
- Timeline optimizada para pantallas pequeñas

## Estructura de Archivos

```
ferreteria/
├── index.html                      # Sección agregada antes de contacto
├── css/
│   └── orders.css                  # Estilos de tracking agregados
├── js/
│   └── orders.js                   # Clase OrderTrackingUI agregada
└── test-order-tracking.html        # Página de prueba
```

## Clases JavaScript

### OrderTrackingUI

Clase principal que maneja la consulta y visualización de pedidos.

**Métodos principales:**
- `trackOrder()`: Busca y muestra el pedido
- `displayOrderStatus(order)`: Renderiza la información del pedido
- `getStatusInfo(status)`: Obtiene información de color e icono del estado
- `formatDateTime(date)`: Formatea fecha y hora

## Uso

### Para Clientes

1. Navegar a la sección "Mis Pedidos" en el menú
2. Ingresar el número de orden recibido por WhatsApp
3. Hacer clic en "Consultar" o presionar Enter
4. Ver el estado actual y detalles del pedido

### Para Desarrolladores

```javascript
// Crear instancia del tracking UI
const trackingUI = new OrderTrackingUI();

// Buscar un pedido programáticamente
trackingUI.trackOrder();

// O usar la función global
trackOrder();
```

## Estilos CSS

### Clases Principales

- `.order-tracking-section`: Contenedor principal
- `.tracking-form-container`: Formulario de búsqueda
- `.order-status-display`: Contenedor de resultados
- `.order-status-header`: Encabezado con número y estado
- `.order-details-grid`: Grid de detalles del cliente
- `.order-items-list`: Lista de productos
- `.order-history-timeline`: Timeline de estados
- `.order-not-found`: Mensaje de pedido no encontrado

### Variables CSS Utilizadas

```css
--primary: Color principal (verde)
--bg-card: Fondo de tarjetas
--bg-secondary: Fondo secundario
--text-primary: Texto principal
--text-secondary: Texto secundario
--border: Color de bordes
--shadow: Sombra de elementos
--gradient-primary: Gradiente principal
```

## Estados de Pedido

Los estados se configuran en `config.js`:

```javascript
CONFIG.orders.statusOptions = [
    { value: 'pending', label: 'Pendiente', color: '#f57c00', icon: 'clock' },
    { value: 'confirmed', label: 'Confirmado', color: '#4caf50', icon: 'check-circle' },
    { value: 'in_progress', label: 'En Proceso', color: '#0288d1', icon: 'cog' },
    { value: 'completed', label: 'Completado', color: '#2d7a3e', icon: 'check-double' },
    { value: 'cancelled', label: 'Cancelado', color: '#d32f2f', icon: 'times-circle' }
];
```

## Animaciones

- **slideUp**: Entrada suave de elementos
- **pulse**: Animación del estado actual en timeline
- **fadeIn**: Aparición del modal

## Testing

### Archivo de Prueba

`test-order-tracking.html` incluye:

1. **Crear Pedido de Prueba**: Genera un pedido con datos de ejemplo
2. **Crear 3 Pedidos**: Genera múltiples pedidos con diferentes estados
3. **Listar Pedidos**: Muestra todos los pedidos en localStorage
4. **Limpiar Pedidos**: Elimina todos los pedidos de prueba

### Casos de Prueba

1. **Búsqueda Exitosa**
   - Crear pedido de prueba
   - Copiar número de orden
   - Buscar el pedido
   - Verificar que se muestra correctamente

2. **Pedido No Encontrado**
   - Ingresar número de orden inexistente
   - Verificar mensaje de error
   - Verificar botón de WhatsApp

3. **Historial de Estados**
   - Crear pedido con múltiples estados
   - Verificar timeline completo
   - Verificar orden cronológico

4. **Responsive**
   - Probar en diferentes tamaños de pantalla
   - Verificar que todos los elementos sean accesibles

## Integración con Sistema Existente

### OrderManager

La funcionalidad utiliza `OrderManager` existente:

```javascript
const orderManager = new OrderManager();
const order = orderManager.getOrderById(orderId);
```

### PriceManager

Utiliza `PriceManager` para formatear precios:

```javascript
const priceManager = new PriceManager();
const formatted = priceManager.formatCurrency(amount);
```

### Notificaciones

Integrado con sistema de notificaciones existente:

```javascript
if (typeof showNotification === 'function') {
    showNotification('Mensaje', 'tipo');
}
```

## Accesibilidad

- Labels descriptivos en formularios
- ARIA labels en botones
- Navegación por teclado (Enter para buscar)
- Contraste de colores WCAG AA
- Iconos con significado semántico

## Mejoras Futuras

1. Búsqueda por teléfono del cliente
2. Filtros por fecha o estado
3. Exportar detalles del pedido a PDF
4. Notificaciones push de cambios de estado
5. Integración con sistema de tracking de envío
6. Código QR para acceso rápido al estado

## Requisitos Validados

✅ **Requirement 4.8**: Mostrar número de orden, fecha, cliente
✅ **Requirement 4.8**: Mostrar lista de productos y total
✅ **Requirement 4.8**: Mostrar estado actual con color según estado
✅ **Requirement 4.8**: Mostrar historial de cambios de estado

## Notas de Implementación

- Los pedidos se almacenan en localStorage con clave `ferreteria_orders`
- El historial de estados se guarda automáticamente al actualizar un pedido
- Los colores de estado se obtienen de la configuración global
- La búsqueda es case-sensitive para el número de orden
- El sistema funciona completamente offline (localStorage)
