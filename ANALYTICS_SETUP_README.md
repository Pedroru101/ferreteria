# Guía de Configuración de Analytics y Monitoreo

## Descripción General

Este documento describe cómo configurar y utilizar el sistema de analytics integrado en el sitio de Metales & Hierros Mar del Plata. El sistema soporta Google Analytics 4, Google Tag Manager y Facebook Pixel.

## Configuración Inicial

### 1. Google Analytics 4

#### Obtener el ID de Google Analytics

1. Acceder a [Google Analytics](https://analytics.google.com/)
2. Crear una nueva propiedad o seleccionar una existente
3. En la sección "Administración" → "Propiedades" → "Detalles de la propiedad"
4. Copiar el ID de medición (formato: `G-XXXXXXXXXX`)

#### Configurar en config.js

```javascript
const CONFIG = {
    analytics: {
        googleAnalyticsId: 'G-XXXXXXXXXX', // Reemplazar con tu ID
        enableEventTracking: true
    }
};
```

### 2. Google Tag Manager (Opcional)

#### Obtener el ID de GTM

1. Acceder a [Google Tag Manager](https://tagmanager.google.com/)
2. Crear un contenedor o seleccionar uno existente
3. Copiar el ID del contenedor (formato: `GTM-XXXXXXX`)

#### Configurar en config.js

```javascript
const CONFIG = {
    analytics: {
        googleTagManagerId: 'GTM-XXXXXXX', // Reemplazar con tu ID
        enableEventTracking: true
    }
};
```

### 3. Facebook Pixel (Opcional)

#### Obtener el ID de Facebook Pixel

1. Acceder a [Facebook Business Manager](https://business.facebook.com/)
2. Ir a "Eventos" → "Píxeles"
3. Crear un nuevo píxel o seleccionar uno existente
4. Copiar el ID del píxel

#### Configurar en config.js

```javascript
const CONFIG = {
    analytics: {
        facebookPixelId: '123456789', // Reemplazar con tu ID
        enableEventTracking: true
    }
};
```

## Eventos Disponibles

### Eventos de Calculadora

- **calculator_open**: Se dispara cuando el usuario abre la sección de calculadora
- **calculator_calculate**: Se dispara cuando el usuario realiza un cálculo
- **calculator_export**: Se dispara cuando el usuario exporta los resultados

**Datos capturados:**
- `perimeter`: Perímetro calculado
- `post_type`: Tipo de poste seleccionado
- `material_type`: Tipo de material (alambre/tejido)
- `total_posts`: Cantidad total de postes

### Eventos de Cotización

- **quotation_create**: Se dispara cuando se crea una cotización
- **quotation_view**: Se dispara cuando se visualiza una cotización
- **quotation_download_pdf**: Se dispara cuando se descarga un PDF
- **quotation_send_whatsapp**: Se dispara cuando se envía por WhatsApp
- **quotation_save**: Se dispara cuando se guarda una cotización

**Datos capturados:**
- `quotation_id`: ID único de la cotización
- `quotation_total`: Total de la cotización
- `items_count`: Cantidad de items
- `has_installation`: Si incluye servicio de instalación

### Eventos de Catálogo

- **catalog_view_product**: Se dispara cuando se visualiza un producto
- **catalog_add_to_cart**: Se dispara cuando se agrega un producto al carrito
- **catalog_remove_from_cart**: Se dispara cuando se remueve un producto

**Datos capturados:**
- `product_id`: ID del producto
- `product_name`: Nombre del producto
- `product_category`: Categoría del producto
- `product_price`: Precio del producto
- `quantity`: Cantidad

### Eventos de Pedidos

- **order_create**: Se dispara cuando se crea un pedido
- **order_confirm**: Se dispara cuando se confirma un pedido
- **order_track**: Se dispara cuando se consulta el estado
- **order_update_status**: Se dispara cuando se actualiza el estado

**Datos capturados:**
- `order_id`: ID del pedido
- `order_total`: Total del pedido
- `items_count`: Cantidad de items
- `customer_name`: Nombre del cliente

### Eventos de Comparador

- **comparator_open**: Se dispara cuando se abre el comparador
- **comparator_select_products**: Se dispara cuando se seleccionan productos
- **comparator_use_solution**: Se dispara cuando se usa una solución

**Datos capturados:**
- `products_count`: Cantidad de productos comparados
- `products`: Lista de productos

### Eventos de Administración

- **admin_login**: Se dispara cuando un administrador inicia sesión
- **admin_logout**: Se dispara cuando un administrador cierra sesión
- **admin_update_price**: Se dispara cuando se actualiza un precio
- **admin_export_data**: Se dispara cuando se exportan datos

**Datos capturados:**
- `admin_name`: Nombre del administrador
- `action_type`: Tipo de acción realizada

### Eventos Generales

- **page_view**: Se dispara automáticamente en cada página
- **form_submit**: Se dispara cuando se envía un formulario
- **error_occurred**: Se dispara cuando ocurre un error

## Goals (Objetivos)

Los goals son conversiones importantes que se registran en Google Analytics:

### Goals Configurados

1. **quotation_created** - Cotización Creada
   - Se registra cuando un usuario crea una cotización
   - Valor: Total de la cotización

2. **order_created** - Pedido Creado
   - Se registra cuando un usuario crea un pedido
   - Valor: Total del pedido

3. **pdf_downloaded** - PDF Descargado
   - Se registra cuando se descarga un PDF
   - Valor: 1

4. **whatsapp_sent** - Mensaje WhatsApp Enviado
   - Se registra cuando se envía una cotización por WhatsApp
   - Valor: 1

## Uso en el Código

### Inicialización Automática

El sistema de analytics se inicializa automáticamente cuando se carga la página si está configurado en `config.js`:

```javascript
// En index.html se carga automáticamente
<script src="js/analytics.js"></script>
```

### Registrar Eventos Personalizados

Para registrar eventos desde cualquier parte del código:

```javascript
// Evento simple
analyticsManager.trackEvent('calculator_calculate', {
    perimeter: 100,
    post_type: 'hormigon'
});

// Evento de cotización creada
analyticsManager.trackQuotationCreated({
    id: 'COT-123456',
    total: 50000,
    items: [...],
    installation: null
});

// Evento de pedido creado
analyticsManager.trackOrderCreated({
    id: 'ORD-20240115-0001',
    total: 85000,
    items: [...],
    customer: { name: 'Juan Pérez' }
});

// Evento de descarga de PDF
analyticsManager.trackPDFDownload({
    id: 'COT-123456',
    total: 50000
});

// Evento de envío por WhatsApp
analyticsManager.trackWhatsAppSend({
    id: 'COT-123456',
    total: 50000
});

// Evento de producto agregado
analyticsManager.trackAddToCart({
    id: 'prod_001',
    name: 'Poste de Hormigón',
    category: 'postes',
    price: 3500,
    quantity: 10
});

// Evento de vista de producto
analyticsManager.trackViewProduct({
    id: 'prod_001',
    name: 'Poste de Hormigón',
    category: 'postes',
    price: 3500
});

// Evento de cálculo
analyticsManager.trackCalculation({
    perimeter: 100,
    postType: 'hormigon',
    materialType: 'alambre',
    totalPosts: 40
});

// Evento de comparación
analyticsManager.trackComparison([
    { name: 'Hormigón' },
    { name: 'Quebracho' }
]);

// Evento de error
analyticsManager.trackError('Error al guardar', 'quotation_save');

// Evento de formulario
analyticsManager.trackFormSubmit('contact_form', {
    name: 'Juan',
    email: 'juan@example.com'
});
```

### Registrar Goals

```javascript
// Registrar un goal
analyticsManager.trackGoal('quotation_created', 50000);
analyticsManager.trackGoal('order_created', 85000);
analyticsManager.trackGoal('pdf_downloaded', 1);
analyticsManager.trackGoal('whatsapp_sent', 1);
```

### Obtener Información de Sesión

```javascript
// Obtener información de la sesión actual
const sessionInfo = analyticsManager.getSessionInfo();
console.log(sessionInfo);
// {
//   startTime: Date,
//   duration: 300,
//   pageTitle: "...",
//   pageUrl: "...",
//   referrer: "..."
// }

// Registrar duración de sesión
analyticsManager.trackSessionDuration();

// Reiniciar sesión
analyticsManager.resetSession();
```

## Integración con Módulos Existentes

### Calculadora (calculator.js)

```javascript
// Al realizar un cálculo
analyticsManager.trackCalculation({
    perimeter: result.perimeter,
    postType: selectedPostType,
    materialType: selectedMaterialType,
    totalPosts: result.totalPosts
});
```

### Cotizaciones (quotation.js)

```javascript
// Al crear una cotización
analyticsManager.trackQuotationCreated(quotation);

// Al descargar PDF
analyticsManager.trackPDFDownload(quotation);

// Al enviar por WhatsApp
analyticsManager.trackWhatsAppSend(quotation);
```

### Catálogo (catalog.js)

```javascript
// Al ver un producto
analyticsManager.trackViewProduct(product);

// Al agregar al carrito
analyticsManager.trackAddToCart(product);
```

### Pedidos (orders.js)

```javascript
// Al crear un pedido
analyticsManager.trackOrderCreated(order);

// Al confirmar un pedido
analyticsManager.trackEvent('order_confirm', {
    order_id: order.id,
    order_total: order.total
});
```

### Administración (admin.js)

```javascript
// Al iniciar sesión
analyticsManager.trackAdminLogin(adminName);

// Al actualizar precio
analyticsManager.trackEvent('admin_update_price', {
    product_id: productId,
    old_price: oldPrice,
    new_price: newPrice
});

// Al exportar datos
analyticsManager.trackEvent('admin_export_data', {
    export_type: 'csv',
    records_count: count
});
```

## Configuración en Google Analytics

### Crear Eventos Personalizados

1. En Google Analytics, ir a "Administración" → "Propiedades" → "Eventos personalizados"
2. Crear eventos para cada uno de los eventos listados arriba
3. Configurar parámetros para cada evento

### Crear Goals/Conversiones

1. En Google Analytics, ir a "Administración" → "Propiedades" → "Conversiones"
2. Crear conversiones para:
   - Cotización creada
   - Pedido creado
   - PDF descargado
   - WhatsApp enviado

### Crear Audiencias

1. En Google Analytics, ir a "Administración" → "Propiedades" → "Audiencias"
2. Crear audiencias basadas en eventos:
   - Usuarios que crearon cotizaciones
   - Usuarios que crearon pedidos
   - Usuarios que descargaron PDFs

## Configuración en Google Tag Manager

### Crear Tags

1. En GTM, crear tags para cada evento importante
2. Configurar triggers basados en eventos de GA
3. Enviar datos a Google Analytics y otras plataformas

### Crear Variables

```
Variable: GA Event Name
Tipo: Data Layer Variable
Nombre de variable: event

Variable: GA Event Parameters
Tipo: Data Layer Variable
Nombre de variable: eventData
```

## Configuración en Facebook Pixel

### Crear Eventos Personalizados

1. En Facebook Business Manager, ir a "Eventos"
2. Crear eventos personalizados para:
   - Cotización creada (Lead)
   - Pedido creado (Purchase)
   - PDF descargado (ViewContent)
   - Producto visto (ViewContent)

### Crear Audiencias

1. Crear audiencias personalizadas basadas en eventos
2. Crear audiencias lookalike para retargeting

## Monitoreo y Debugging

### Verificar que Analytics está funcionando

1. Abrir la consola del navegador (F12)
2. Buscar mensajes `[Analytics]` en la consola
3. Verificar que los eventos se registren correctamente

### Usar Google Analytics Debugger

1. Instalar la extensión "Google Analytics Debugger" en Chrome
2. Activar la extensión
3. Abrir la consola del navegador
4. Ir a la pestaña "Google Analytics"
5. Verificar que los eventos se envíen correctamente

### Usar Real-Time Reports

1. En Google Analytics, ir a "Reportes" → "En tiempo real"
2. Realizar acciones en el sitio
3. Verificar que aparezcan en tiempo real

## Mejores Prácticas

1. **Nombres de eventos consistentes**: Usar nombres en minúsculas con guiones bajos
2. **Parámetros descriptivos**: Incluir información relevante en cada evento
3. **Evitar datos sensibles**: No registrar información personal o sensible
4. **Pruebas**: Probar eventos en ambiente de desarrollo antes de producción
5. **Documentación**: Mantener documentado cada evento y su propósito
6. **Revisión periódica**: Revisar regularmente qué eventos se están registrando

## Troubleshooting

### Los eventos no aparecen en Google Analytics

1. Verificar que el ID de GA esté correcto en config.js
2. Verificar que `enableEventTracking` esté en `true`
3. Verificar en la consola que no haya errores
4. Usar Google Analytics Debugger para verificar
5. Esperar 24-48 horas para que aparezcan en reportes

### Los goals no se registran

1. Verificar que el evento se dispare correctamente
2. Verificar que el goal esté configurado en GA
3. Verificar que el nombre del evento coincida exactamente
4. Usar Real-Time Reports para verificar en tiempo real

### Facebook Pixel no funciona

1. Verificar que el ID de pixel esté correcto
2. Verificar que `fbq` esté disponible en la consola
3. Usar Facebook Pixel Helper para debugging
4. Verificar que los eventos se envíen correctamente

## Recursos Adicionales

- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [Google Tag Manager Documentation](https://support.google.com/tagmanager)
- [Facebook Pixel Documentation](https://developers.facebook.com/docs/facebook-pixel)
- [Google Analytics Debugger Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger)
- [Facebook Pixel Helper Extension](https://chrome.google.com/webstore/detail/facebook-pixel-helper)

## Soporte

Para preguntas o problemas con la configuración de analytics, contactar al equipo de desarrollo.
