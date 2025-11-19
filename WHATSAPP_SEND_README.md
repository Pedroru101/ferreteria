# Envío de Pedidos por WhatsApp

## Descripción

Sistema de envío automático de pedidos por WhatsApp que formatea y envía los datos del pedido al número configurado en `config.js`.

## Características Implementadas

### 1. Formateo de Mensaje
El mensaje de WhatsApp incluye:
- ✅ Número de orden único
- ✅ Fecha del pedido
- ✅ Datos del cliente (nombre, teléfono, email, dirección)
- ✅ Lista de productos con cantidades y precios
- ✅ Información de instalación (si aplica)
- ✅ Fecha preferida de instalación (si aplica)
- ✅ Método de pago preferido
- ✅ Total del pedido

### 2. Envío Automático
- El pedido se envía automáticamente por WhatsApp después de ser creado
- Se abre WhatsApp Web o la aplicación en una nueva pestaña
- El mensaje está pre-cargado y listo para enviar

### 3. Validaciones
- Verifica que el número de WhatsApp esté configurado
- Maneja errores de forma elegante
- Muestra notificaciones al usuario

## Uso

### Configuración

Asegúrate de tener configurado el número de WhatsApp en `config.js`:

```javascript
const CONFIG = {
    contact: {
        whatsapp: {
            number: '5491171416157', // Sin espacios ni guiones
            displayNumber: '+54 9 11 7141-6157'
        }
    }
};
```

### Desde el Formulario de Pedido

1. El usuario completa el formulario de pedido
2. Al hacer clic en "Confirmar Pedido":
   - Se crea el pedido en localStorage
   - Se muestra notificación de éxito
   - Se abre WhatsApp automáticamente con el mensaje pre-cargado

### Programáticamente

```javascript
// Crear instancia del OrderFormUI
const orderFormUI = new OrderFormUI();

// Crear un pedido
const order = orderManager.createOrder(quotation, customerData);

// Enviar por WhatsApp
orderFormUI.sendOrderViaWhatsApp(order);
```

## Formato del Mensaje

Ejemplo de mensaje generado:

```
*Nuevo Pedido - Metales & Hierros Mar del Plata*

*Número de Orden:* ORD-20240115-0001
*Fecha:* 15/01/2024

*Cliente:*
Nombre: Juan Pérez
Teléfono: +54 9 11 1234-5678
Email: juan.perez@example.com
Dirección: Av. Libertador 1234, Mar del Plata, Buenos Aires

*Productos:*
1. Poste de Hormigón 2.5m x10 - $35.000
2. Tejido Romboidal 1.50m x 10m x5 - $42.500
3. Alambre Galvanizado Cal. 14 x20 - $9.000

*Instalación:*
100m x $500 = $50.000
Fecha preferida: 15/02/2024

*Método de Pago Preferido:* Transferencia

*Total: $136.500*
```

## Métodos Principales

### `Order.toWhatsAppMessage()`
Genera el mensaje formateado para WhatsApp.

**Retorna:** String con el mensaje codificado para URL

```javascript
const message = order.toWhatsAppMessage();
// Retorna: mensaje codificado con encodeURIComponent()
```

### `OrderFormUI.sendOrderViaWhatsApp(order)`
Envía el pedido por WhatsApp abriendo la aplicación.

**Parámetros:**
- `order` (Order): Instancia del pedido a enviar

**Retorna:** Boolean indicando éxito o fallo

```javascript
const success = orderFormUI.sendOrderViaWhatsApp(order);
if (success) {
    console.log('WhatsApp abierto correctamente');
}
```

## Flujo de Envío

```
Usuario completa formulario
        ↓
Validación de datos
        ↓
Creación del pedido
        ↓
Guardado en localStorage
        ↓
Formateo del mensaje
        ↓
Apertura de WhatsApp
        ↓
Usuario envía el mensaje
```

## Manejo de Errores

### Error: Número no configurado
```javascript
if (!whatsappNumber) {
    throw new Error('Número de WhatsApp no configurado');
}
```

**Solución:** Configurar el número en `config.js`

### Error: Datos incompletos
```javascript
if (!order.customer.name || !order.customer.phone) {
    throw new Error('Datos del cliente incompletos');
}
```

**Solución:** Asegurar que los campos requeridos estén completos

## Testing

### Archivo de Prueba
Abre `test-whatsapp-send.html` en el navegador para probar:

1. **Crear Pedido de Prueba**: Genera un pedido con datos de ejemplo
2. **Vista Previa del Mensaje**: Muestra el mensaje formateado
3. **Enviar por WhatsApp**: Abre WhatsApp con el mensaje
4. **Probar Formulario**: Abre el formulario completo de pedido

### Pruebas Manuales

```javascript
// En la consola del navegador

// 1. Crear pedido de prueba
const testQuotation = {
    id: 'COT-TEST-001',
    items: [
        {
            name: 'Producto Test',
            quantity: 5,
            unitPrice: 1000,
            subtotal: 5000
        }
    ],
    total: 5000
};

const testCustomer = {
    name: 'Test User',
    phone: '+54 9 11 1234-5678',
    email: 'test@example.com',
    address: 'Dirección de prueba',
    paymentMethod: 'cash'
};

// 2. Crear orden
const orderManager = new OrderManager();
const order = orderManager.createOrder(testQuotation, testCustomer);

// 3. Ver mensaje
console.log(decodeURIComponent(order.toWhatsAppMessage()));

// 4. Enviar por WhatsApp
const orderFormUI = new OrderFormUI();
orderFormUI.sendOrderViaWhatsApp(order);
```

## Compatibilidad

- ✅ Chrome/Edge (últimas 2 versiones)
- ✅ Firefox (últimas 2 versiones)
- ✅ Safari (últimas 2 versiones)
- ✅ WhatsApp Web
- ✅ WhatsApp Desktop
- ✅ WhatsApp Mobile (iOS/Android)

## Notas Importantes

1. **Formato del Número**: El número debe estar en formato internacional sin espacios ni guiones
   - ✅ Correcto: `5491171416157`
   - ❌ Incorrecto: `+54 9 11 7141-6157`

2. **Límite de Caracteres**: WhatsApp tiene un límite de ~65,000 caracteres por mensaje

3. **Codificación**: El mensaje se codifica con `encodeURIComponent()` para URL

4. **Privacidad**: Los datos se envían directamente a WhatsApp, no pasan por servidores intermedios

## Próximas Mejoras

- [ ] Plantillas de mensaje personalizables
- [ ] Envío de imágenes de productos
- [ ] Confirmación de lectura
- [ ] Historial de mensajes enviados
- [ ] Integración con WhatsApp Business API

## Soporte

Para problemas o consultas:
- Revisar la consola del navegador para errores
- Verificar la configuración en `config.js`
- Probar con `test-whatsapp-send.html`
