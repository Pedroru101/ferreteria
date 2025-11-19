# Conversión de Cotización a Pedido

## Descripción

Este módulo implementa la funcionalidad completa para convertir una cotización en un pedido formal. Permite a los clientes revisar su cotización y confirmar el pedido proporcionando sus datos personales.

## Componentes

### 1. QuotationModal (`js/quotation-modal.js`)

Modal interactivo que muestra la cotización con tres acciones principales:
- **Descargar PDF**: Genera y descarga la cotización en formato PDF
- **Enviar por WhatsApp**: Abre WhatsApp con un mensaje pre-formateado
- **Confirmar Pedido**: Convierte la cotización en un pedido (NUEVA FUNCIONALIDAD)

#### Características del Modal

- Muestra información del proyecto (perímetro, tipo de poste, material)
- Lista detallada de materiales con cantidades y precios
- Opción de incluir/excluir servicio de instalación
- Cálculo automático de totales
- Guardado automático en localStorage al realizar cualquier acción

### 2. Integración con OrderFormUI

Cuando el usuario hace clic en "Confirmar Pedido":

1. Se guarda la cotización en localStorage
2. Se cierra el modal de cotización
3. Se abre el formulario de pedido con los datos pre-cargados
4. El usuario completa sus datos personales
5. Se crea el pedido y se guarda en localStorage

## Flujo de Usuario

```
Calculadora → Generar Cotización → Modal de Cotización → Confirmar Pedido → Formulario → Pedido Creado
```

### Paso a Paso

1. **Usuario calcula materiales** en la calculadora
2. **Hace clic en "Generar Cotización"**
3. **Se abre el modal** mostrando:
   - Información del proyecto
   - Lista de materiales
   - Opción de instalación
   - Totales
4. **Usuario revisa y hace clic en "Confirmar Pedido"**
5. **Se abre el formulario de pedido** con:
   - Resumen del pedido pre-cargado
   - Campos para datos del cliente
   - Dirección de instalación (opcional)
   - Método de pago preferido
6. **Usuario completa el formulario y confirma**
7. **Se crea el pedido** con:
   - ID único (ORD-YYYYMMDD-XXXX)
   - Datos del cliente
   - Items de la cotización
   - Estado inicial: "pending"
8. **Se guarda en localStorage** (`ferreteria_orders`)
9. **Se muestra confirmación** con número de orden

## Estructura de Datos

### Cotización

```javascript
{
    quotationId: "COT-1234567890-123",
    projectData: {
        perimeter: 120,
        postType: "hormigon",
        materialType: "mesh"
    },
    items: [
        {
            id: "poste_hormigon_25",
            name: "Poste de Hormigón 2.5m",
            category: "postes",
            description: "4 esquineros + 44 intermedios",
            quantity: 48,
            unitPrice: 3500,
            unit: "unidad"
        }
    ],
    installation: {
        linearMeters: 120,
        pricePerMeter: 500,
        subtotal: 60000
    }
}
```

### Pedido Creado

```javascript
{
    id: "ORD-20240115-0001",
    quotationId: "COT-1234567890-123",
    date: "2024-01-15T10:30:00Z",
    customer: {
        name: "Juan Pérez",
        phone: "+54 9 11 1234-5678",
        email: "juan@example.com",
        address: "Calle Falsa 123, Mar del Plata",
        installationDate: "2024-01-20"
    },
    items: [...],
    installation: {...},
    subtotal: 228000,
    total: 288000,
    status: "pending",
    statusHistory: [
        {
            status: "pending",
            date: "2024-01-15T10:30:00Z",
            note: "Pedido creado"
        }
    ]
}
```

## Validaciones

### En el Modal de Cotización

- Verifica que existan items en la cotización
- Calcula precios desde `PriceManager`
- Valida que el módulo de pedidos esté disponible

### En el Formulario de Pedido

- **Campos requeridos**:
  - Nombre completo (mínimo 3 caracteres)
  - Teléfono (formato válido, mínimo 8 dígitos)
  
- **Campos opcionales**:
  - Email (validación de formato si se proporciona)
  - Dirección de instalación
  - Fecha preferida de instalación
  - Método de pago

## Almacenamiento

### localStorage Keys

- `ferreteria_quotations`: Array de cotizaciones guardadas
- `ferreteria_orders`: Array de pedidos creados
- `ferreteria_cart`: Carrito temporal (si aplica)

### Limpieza Automática

- Las cotizaciones expiradas se pueden limpiar con `QuotationStorage.deleteExpired()`
- Los pedidos antiguos se pueden limpiar con `OrderManager.cleanOldOrders(daysOld)`

## Configuración

### CONFIG.js

```javascript
CONFIG = {
    pricing: {
        installationPricePerMeter: 500,
        currency: 'ARS',
        currencySymbol: '$'
    },
    quotation: {
        validityDays: 30
    },
    orders: {
        prefix: 'ORD',
        requireCustomerData: ['name', 'phone'],
        optionalCustomerData: ['email', 'address', 'installationDate'],
        statusOptions: [
            { value: 'pending', label: 'Pendiente', color: '#f57c00' },
            { value: 'confirmed', label: 'Confirmado', color: '#4caf50' },
            { value: 'in_progress', label: 'En Proceso', color: '#0288d1' },
            { value: 'completed', label: 'Completado', color: '#2d7a3e' },
            { value: 'cancelled', label: 'Cancelado', color: '#d32f2f' }
        ]
    }
}
```

## Testing

### Archivo de Prueba

`test-order-conversion.html` - Prueba completa del flujo de conversión

### Casos de Prueba

1. **Cotización Simple**: Materiales básicos sin instalación
2. **Cotización con Instalación**: Incluye servicio de instalación
3. **Cotización Grande**: Muchos items y alto valor
4. **Validación de Formulario**: Campos requeridos y opcionales
5. **Guardado en localStorage**: Verificar persistencia de datos

### Cómo Probar

1. Abrir `test-order-conversion.html` en el navegador
2. Hacer clic en "Abrir Modal de Cotización"
3. Revisar la cotización en el modal
4. Hacer clic en "Confirmar Pedido"
5. Completar el formulario de pedido
6. Verificar que el pedido se guardó correctamente
7. Revisar la sección "Pedidos Guardados"

## Dependencias

### Archivos JavaScript Requeridos

```html
<script src="config.js"></script>
<script src="js/products-data.js"></script>
<script src="js/quotation.js"></script>
<script src="js/quotation-modal.js"></script>
<script src="js/orders.js"></script>
```

### Archivos CSS Requeridos

```html
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="css/quotation.css">
<link rel="stylesheet" href="css/orders.css">
```

### Librerías Externas

- Font Awesome 6.4.0 (iconos)
- jsPDF (generación de PDF, cargado dinámicamente)

## API Pública

### Funciones Globales

```javascript
// Abrir modal de cotización
window.openQuotationModal(quotationData)

// Instancias globales
window.quotationModal  // Instancia de QuotationModal
window.orderFormUI     // Instancia de OrderFormUI
```

### Métodos de QuotationModal

```javascript
quotationModal.open(quotationData)      // Abrir modal
quotationModal.close()                   // Cerrar modal
quotationModal.downloadPDF()             // Descargar PDF
quotationModal.sendWhatsApp()            // Enviar por WhatsApp
quotationModal.confirmOrder()            // Confirmar pedido
```

### Métodos de OrderFormUI

```javascript
orderFormUI.open(quotationData)          // Abrir formulario
orderFormUI.close()                      // Cerrar formulario
orderFormUI.validateForm()               // Validar campos
orderFormUI.handleSubmit(event)          // Procesar envío
```

## Notificaciones

El sistema utiliza la función global `showNotification(message, type)` para feedback visual:

- **success**: Operación exitosa (verde)
- **error**: Error en la operación (rojo)
- **info**: Información general (azul)
- **warning**: Advertencia (naranja)

## Accesibilidad

- Navegación por teclado completa
- Escape para cerrar modales
- Focus trap en modales activos
- ARIA labels en botones
- Mensajes de error descriptivos
- Contraste WCAG AA

## Responsive Design

- **Mobile** (320px - 767px): Layout vertical, botones full-width
- **Tablet** (768px - 1199px): Layout adaptativo
- **Desktop** (1200px+): Layout horizontal completo

## Manejo de Errores

### Errores Comunes

1. **Módulo de pedidos no disponible**
   - Mensaje: "El módulo de pedidos no está disponible"
   - Solución: Verificar que `orders.js` esté cargado

2. **Error al guardar en localStorage**
   - Mensaje: "Error al guardar el pedido"
   - Solución: Verificar cuota de almacenamiento

3. **Validación de formulario fallida**
   - Mensaje: "Por favor complete todos los campos requeridos"
   - Solución: Completar campos marcados como requeridos

### Logging

Todos los errores se registran en la consola con contexto:

```javascript
console.error('Error al confirmar pedido:', error);
```

## Mejoras Futuras

- [ ] Envío de email con confirmación de pedido
- [ ] Integración con sistema de pagos
- [ ] Notificaciones push para actualizaciones de estado
- [ ] Historial de pedidos del cliente
- [ ] Edición de pedidos pendientes
- [ ] Cancelación de pedidos con confirmación
- [ ] Exportación de pedidos a CSV/Excel
- [ ] Dashboard de estadísticas de conversión

## Soporte

Para problemas o consultas:
- Revisar la consola del navegador para errores
- Verificar que todos los archivos JS/CSS estén cargados
- Comprobar la configuración en `config.js`
- Revisar el localStorage para datos guardados

## Changelog

### v1.0.0 (2024-01-15)
- ✅ Implementación inicial de conversión de cotización a pedido
- ✅ Modal de cotización con botón "Confirmar Pedido"
- ✅ Integración con formulario de pedidos
- ✅ Guardado automático en localStorage
- ✅ Validación de formulario completa
- ✅ Archivo de prueba funcional
- ✅ Documentación completa
