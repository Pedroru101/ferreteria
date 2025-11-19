# Sistema de Gestión de Pedidos

## Descripción

Sistema completo para la gestión de pedidos que permite crear, actualizar, consultar y exportar pedidos basados en cotizaciones. Incluye generación automática de IDs únicos, historial de estados, y formateo de mensajes para WhatsApp.

## Características Implementadas

### Clase Order

- ✅ Generación de ID único con formato `ORD-YYYYMMDD-XXXX`
- ✅ Validación de datos del cliente según configuración
- ✅ Método `updateStatus(status, note)` con historial completo
- ✅ Método `toWhatsAppMessage()` para formatear mensajes
- ✅ Serialización/deserialización JSON
- ✅ Métodos de utilidad (formateo de fechas, moneda, etc.)
- ✅ Información de estado con colores e iconos
- ✅ Validaciones de edición y cancelación

### Clase OrderManager

- ✅ Gestión completa de pedidos en localStorage
- ✅ CRUD completo (crear, leer, actualizar, eliminar)
- ✅ Búsqueda por ID, estado, rango de fechas, cliente
- ✅ Estadísticas y métricas
- ✅ Exportación a CSV
- ✅ Limpieza automática de pedidos antiguos

## Uso

### Crear un Pedido

```javascript
// Inicializar el gestor
const orderManager = new OrderManager();

// Datos del cliente
const customerData = {
    name: 'Juan Pérez',
    phone: '+54 9 11 1234-5678',
    email: 'juan@example.com',
    address: 'Calle Falsa 123, Mar del Plata',
    installationDate: '2024-02-15'
};

// Crear pedido desde una cotización
const order = orderManager.createOrder(quotation, customerData);

console.log('Pedido creado:', order.id);
```

### Actualizar Estado

```javascript
// Actualizar estado con nota
orderManager.updateOrderStatus(
    'ORD-20240115-0001',
    'confirmed',
    'Confirmado por el cliente vía WhatsApp'
);

// Ver historial de estados
const order = orderManager.getOrderById('ORD-20240115-0001');
console.log('Historial:', order.statusHistory);
```

### Generar Mensaje WhatsApp

```javascript
const order = orderManager.getOrderById('ORD-20240115-0001');
const message = order.toWhatsAppMessage();

// Abrir WhatsApp con el mensaje
const whatsappNumber = CONFIG.contact.whatsapp.number;
const url = `https://wa.me/${whatsappNumber}?text=${message}`;
window.open(url, '_blank');
```

### Consultar Pedidos

```javascript
// Por ID
const order = orderManager.getOrderById('ORD-20240115-0001');

// Por estado
const pendingOrders = orderManager.getOrdersByStatus('pending');

// Por rango de fechas
const startDate = new Date('2024-01-01');
const endDate = new Date('2024-01-31');
const ordersInRange = orderManager.getOrdersByDateRange(startDate, endDate);

// Por cliente
const customerOrders = orderManager.getOrdersByCustomer('+54 9 11 1234-5678');
```

### Estadísticas

```javascript
const stats = orderManager.getStatistics();

console.log('Total de pedidos:', stats.total);
console.log('Pedidos este mes:', stats.thisMonth);
console.log('Ingresos estimados:', stats.revenue);
console.log('Por estado:', stats.byStatus);
```

### Exportar Datos

```javascript
// Generar CSV
const csv = orderManager.exportToCSV();

// Descargar CSV
orderManager.downloadCSV('pedidos-enero-2024.csv');
```

## Estructura de Datos

### Order

```javascript
{
    id: "ORD-20240115-0001",
    quotationId: "COT-1705315800000-123",
    date: "2024-01-15T11:00:00.000Z",
    customer: {
        name: "Juan Pérez",
        phone: "+54 9 11 1234-5678",
        email: "juan@example.com",
        address: "Calle Falsa 123, Mar del Plata",
        installationDate: "2024-01-20"
    },
    items: [
        {
            id: "prod_001",
            name: "Poste de Hormigón 2.5m",
            quantity: 10,
            unitPrice: 3500,
            subtotal: 35000
        }
    ],
    installation: {
        linearMeters: 100,
        pricePerMeter: 500,
        subtotal: 50000
    },
    subtotal: 85000,
    total: 85000,
    status: "confirmed",
    statusHistory: [
        {
            status: "pending",
            date: "2024-01-15T11:00:00.000Z",
            note: "Pedido creado"
        },
        {
            status: "confirmed",
            date: "2024-01-15T11:15:00.000Z",
            note: "Confirmado por administrador"
        }
    ]
}
```

## Estados de Pedido

Los estados disponibles se configuran en `CONFIG.orders.statusOptions`:

- **pending**: Pendiente de confirmación
- **confirmed**: Confirmado por el cliente
- **in_progress**: En proceso de preparación/instalación
- **completed**: Completado exitosamente
- **cancelled**: Cancelado

Cada estado tiene:
- `value`: Valor interno
- `label`: Etiqueta para mostrar
- `color`: Color asociado
- `icon`: Icono de Font Awesome

## Validación de Datos

### Campos Requeridos

Configurados en `CONFIG.orders.requireCustomerData`:
- `name`: Nombre del cliente
- `phone`: Teléfono de contacto

### Campos Opcionales

Configurados en `CONFIG.orders.optionalCustomerData`:
- `email`: Email del cliente
- `address`: Dirección de instalación
- `installationDate`: Fecha preferida de instalación

## Almacenamiento

Los pedidos se guardan en localStorage con la clave `ferreteria_orders`.

### Gestión de Espacio

```javascript
// Limpiar pedidos antiguos (más de 1 año)
const removed = orderManager.cleanOldOrders(365);
console.log(`Pedidos eliminados: ${removed}`);
```

## Integración con WhatsApp

El método `toWhatsAppMessage()` genera un mensaje formateado que incluye:

- Número de orden
- Fecha del pedido
- Datos del cliente
- Lista de productos con cantidades y precios
- Información de instalación (si aplica)
- Total del pedido

Ejemplo de mensaje generado:

```
*Nuevo Pedido - Metales & Hierros Mar del Plata*

*Número de Orden:* ORD-20240115-0001
*Fecha:* 15/01/2024

*Cliente:*
Nombre: Juan Pérez
Teléfono: +54 9 11 1234-5678
Email: juan@example.com
Dirección: Calle Falsa 123, Mar del Plata

*Productos:*
1. Poste de Hormigón 2.5m x10 - $35.000
2. Tejido Romboidal 1.50m x5 - $21.000

*Instalación:*
100m x $500 = $50.000
Fecha preferida: 15/02/2024

*Total: $106.000*
```

## Testing

Abre `test-orders.html` en el navegador para probar todas las funcionalidades:

1. **Crear Pedido**: Crea un pedido de prueba con datos mock
2. **Actualizar Estado**: Prueba las transiciones de estado
3. **Mensaje WhatsApp**: Genera y visualiza el mensaje formateado
4. **Gestión**: Prueba OrderManager y estadísticas
5. **Consultar**: Busca pedidos por ID

## Métodos Útiles de Order

### Información de Estado

```javascript
const statusInfo = order.getStatusInfo();
// { value: 'confirmed', label: 'Confirmado', color: '#4caf50', icon: 'check-circle' }
```

### Validaciones

```javascript
// ¿Se puede editar?
if (order.isEditable()) {
    // Permitir edición
}

// ¿Se puede cancelar?
if (order.canBeCancelled()) {
    // Mostrar botón de cancelar
}
```

### Información Temporal

```javascript
// Días desde la creación
const days = order.getDaysSinceCreation();

// Última actualización de estado
const lastUpdate = order.getLastStatusUpdate();
```

## Configuración

Todas las opciones se configuran en `config.js`:

```javascript
orders: {
    prefix: 'ORD',
    statusOptions: [...],
    requireCustomerData: ['name', 'phone'],
    optionalCustomerData: ['email', 'address', 'installationDate'],
    enableTracking: true,
    autoNotifyCustomer: true
}
```

## Manejo de Errores

El sistema incluye manejo robusto de errores:

- Validación de datos del cliente
- Validación de estados
- Manejo de QuotaExceededError en localStorage
- Mensajes de error descriptivos

```javascript
try {
    const order = orderManager.createOrder(quotation, customerData);
} catch (error) {
    if (error.message.includes('Campo requerido faltante')) {
        // Mostrar error de validación
    } else if (error.message.includes('Espacio de almacenamiento')) {
        // Sugerir limpiar datos antiguos
    }
}
```

## Próximos Pasos

Para integrar el sistema de pedidos en el sitio:

1. Incluir `js/orders.js` en `index.html`
2. Crear formulario de pedido (Tarea 27)
3. Implementar conversión de cotización a pedido (Tarea 28)
4. Implementar envío por WhatsApp (Tarea 29)
5. Crear pantalla de confirmación (Tarea 30)
6. Crear sección de consulta de estado (Tarea 31)
7. Implementar visualización de estado (Tarea 32)

## Requerimientos Cumplidos

- ✅ **4.3**: Generación de ID único y guardado en localStorage
- ✅ **4.10**: Historial de estados con método updateStatus

## Notas Técnicas

- Compatible con ES6+
- No requiere dependencias externas
- Usa localStorage para persistencia
- Integrado con CONFIG global
- Formato de moneda configurable
- Formato de fecha localizado (es-AR)
