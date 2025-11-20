# Ejemplos de Integración de Analytics

Este documento proporciona ejemplos prácticos de cómo integrar el sistema de analytics en los módulos existentes del sitio.

## 1. Integración en Calculadora (calculator.js)

### Evento: Abrir Calculadora

```javascript
// En calculator.js, cuando se abre la sección
document.addEventListener('DOMContentLoaded', () => {
    const calculatorSection = document.getElementById('calculadora');
    
    if (calculatorSection) {
        // Registrar que se abrió la calculadora
        analyticsManager.trackEvent('calculator_open', {
            event_category: 'calculator',
            event_label: 'Calculadora abierta'
        });
    }
});
```

### Evento: Realizar Cálculo

```javascript
// En la función que realiza el cálculo
function performCalculation() {
    const length = parseFloat(document.getElementById('length').value);
    const width = parseFloat(document.getElementById('width').value);
    const postType = document.getElementById('postType').value;
    const materialType = document.getElementById('materialType').value;
    
    // Realizar cálculo
    const result = calculator.calculate(length, width, postType, materialType);
    
    // Registrar evento de cálculo
    if (analyticsManager) {
        analyticsManager.trackCalculation({
            perimeter: result.perimeter,
            postType: postType,
            materialType: materialType,
            totalPosts: result.totalPosts
        });
    }
    
    // Mostrar resultados
    displayResults(result);
}
```

### Evento: Generar Cotización desde Calculadora

```javascript
// En el botón "Generar Cotización"
document.getElementById('generateQuoteBtn').addEventListener('click', () => {
    const calculationData = getCalculationData();
    
    // Registrar evento
    if (analyticsManager) {
        analyticsManager.trackEvent('calculator_export', {
            perimeter: calculationData.perimeter,
            post_type: calculationData.postType,
            event_category: 'calculator',
            event_label: 'Cotización generada desde calculadora'
        });
    }
    
    // Generar cotización
    generateQuotation(calculationData);
});
```

## 2. Integración en Cotizaciones (quotation.js)

### Evento: Crear Cotización

```javascript
// En la clase Quotation, cuando se crea una nueva instancia
class Quotation {
    constructor(items = []) {
        this.id = this.generateId();
        this.items = items;
        this.date = new Date();
        this.total = this.calculateTotal();
        
        // Registrar evento de creación
        if (typeof analyticsManager !== 'undefined' && analyticsManager) {
            analyticsManager.trackQuotationCreated({
                id: this.id,
                total: this.total,
                items: this.items,
                installation: this.installation
            });
        }
    }
}
```

### Evento: Descargar PDF

```javascript
// En la función que descarga el PDF
function downloadQuotationPDF(quotation) {
    try {
        // Generar PDF
        const pdf = generatePDF(quotation);
        
        // Registrar evento
        if (analyticsManager) {
            analyticsManager.trackPDFDownload({
                id: quotation.id,
                total: quotation.total
            });
        }
        
        // Descargar archivo
        pdf.save(`cotizacion-${quotation.id}.pdf`);
    } catch (error) {
        console.error('Error al descargar PDF:', error);
        if (analyticsManager) {
            analyticsManager.trackError(error.message, 'quotation_pdf_download');
        }
    }
}
```

### Evento: Enviar por WhatsApp

```javascript
// En la función que envía por WhatsApp
function sendQuotationWhatsApp(quotation) {
    try {
        const message = formatQuotationMessage(quotation);
        const whatsappUrl = `https://wa.me/${CONFIG.contact.whatsapp.number}?text=${message}`;
        
        // Registrar evento
        if (analyticsManager) {
            analyticsManager.trackWhatsAppSend({
                id: quotation.id,
                total: quotation.total
            });
        }
        
        // Abrir WhatsApp
        window.open(whatsappUrl, '_blank');
    } catch (error) {
        console.error('Error al enviar por WhatsApp:', error);
        if (analyticsManager) {
            analyticsManager.trackError(error.message, 'quotation_whatsapp_send');
        }
    }
}
```

### Evento: Guardar Cotización

```javascript
// En la función que guarda la cotización
function saveQuotation(quotation) {
    try {
        const quotations = JSON.parse(localStorage.getItem('ferreteria_quotations')) || [];
        quotations.push(quotation);
        localStorage.setItem('ferreteria_quotations', JSON.stringify(quotations));
        
        // Registrar evento
        if (analyticsManager) {
            analyticsManager.trackEvent('quotation_save', {
                quotation_id: quotation.id,
                quotation_total: quotation.total,
                event_category: 'quotation',
                event_label: 'Cotización guardada'
            });
        }
        
        showNotification('Cotización guardada correctamente', 'success');
    } catch (error) {
        console.error('Error al guardar cotización:', error);
        if (analyticsManager) {
            analyticsManager.trackError(error.message, 'quotation_save');
        }
    }
}
```

## 3. Integración en Catálogo (catalog.js)

### Evento: Ver Producto

```javascript
// En la función que abre el modal de producto
function openProductModal(product) {
    // Registrar evento
    if (analyticsManager) {
        analyticsManager.trackViewProduct({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price
        });
    }
    
    // Mostrar modal
    displayProductModal(product);
}
```

### Evento: Agregar al Carrito

```javascript
// En el botón "Agregar a Cotización"
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-quote-btn')) {
        const product = getProductFromModal();
        const quantity = parseInt(document.getElementById('quantity').value);
        
        // Agregar al carrito
        catalogManager.addToQuote(product.id, quantity);
        
        // Registrar evento
        if (analyticsManager) {
            analyticsManager.trackAddToCart({
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                quantity: quantity
            });
        }
        
        showNotification('Producto agregado al carrito', 'success');
    }
});
```

### Evento: Remover del Carrito

```javascript
// En la función que remueve del carrito
function removeFromCart(productId) {
    const product = catalogManager.getProduct(productId);
    
    // Remover del carrito
    catalogManager.removeFromQuote(productId);
    
    // Registrar evento
    if (analyticsManager) {
        analyticsManager.trackEvent('catalog_remove_from_cart', {
            product_id: product.id,
            product_name: product.name,
            product_category: product.category,
            event_category: 'catalog',
            event_label: 'Producto removido del carrito'
        });
    }
}
```

## 4. Integración en Pedidos (orders.js)

### Evento: Crear Pedido

```javascript
// En la clase Order, cuando se crea una nueva instancia
class Order {
    constructor(quotation, customerData) {
        this.id = this.generateOrderId();
        this.quotationId = quotation.id;
        this.items = quotation.items;
        this.total = quotation.total;
        this.customer = customerData;
        this.date = new Date();
        
        // Registrar evento
        if (typeof analyticsManager !== 'undefined' && analyticsManager) {
            analyticsManager.trackOrderCreated({
                id: this.id,
                total: this.total,
                items: this.items,
                customer: this.customer
            });
        }
    }
}
```

### Evento: Confirmar Pedido

```javascript
// En la función que confirma el pedido
function confirmOrder(order) {
    try {
        // Guardar pedido
        saveOrder(order);
        
        // Registrar evento
        if (analyticsManager) {
            analyticsManager.trackEvent('order_confirm', {
                order_id: order.id,
                order_total: order.total,
                customer_name: order.customer.name,
                event_category: 'order',
                event_label: 'Pedido confirmado'
            });
        }
        
        // Mostrar confirmación
        showOrderConfirmation(order);
    } catch (error) {
        console.error('Error al confirmar pedido:', error);
        if (analyticsManager) {
            analyticsManager.trackError(error.message, 'order_confirm');
        }
    }
}
```

### Evento: Consultar Estado de Pedido

```javascript
// En la función que consulta el estado
function trackOrder(orderId) {
    try {
        const order = findOrder(orderId);
        
        // Registrar evento
        if (analyticsManager) {
            analyticsManager.trackEvent('order_track', {
                order_id: order.id,
                order_status: order.status,
                event_category: 'order',
                event_label: 'Estado de pedido consultado'
            });
        }
        
        // Mostrar estado
        displayOrderStatus(order);
    } catch (error) {
        console.error('Error al consultar pedido:', error);
        if (analyticsManager) {
            analyticsManager.trackError(error.message, 'order_track');
        }
    }
}
```

### Evento: Actualizar Estado de Pedido (Admin)

```javascript
// En la función de admin que actualiza el estado
function updateOrderStatus(orderId, newStatus, note) {
    try {
        const order = findOrder(orderId);
        order.updateStatus(newStatus, note);
        saveOrder(order);
        
        // Registrar evento
        if (analyticsManager) {
            analyticsManager.trackEvent('order_update_status', {
                order_id: order.id,
                old_status: order.status,
                new_status: newStatus,
                admin_action: true,
                event_category: 'order',
                event_label: 'Estado de pedido actualizado'
            });
        }
        
        showNotification('Estado actualizado correctamente', 'success');
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        if (analyticsManager) {
            analyticsManager.trackError(error.message, 'order_update_status');
        }
    }
}
```

## 5. Integración en Comparador (comparator.js)

### Evento: Abrir Comparador

```javascript
// Cuando se abre la sección del comparador
document.addEventListener('DOMContentLoaded', () => {
    const comparatorSection = document.getElementById('comparador');
    
    if (comparatorSection) {
        // Registrar evento
        if (analyticsManager) {
            analyticsManager.trackEvent('comparator_open', {
                event_category: 'comparator',
                event_label: 'Comparador abierto'
            });
        }
    }
});
```

### Evento: Seleccionar Productos para Comparar

```javascript
// En la función que selecciona productos
function selectProductsForComparison() {
    const selectedProducts = getSelectedProducts();
    
    // Validar selección
    if (selectedProducts.length > 3) {
        showNotification('Máximo 3 productos', 'error');
        return;
    }
    
    // Registrar evento
    if (analyticsManager) {
        analyticsManager.trackComparison(selectedProducts);
    }
    
    // Mostrar comparación
    displayComparison(selectedProducts);
}
```

### Evento: Usar Solución del Comparador

```javascript
// En el botón "Usar esta solución"
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('use-solution-btn')) {
        const solution = getSolutionFromComparison();
        
        // Registrar evento
        if (analyticsManager) {
            analyticsManager.trackEvent('comparator_use_solution', {
                solution_name: solution.name,
                solution_price: solution.price,
                event_category: 'comparator',
                event_label: 'Solución utilizada'
            });
        }
        
        // Pre-cargar calculadora
        preloadCalculator(solution);
        
        // Scroll a calculadora
        document.getElementById('calculadora').scrollIntoView({ behavior: 'smooth' });
    }
});
```

## 6. Integración en Administración (admin.js)

### Evento: Login en Admin

```javascript
// En la función de login
function adminLogin(password) {
    if (adminAuth.login(password)) {
        // Registrar evento
        if (analyticsManager) {
            analyticsManager.trackAdminLogin('Administrator');
        }
        
        showAdminDashboard();
    } else {
        showNotification('Contraseña incorrecta', 'error');
    }
}
```

### Evento: Actualizar Precio

```javascript
// En la función que actualiza precios
function updateProductPrice(productId, newPrice) {
    try {
        const product = getProduct(productId);
        const oldPrice = product.price;
        
        product.price = newPrice;
        saveProduct(product);
        
        // Registrar evento
        if (analyticsManager) {
            analyticsManager.trackEvent('admin_update_price', {
                product_id: productId,
                product_name: product.name,
                old_price: oldPrice,
                new_price: newPrice,
                price_change_percent: ((newPrice - oldPrice) / oldPrice * 100).toFixed(2),
                event_category: 'admin',
                event_label: 'Precio actualizado'
            });
        }
        
        showNotification('Precio actualizado', 'success');
    } catch (error) {
        console.error('Error al actualizar precio:', error);
        if (analyticsManager) {
            analyticsManager.trackError(error.message, 'admin_update_price');
        }
    }
}
```

### Evento: Exportar Datos

```javascript
// En la función que exporta datos
function exportData(dataType) {
    try {
        const data = getDataForExport(dataType);
        const csv = convertToCSV(data);
        
        // Registrar evento
        if (analyticsManager) {
            analyticsManager.trackEvent('admin_export_data', {
                export_type: dataType,
                records_count: data.length,
                event_category: 'admin',
                event_label: 'Datos exportados'
            });
        }
        
        downloadCSV(csv, `export-${dataType}.csv`);
    } catch (error) {
        console.error('Error al exportar:', error);
        if (analyticsManager) {
            analyticsManager.trackError(error.message, 'admin_export_data');
        }
    }
}
```

## 7. Manejo de Errores Global

### Capturar Errores No Manejados

```javascript
// En script.js o archivo principal
window.addEventListener('error', (event) => {
    if (analyticsManager) {
        analyticsManager.trackError(
            event.message,
            `${event.filename}:${event.lineno}:${event.colno}`
        );
    }
});

// Para promesas rechazadas
window.addEventListener('unhandledrejection', (event) => {
    if (analyticsManager) {
        analyticsManager.trackError(
            event.reason?.message || 'Unhandled Promise Rejection',
            'unhandled_promise'
        );
    }
});
```

## 8. Tracking de Formularios

### Formulario de Contacto

```javascript
// En el formulario de contacto
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Registrar evento
    if (analyticsManager) {
        analyticsManager.trackFormSubmit('contact_form', data);
    }
    
    // Enviar formulario
    submitContactForm(data);
});
```

### Formulario de Pedido

```javascript
// En el formulario de pedido
document.getElementById('orderForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Registrar evento
    if (analyticsManager) {
        analyticsManager.trackFormSubmit('order_form', data);
    }
    
    // Procesar pedido
    processOrder(data);
});
```

## 9. Tracking de Sesión

### Registrar Duración de Sesión

```javascript
// Cuando el usuario abandona la página
window.addEventListener('beforeunload', () => {
    if (analyticsManager) {
        analyticsManager.trackSessionDuration();
    }
});
```

### Registrar Inactividad

```javascript
// Detectar inactividad
let inactivityTimer;

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    
    inactivityTimer = setTimeout(() => {
        if (analyticsManager) {
            analyticsManager.trackEvent('user_inactive', {
                inactive_duration_minutes: 15,
                event_category: 'session',
                event_label: 'Usuario inactivo'
            });
        }
    }, 15 * 60 * 1000); // 15 minutos
}

document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);
document.addEventListener('click', resetInactivityTimer);
```

## Notas Importantes

1. **Siempre verificar que analyticsManager existe** antes de usarlo
2. **No registrar datos sensibles** como contraseñas o información personal
3. **Usar nombres de eventos consistentes** con los definidos en config.js
4. **Incluir contexto relevante** en cada evento
5. **Probar en desarrollo** antes de desplegar a producción
6. **Revisar la consola** para verificar que los eventos se registren correctamente
