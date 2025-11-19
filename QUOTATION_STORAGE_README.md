# Sistema de Almacenamiento de Cotizaciones

## Descripción

El sistema de almacenamiento de cotizaciones permite guardar, recuperar y gestionar cotizaciones en el navegador del usuario utilizando localStorage. Las cotizaciones se guardan automáticamente cuando el usuario descarga un PDF o envía la cotización por WhatsApp.

## Características

- **Guardado automático**: Las cotizaciones se guardan automáticamente al descargar PDF o enviar por WhatsApp
- **Validez configurable**: Por defecto 30 días, configurable en `CONFIG.quotation.validityDays`
- **Precios originales**: Los precios se mantienen en la cotización guardada, incluso si cambian posteriormente
- **Recuperación por ID**: Buscar cotizaciones específicas por su ID único
- **Filtrado**: Obtener cotizaciones válidas o expiradas
- **Limpieza automática**: Eliminar cotizaciones expiradas

## Estructura de Datos

Cada cotización guardada contiene:

```javascript
{
    id: "COT-1234567890-123",           // ID único
    date: "2024-01-15T10:30:00.000Z",   // Fecha de creación
    validUntil: "2024-02-14T10:30:00.000Z", // Fecha de expiración
    projectData: {                       // Datos del proyecto
        perimeter: 100,
        fenceType: "simple",
        postType: "hormigon",
        materialType: "wire"
    },
    items: [                             // Lista de productos
        {
            id: "poste_hormigon_2_5",
            name: "Poste de Hormigón 2.5m",
            category: "postes",
            quantity: 40,
            unitPrice: 3500,             // Precio original guardado
            unit: "unidad",
            subtotal: 140000
        }
    ],
    installation: {                      // Servicio de instalación (opcional)
        linearMeters: 100,
        pricePerMeter: 500,
        subtotal: 50000
    },
    subtotal: 140000,
    total: 190000,
    status: "sent"                       // Estado: draft, sent, accepted, expired
}
```

## API de Funciones

### Funciones Globales

#### `getQuotationById(id)`
Recupera una cotización específica por su ID.

```javascript
const quotation = getQuotationById('COT-1234567890-123');
console.log(quotation);
```

#### `getAllQuotations()`
Obtiene todas las cotizaciones guardadas.

```javascript
const allQuotations = getAllQuotations();
console.log(`Total: ${allQuotations.length}`);
```

#### `getValidQuotations()`
Obtiene solo las cotizaciones que aún están dentro de su período de validez.

```javascript
const validQuotations = getValidQuotations();
console.log(`Válidas: ${validQuotations.length}`);
```

#### `getExpiredQuotations()`
Obtiene solo las cotizaciones que han expirado.

```javascript
const expiredQuotations = getExpiredQuotations();
console.log(`Expiradas: ${expiredQuotations.length}`);
```

#### `deleteQuotation(id)`
Elimina una cotización específica por su ID.

```javascript
const success = deleteQuotation('COT-1234567890-123');
if (success) {
    console.log('Cotización eliminada');
}
```

#### `cleanExpiredQuotations()`
Elimina todas las cotizaciones expiradas.

```javascript
const success = cleanExpiredQuotations();
if (success) {
    console.log('Cotizaciones expiradas eliminadas');
}
```

#### `getQuotationStorageInfo()`
Obtiene información sobre el almacenamiento de cotizaciones.

```javascript
const info = getQuotationStorageInfo();
console.log(`Total: ${info.total}`);
console.log(`Válidas: ${info.valid}`);
console.log(`Expiradas: ${info.expired}`);
console.log(`Tamaño: ${(info.storageSize / 1024).toFixed(2)} KB`);
```

### Clase QuotationStorage

Para uso avanzado, puedes instanciar directamente la clase:

```javascript
const storage = new QuotationStorage();

// Guardar una cotización manualmente
const quotationData = {
    quotationId: storage.generateId(),
    projectData: { /* ... */ },
    items: [ /* ... */ ],
    installation: { /* ... */ }
};
const saved = storage.save(quotationData);

// Obtener cotizaciones
const all = storage.getAll();
const valid = storage.getValid();
const expired = storage.getExpired();

// Buscar por ID
const quotation = storage.getById('COT-1234567890-123');

// Actualizar estado
storage.updateStatus('COT-1234567890-123', 'accepted');

// Eliminar
storage.deleteById('COT-1234567890-123');
storage.deleteExpired();

// Información
const info = storage.getStorageInfo();
```

## Configuración

La validez de las cotizaciones se configura en `config.js`:

```javascript
const CONFIG = {
    quotation: {
        validityDays: 30  // Días de validez (por defecto 30)
    }
};
```

## Almacenamiento

Las cotizaciones se guardan en localStorage con la clave `ferreteria_quotations`.

### Límites de Almacenamiento

- localStorage tiene un límite típico de 5-10 MB por dominio
- Cada cotización ocupa aproximadamente 1-2 KB
- Se pueden almacenar miles de cotizaciones sin problemas
- Se recomienda limpiar cotizaciones expiradas periódicamente

## Pruebas

Para probar el sistema de almacenamiento, abre el archivo `test-quotation-storage.html` en tu navegador:

```
http://localhost/ferreteria/test-quotation-storage.html
```

Este archivo de prueba permite:
- Crear cotizaciones de prueba
- Ver todas las cotizaciones
- Filtrar por válidas/expiradas
- Ver información del almacenamiento
- Limpiar cotizaciones expiradas
- Limpiar todo el almacenamiento

## Integración con el Sistema

El sistema de almacenamiento se integra automáticamente con:

1. **Modal de Cotización**: Al hacer clic en "Descargar PDF" o "Enviar por WhatsApp", la cotización se guarda automáticamente.

2. **Calculadora**: Los datos calculados se pasan al modal de cotización, que luego los guarda.

3. **Panel de Administración**: El panel puede acceder a todas las cotizaciones guardadas para análisis y gestión.

## Mantenimiento

### Limpieza Automática

Se recomienda implementar una limpieza automática de cotizaciones expiradas. Puedes agregar esto al inicio de la aplicación:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Limpiar cotizaciones expiradas al cargar la página
    const lastCleanup = localStorage.getItem('last_quotation_cleanup');
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (!lastCleanup || (now - parseInt(lastCleanup)) > oneDayMs) {
        cleanExpiredQuotations();
        localStorage.setItem('last_quotation_cleanup', now.toString());
    }
});
```

### Monitoreo

Puedes monitorear el uso del almacenamiento:

```javascript
setInterval(() => {
    const info = getQuotationStorageInfo();
    if (info.storageSize > 4 * 1024 * 1024) { // 4 MB
        console.warn('Almacenamiento de cotizaciones cerca del límite');
        cleanExpiredQuotations();
    }
}, 60000); // Cada minuto
```

## Ejemplos de Uso

### Ejemplo 1: Recuperar y Mostrar Cotización

```javascript
function displayQuotation(quotationId) {
    const quotation = getQuotationById(quotationId);
    
    if (!quotation) {
        console.error('Cotización no encontrada');
        return;
    }
    
    console.log(`Cotización: ${quotation.id}`);
    console.log(`Fecha: ${new Date(quotation.date).toLocaleDateString('es-AR')}`);
    console.log(`Válida hasta: ${new Date(quotation.validUntil).toLocaleDateString('es-AR')}`);
    console.log(`Total: $${quotation.total.toLocaleString('es-AR')}`);
    
    quotation.items.forEach(item => {
        console.log(`- ${item.name}: ${item.quantity} x $${item.unitPrice}`);
    });
}
```

### Ejemplo 2: Listar Cotizaciones Válidas

```javascript
function listValidQuotations() {
    const validQuotations = getValidQuotations();
    
    console.log(`Cotizaciones válidas: ${validQuotations.length}`);
    
    validQuotations.forEach(q => {
        const daysLeft = Math.ceil((new Date(q.validUntil) - new Date()) / (1000 * 60 * 60 * 24));
        console.log(`${q.id} - Total: $${q.total} - Vence en ${daysLeft} días`);
    });
}
```

### Ejemplo 3: Exportar Cotizaciones a CSV

```javascript
function exportQuotationsToCSV() {
    const quotations = getAllQuotations();
    
    let csv = 'ID,Fecha,Total,Estado,Válida Hasta\n';
    
    quotations.forEach(q => {
        csv += `${q.id},${new Date(q.date).toLocaleDateString('es-AR')},${q.total},${q.status},${new Date(q.validUntil).toLocaleDateString('es-AR')}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cotizaciones.csv';
    a.click();
}
```

## Solución de Problemas

### Error: "No se pudo guardar la cotización"

- Verifica que localStorage esté habilitado en el navegador
- Verifica que no se haya alcanzado el límite de almacenamiento
- Limpia cotizaciones expiradas con `cleanExpiredQuotations()`

### Las cotizaciones no aparecen

- Verifica que el script `quotation.js` esté cargado
- Abre la consola del navegador y ejecuta `getAllQuotations()`
- Verifica que no haya errores en la consola

### Pérdida de datos

- localStorage es persistente pero puede ser limpiado por el usuario
- Para datos críticos, considera implementar sincronización con servidor
- Implementa exportación periódica de datos

## Próximas Mejoras

- Sincronización con servidor backend
- Exportación automática a Google Sheets
- Notificaciones de cotizaciones próximas a expirar
- Historial de cambios de estado
- Búsqueda y filtrado avanzado
