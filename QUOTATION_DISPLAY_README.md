# Visualización de Cotizaciones Guardadas

## Descripción

Este módulo permite visualizar cotizaciones guardadas en localStorage con un diseño consistente con el sitio web, respetando el tema claro/oscuro y mostrando toda la información relevante incluyendo la fecha de validez.

## Características Implementadas

### 1. Visualización de Cotización Individual

La clase `QuotationStorage` incluye el método `displayQuotation(quotationId, containerId)` que:

- Busca la cotización por ID en localStorage
- Genera HTML con el diseño del sitio (usando clases CSS existentes)
- Muestra toda la información de la cotización
- Respeta el tema claro/oscuro activo
- Indica visualmente si la cotización está válida o expirada

### 2. Sección de Consulta de Cotizaciones

Se agregó una nueva sección en `index.html` (`#consulta-cotizacion`) que incluye:

- **Formulario de búsqueda**: Input para ingresar el ID de cotización
- **Contenedor de visualización**: Donde se muestra la cotización encontrada
- **Mensaje de error**: Si no se encuentra la cotización
- **Lista de cotizaciones recientes**: Muestra las últimas 5 cotizaciones guardadas

### 3. Diseño Responsive

Los estilos CSS incluyen:

- Diseño adaptable para mobile, tablet y desktop
- Uso de variables CSS existentes para consistencia
- Soporte completo para modo claro y oscuro
- Animaciones suaves y transiciones

### 4. Información Mostrada

Cada cotización visualizada incluye:

- **Encabezado**: ID de cotización, fecha de creación, estado (válida/expirada)
- **Validez**: Fecha hasta la cual es válida la cotización
- **Información del proyecto**: Perímetro, tipo de poste, material (si aplica)
- **Lista de materiales**: Productos con cantidades, precios unitarios y subtotales
- **Instalación**: Detalles del servicio de instalación (si fue incluido)
- **Totales**: Subtotal y total general
- **Acciones**: Botones para descargar PDF y enviar por WhatsApp

## Uso

### Buscar una Cotización

```javascript
// Método 1: Usar la función global
searchQuotation();

// Método 2: Usar directamente QuotationStorage
const storage = new QuotationStorage();
storage.displayQuotation('COT-1234567890-123', 'quotationDisplayContainer');
```

### Cargar Cotizaciones Recientes

```javascript
// Se carga automáticamente al cargar la página
loadRecentQuotations();
```

### Descargar PDF de una Cotización Guardada

```javascript
quotationStorage.downloadQuotationPDF('COT-1234567890-123');
```

### Enviar Cotización por WhatsApp

```javascript
quotationStorage.sendQuotationWhatsApp('COT-1234567890-123');
```

## Estructura HTML Generada

```html
<div class="quotation-display-card valid">
    <div class="quotation-header">
        <!-- ID y estado -->
    </div>
    
    <div class="quotation-validity">
        <!-- Fecha de validez -->
    </div>
    
    <div class="quotation-project-info">
        <!-- Información del proyecto -->
    </div>
    
    <div class="quotation-items-section">
        <!-- Lista de materiales -->
    </div>
    
    <div class="quotation-installation-section">
        <!-- Servicio de instalación -->
    </div>
    
    <div class="quotation-totals">
        <!-- Totales -->
    </div>
    
    <div class="quotation-actions">
        <!-- Botones de acción -->
    </div>
</div>
```

## Clases CSS Principales

### Contenedor Principal
- `.quotation-display-card`: Contenedor principal de la cotización
- `.quotation-display-card.valid`: Cotización válida (borde verde)
- `.quotation-display-card.expired`: Cotización expirada (borde rojo)

### Encabezado
- `.quotation-header`: Encabezado con ID y estado
- `.quotation-id`: ID de la cotización
- `.quotation-status`: Badge de estado (válida/expirada)

### Contenido
- `.quotation-project-info`: Información del proyecto
- `.quotation-items-section`: Sección de materiales
- `.quotation-item`: Item individual de material
- `.quotation-installation-section`: Sección de instalación
- `.quotation-totals`: Sección de totales

### Acciones
- `.quotation-actions`: Contenedor de botones
- `.btn-outline`: Botón de descargar PDF
- `.btn-success`: Botón de WhatsApp

## Soporte de Temas

El diseño respeta automáticamente el tema activo (claro/oscuro) usando las variables CSS:

**Modo Claro:**
- Fondo: `var(--bg-card)` (#ffffff)
- Texto: `var(--text-primary)` (#1a1a1a)
- Bordes: `var(--border)` (#c8e6c9)
- Primario: `var(--primary)` (#2d7a3e)

**Modo Oscuro:**
- Fondo: `var(--bg-card)` (#1a2e1a)
- Texto: `var(--text-primary)` (#e8f5e9)
- Bordes: `var(--border)` (#2d4a2d)
- Primario: `var(--primary)` (#4caf50)

## Accesibilidad

- Navegación por teclado completa
- Focus visible en todos los elementos interactivos
- ARIA labels apropiados
- Contraste WCAG AA cumplido en ambos temas
- Soporte para lectores de pantalla

## Responsive Design

### Mobile (< 768px)
- Layout de una columna
- Botones apilados verticalmente
- Texto y espaciado optimizados

### Tablet (768px - 1199px)
- Layout adaptado con mejor uso del espacio
- Grids de 2 columnas donde sea apropiado

### Desktop (≥ 1200px)
- Layout completo con máximo aprovechamiento del espacio
- Grids de múltiples columnas

## Integración con Sistema Existente

La funcionalidad se integra perfectamente con:

- **CONFIG**: Usa la configuración global para precios, moneda, etc.
- **PriceManager**: Formatea precios según configuración
- **QuotationPDFGenerator**: Genera PDFs de cotizaciones guardadas
- **showNotification()**: Muestra notificaciones al usuario
- **Tema claro/oscuro**: Respeta el tema activo automáticamente

## Ejemplos de Uso

### Ejemplo 1: Mostrar Cotización al Cargar Página

```javascript
// En script.js o al final de index.html
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quotationId = urlParams.get('quotation');
    
    if (quotationId) {
        quotationStorage.displayQuotation(quotationId, 'quotationDisplayContainer');
        
        // Scroll a la sección
        document.getElementById('consulta-cotizacion').scrollIntoView({
            behavior: 'smooth'
        });
    }
});
```

### Ejemplo 2: Compartir Link de Cotización

```javascript
function shareQuotationLink(quotationId) {
    const url = `${window.location.origin}${window.location.pathname}?quotation=${quotationId}#consulta-cotizacion`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Mi Cotización',
            text: `Cotización ${quotationId}`,
            url: url
        });
    } else {
        // Copiar al portapapeles
        navigator.clipboard.writeText(url);
        showNotification('Link copiado al portapapeles', 'success');
    }
}
```

### Ejemplo 3: Filtrar Cotizaciones por Estado

```javascript
function showValidQuotations() {
    const validQuotations = quotationStorage.getValid();
    const container = document.getElementById('recentQuotationsList');
    
    // Renderizar solo cotizaciones válidas
    // ... código de renderizado
}

function showExpiredQuotations() {
    const expiredQuotations = quotationStorage.getExpired();
    const container = document.getElementById('recentQuotationsList');
    
    // Renderizar solo cotizaciones expiradas
    // ... código de renderizado
}
```

## Mantenimiento

### Limpiar Cotizaciones Expiradas

```javascript
// Ejecutar periódicamente (ej: al cargar la página)
quotationStorage.deleteExpired();
```

### Obtener Información de Almacenamiento

```javascript
const info = quotationStorage.getStorageInfo();
console.log(`Total: ${info.total}`);
console.log(`Válidas: ${info.valid}`);
console.log(`Expiradas: ${info.expired}`);
console.log(`Tamaño: ${info.storageSize} bytes`);
```

## Notas Importantes

1. **LocalStorage**: Las cotizaciones se guardan en `localStorage` con la clave `ferreteria_quotations`
2. **Validez**: Por defecto, las cotizaciones son válidas por 30 días (configurable en `CONFIG.quotation.validityDays`)
3. **Precios**: Los precios guardados en la cotización se mantienen fijos, no se actualizan si cambian los precios en el sistema
4. **Límites**: LocalStorage tiene un límite de ~5-10MB dependiendo del navegador

## Requerimientos Cumplidos

✅ **2.11**: Mostrar cotización con diseño del sitio  
✅ **7.2**: Usar clases CSS existentes (cards, buttons)  
✅ **7.10**: Respetar tema claro/oscuro  
✅ Mostrar fecha de validez con indicador visual  
✅ Diseño responsive y accesible  
✅ Integración completa con sistema existente
