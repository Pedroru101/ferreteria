# Formulario de Pedido - Sistema de Órdenes

## Descripción

Formulario modal completo para la creación de pedidos a partir de cotizaciones. Incluye validación en tiempo real, resumen del pedido, y múltiples opciones de pago.

## Características Implementadas

### Interfaz de Usuario

- ✅ Modal responsive con diseño moderno
- ✅ Resumen del pedido con totales calculados
- ✅ Formulario organizado en secciones lógicas
- ✅ Validación visual en tiempo real
- ✅ Mensajes de error descriptivos
- ✅ Animaciones suaves de entrada/salida

### Campos del Formulario

#### Datos del Cliente (Requeridos)
- **Nombre Completo**: Validación de mínimo 3 caracteres
- **Teléfono**: Validación de formato y longitud mínima

#### Datos del Cliente (Opcionales)
- **Email**: Validación de formato si se completa
- **Dirección de Instalación**: Textarea para dirección completa
- **Fecha Preferida de Instalación**: Date picker con fecha mínima (mañana)

#### Método de Pago
- Efectivo (por defecto)
- Transferencia
- Tarjeta

### Validaciones

#### Validación de Nombre
```javascript
- Requerido
- Mínimo 3 caracteres
- Mensaje: "El nombre debe tener al menos 3 caracteres"
```

#### Validación de Teléfono
```javascript
- Requerido
- Formato: números, espacios, +, -, (, )
- Mínimo 8 dígitos
- Mensaje: "Ingrese un teléfono válido"
```

#### Validación de Email
```javascript
- Opcional
- Formato: usuario@dominio.ext
- Mensaje: "Ingrese un email válido"
```

## Uso

### Abrir el Formulario

```javascript
// Desde cualquier parte del código
if (window.orderFormUI) {
    const quotationData = {
        quotationId: 'COT-1234567890-123',
        items: [
            {
                id: 'prod_001',
                name: 'Poste de Hormigón 2.5m',
                category: 'postes',
                quantity: 10,
                unitPrice: 3500
            }
        ],
        installation: {
            linearMeters: 100,
            pricePerMeter: 500,
            subtotal: 50000
        }
    };
    
    window.orderFormUI.open(quotationData);
}
```

### Desde un Botón en la Cotización

```html
<button onclick="openOrderForm(quotationData)">
    Confirmar Pedido
</button>

<script>
function openOrderForm(quotationData) {
    if (window.orderFormUI) {
        window.orderFormUI.open(quotationData);
    }
}
</script>
```

### Cerrar el Formulario

El formulario se cierra automáticamente al:
- Hacer clic en el botón X
- Hacer clic en "Cancelar"
- Hacer clic fuera del modal
- Enviar el formulario exitosamente

## Estructura de Datos

### Datos de Entrada (quotationData)

```javascript
{
    quotationId: "COT-1234567890-123",
    items: [
        {
            id: "prod_001",
            name: "Poste de Hormigón 2.5m",
            category: "postes",
            quantity: 10,
            unitPrice: 3500
        }
    ],
    installation: {
        linearMeters: 100,
        pricePerMeter: 500,
        subtotal: 50000
    }
}
```

### Datos de Salida (customerData)

```javascript
{
    name: "Juan Pérez",
    phone: "+54 9 11 1234-5678",
    email: "juan@example.com",
    address: "Calle Falsa 123, Mar del Plata",
    installationDate: "2024-02-15",
    paymentMethod: "cash"
}
```

## Flujo de Trabajo

1. **Usuario completa cotización** → Hace clic en "Confirmar Pedido"
2. **Se abre el formulario** → Muestra resumen del pedido
3. **Usuario completa datos** → Validación en tiempo real
4. **Usuario envía formulario** → Validación final
5. **Se crea el pedido** → Guardado en localStorage
6. **Confirmación** → Opción de enviar por WhatsApp

## Integración con OrderManager

El formulario utiliza `OrderManager` para crear y guardar pedidos:

```javascript
const orderManager = new OrderManager();
const order = orderManager.createOrder(quotation, customerData);
```

## Personalización

### Cambiar Métodos de Pago

Editar en `orders.js` la sección de métodos de pago:

```javascript
<div class="payment-method-option">
    <input type="radio" id="paymentCustom" name="paymentMethod" value="custom">
    <label for="paymentCustom" class="payment-method-label">
        <i class="fas fa-custom-icon"></i>
        <span>Método Personalizado</span>
    </label>
</div>
```

### Cambiar Validaciones

Modificar los métodos de validación en `OrderFormUI`:

```javascript
validateField(field) {
    // Agregar validaciones personalizadas
}
```

### Cambiar Estilos

Editar `css/orders.css` para personalizar colores, tamaños, etc.

## Eventos Personalizados

### Después de Crear Pedido

```javascript
window.showOrderConfirmation = function(order) {
    console.log('Pedido creado:', order);
    // Lógica personalizada
};
```

## Testing

Abrir `test-order-form.html` en el navegador para probar:

1. **Abrir Formulario**: Abre el modal vacío
2. **Abrir con Cotización**: Abre con datos de prueba
3. **Probar Validación**: Muestra casos de validación
4. **Ver Pedidos Guardados**: Lista pedidos en localStorage
5. **Limpiar Pedidos**: Elimina pedidos de prueba

## Accesibilidad

- ✅ Navegación por teclado completa
- ✅ Focus trap en el modal
- ✅ Labels asociados a inputs
- ✅ Mensajes de error descriptivos
- ✅ ARIA labels en botones
- ✅ Contraste WCAG AA

## Responsive Design

### Desktop (1200px+)
- Modal centrado con ancho máximo 600px
- Campos en dos columnas donde aplica
- Métodos de pago en grid de 3 columnas

### Tablet (768px - 1199px)
- Modal adaptado al ancho disponible
- Campos en dos columnas
- Métodos de pago en grid de 2 columnas

### Mobile (< 768px)
- Modal a pantalla completa con padding
- Todos los campos en una columna
- Métodos de pago en una columna
- Botones apilados verticalmente

## Manejo de Errores

### Errores de Validación
```javascript
- Se muestran debajo de cada campo
- Color rojo (#d32f2f)
- Desaparecen al corregir el campo
```

### Errores de Guardado
```javascript
try {
    const order = orderManager.createOrder(quotation, customerData);
} catch (error) {
    showNotification(error.message, 'error');
}
```

### Errores de Espacio
```javascript
// Si localStorage está lleno
if (error.name === 'QuotaExceededError') {
    showNotification('Espacio insuficiente. Elimine pedidos antiguos.', 'error');
}
```

## Integración con WhatsApp

Después de crear el pedido, se ofrece enviar por WhatsApp:

```javascript
const message = order.toWhatsAppMessage();
const whatsappNumber = CONFIG.contact.whatsapp.number;
const url = `https://wa.me/${whatsappNumber}?text=${message}`;
window.open(url, '_blank');
```

## Configuración

Las opciones se configuran en `config.js`:

```javascript
orders: {
    requireCustomerData: ['name', 'phone'],
    optionalCustomerData: ['email', 'address', 'installationDate'],
    paymentMethods: ['cash', 'transfer', 'card'],
    enableWhatsApp: true
}
```

## Archivos Relacionados

- `js/orders.js` - Lógica del formulario y OrderManager
- `css/orders.css` - Estilos del formulario
- `test-order-form.html` - Página de pruebas
- `ORDERS_SYSTEM_README.md` - Documentación del sistema completo

## Requerimientos Cumplidos

- ✅ **4.2**: Formulario con campos de cliente, instalación y pago
- ✅ **7.3**: Validación de campos requeridos

## Próximos Pasos

Para completar el flujo de pedidos:

1. Implementar conversión de cotización a pedido (Tarea 28)
2. Implementar envío por WhatsApp (Tarea 29)
3. Crear pantalla de confirmación (Tarea 30)
4. Crear sección de consulta de estado (Tarea 31)
5. Implementar visualización de estado (Tarea 32)

## Notas Técnicas

- Compatible con ES6+
- No requiere dependencias externas
- Usa localStorage para persistencia
- Integrado con CONFIG global
- Validación en tiempo real
- Responsive y accesible
- Animaciones CSS suaves

## Ejemplo Completo

```javascript
// 1. Preparar datos de cotización
const quotationData = {
    quotationId: 'COT-1234567890-123',
    items: [
        {
            id: 'poste_hormigon_25',
            name: 'Poste de Hormigón 2.5m',
            category: 'postes',
            quantity: 10,
            unitPrice: 3500
        }
    ],
    installation: {
        linearMeters: 100,
        pricePerMeter: 500,
        subtotal: 50000
    }
};

// 2. Abrir formulario
window.orderFormUI.open(quotationData);

// 3. Usuario completa y envía formulario
// 4. Se crea el pedido automáticamente
// 5. Se muestra confirmación con opción de WhatsApp
```
