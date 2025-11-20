# Testing de Performance - Sistema Integral de Alambrados

## Descripción General

Este documento describe cómo ejecutar pruebas de performance para validar que el sistema cumple con los objetivos de rendimiento especificados en los requisitos 7.8 y 9.11.

**Objetivos de Performance:**
- ⏱️ Tiempo de carga inicial: < 3 segundos
- 💾 Tamaño de localStorage: < 5MB
- 🧠 Sin memory leaks detectables
- 📦 Assets optimizados
- 🎯 Lighthouse score: > 80

---

## Métodos de Testing

### 1. Testing en Navegador (test-performance.html)

#### Acceso
```
Abre en tu navegador: ferreteria/test-performance.html
```

#### Características
- ✅ Interfaz visual interactiva
- ✅ Pruebas individuales o completas
- ✅ Consola en tiempo real
- ✅ Análisis de assets
- ✅ Detección de memory leaks
- ✅ Reporte visual

#### Pruebas Disponibles

**1. Ejecutar Todas las Pruebas**
```
Botón: "▶ Ejecutar Todas las Pruebas"
Mide: Tiempo de carga, localStorage, memoria, assets
Duración: ~5-10 segundos
```

**2. Tiempo de Carga**
```
Botón: "⏱️ Tiempo de Carga"
Mide: 
  - Tiempo total de carga
  - DNS lookup
  - TCP connection
  - TTFB (Time to First Byte)
  - DOM Interactive
  - DOM Complete
Objetivo: < 3000ms
```

**3. Tamaño de localStorage**
```
Botón: "💾 Tamaño localStorage"
Mide:
  - Tamaño total en bytes, KB, MB
  - Desglose por clave
  - Cantidad de items por clave
Objetivo: < 5MB
```

**4. Uso de Memoria**
```
Botón: "🧠 Uso de Memoria"
Mide:
  - Heap usado
  - Heap total
  - Límite de heap
  - Porcentaje utilizado
  - Detección de memory leaks
Objetivo: < 80% del límite
```

**5. Análisis de Assets**
```
Botón: "📦 Análisis de Assets"
Mide:
  - Cantidad de archivos por tipo
  - Tamaño total transferido
  - Desglose: JS, CSS, Fonts, Images, CDN
  - Optimización de imágenes
```

#### Interpretación de Resultados

**Estado de Pruebas:**
- ✓ Verde: Prueba pasada (cumple objetivo)
- ✗ Rojo: Prueba fallida (no cumple objetivo)
- ⚠ Naranja: Advertencia (cerca del límite)

**Ejemplo de Salida:**
```
✓ Tiempo de carga: 2450.32ms (Objetivo: 3000ms)
  - DNS: 45.12ms
  - TCP: 120.45ms
  - TTFB: 380.23ms
  - Download: 1200.45ms
  - DOM Interactive: 1800.12ms
  - DOM Complete: 2450.32ms

✓ Tamaño localStorage: 2.45MB (Objetivo: 5MB)
  Desglose por clave:
    - ferreteria_quotations: 1.20KB (5 items)
    - ferreteria_orders: 0.85KB (3 items)
    - ferreteria_config: 0.40KB (1 item)

✓ Uso de memoria: 125.45MB / 2048MB (6.13%)
```

---

### 2. Testing con Lighthouse (Chrome DevTools)

#### Acceso
```
1. Abre el sitio en Chrome
2. Presiona F12 (DevTools)
3. Ve a la pestaña "Lighthouse"
4. Selecciona "Performance"
5. Haz clic en "Analyze page load"
```

#### Métricas Clave

**Performance Score (0-100)**
- 90-100: Excelente
- 50-89: Promedio
- 0-49: Pobre

**Core Web Vitals**
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

**Otras Métricas**
- **FCP (First Contentful Paint)**: < 1.8s
- **TTFB (Time to First Byte)**: < 600ms
- **Speed Index**: < 3.4s

#### Recomendaciones de Lighthouse

Lighthouse proporciona sugerencias específicas:
- Eliminar CSS no utilizado
- Diferir JavaScript no crítico
- Optimizar imágenes
- Minificar recursos
- Usar caché del navegador

---

### 3. Testing Automatizado (Node.js)

#### Instalación de Herramientas

```bash
# Instalar Lighthouse CLI
npm install -g lighthouse

# Instalar Puppeteer (para automatización)
npm install puppeteer
```

#### Ejecutar Lighthouse desde CLI

```bash
# Análisis básico
lighthouse https://www.metalesmdp.com.ar --view

# Análisis con opciones
lighthouse https://www.metalesmdp.com.ar \
  --output=json \
  --output-path=./lighthouse-report.json \
  --chrome-flags="--headless"

# Análisis de performance específicamente
lighthouse https://www.metalesmdp.com.ar \
  --only-categories=performance \
  --view
```

#### Script de Automatización (Node.js)

```javascript
// test-performance-automated.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouse(url) {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    
    const options = {
        logLevel: 'info',
        output: 'json',
        port: chrome.port
    };
    
    const runnerResult = await lighthouse(url, options);
    
    console.log('Performance Score:', runnerResult.lhr.categories.performance.score * 100);
    console.log('Accessibility Score:', runnerResult.lhr.categories.accessibility.score * 100);
    console.log('Best Practices Score:', runnerResult.lhr.categories['best-practices'].score * 100);
    console.log('SEO Score:', runnerResult.lhr.categories.seo.score * 100);
    
    await chromeLauncher.kill(chrome.pid);
}

runLighthouse('https://www.metalesmdp.com.ar');
```

---

### 4. Testing Manual de Performance

#### Checklist de Verificación

**Tiempo de Carga**
- [ ] Página carga en menos de 3 segundos
- [ ] Contenido principal visible en < 1.8s
- [ ] Interactivo en < 3s
- [ ] Sin bloqueos de JavaScript

**localStorage**
- [ ] Tamaño total < 5MB
- [ ] Datos se guardan correctamente
- [ ] Recuperación de datos funciona
- [ ] Limpieza automática de datos antiguos

**Memoria**
- [ ] No hay memory leaks visibles
- [ ] Uso de memoria estable durante navegación
- [ ] Interacciones no aumentan memoria indefinidamente
- [ ] Garbage collection funciona correctamente

**Assets**
- [ ] Imágenes optimizadas (lazy loading)
- [ ] CSS minificado
- [ ] JavaScript minificado
- [ ] Fuentes cargadas eficientemente

**Responsive**
- [ ] Mobile (320px): < 4s
- [ ] Tablet (768px): < 3.5s
- [ ] Desktop (1200px): < 3s

---

## Optimizaciones Implementadas

### 1. Carga de Recursos

**Preload de Recursos Críticos**
```html
<link rel="preload" href="fonts.css" as="style">
<link rel="preload" href="critical.js" as="script">
```

**DNS Prefetch**
```html
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
```

**Lazy Loading de Módulos**
```javascript
// Cargar jsPDF solo cuando se necesita
if (needsPDF) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.min.js';
    document.head.appendChild(script);
}
```

### 2. Optimización de localStorage

**Limpieza Automática**
```javascript
// Limpiar cotizaciones expiradas
function cleanupExpiredQuotations() {
    const quotations = JSON.parse(localStorage.getItem('ferreteria_quotations') || '[]');
    const now = new Date();
    
    const active = quotations.filter(q => new Date(q.validUntil) > now);
    localStorage.setItem('ferreteria_quotations', JSON.stringify(active));
}
```

**Compresión de Datos**
```javascript
// Usar JSON comprimido para datos grandes
function compressData(data) {
    return btoa(JSON.stringify(data)); // Base64 encoding
}
```

### 3. Optimización de Imágenes

**Lazy Loading**
```html
<img src="image.jpg" loading="lazy" alt="Descripción">
```

**Responsive Images**
```html
<img 
    srcset="image-small.jpg 320w, image-medium.jpg 768w, image-large.jpg 1200w"
    sizes="(max-width: 320px) 280px, (max-width: 768px) 720px, 1140px"
    src="image-large.jpg"
    alt="Descripción"
>
```

### 4. Minificación y Bundling

**CSS Minificado**
```bash
# Usar herramientas como cssnano
cssnano styles.css -o styles.min.css
```

**JavaScript Minificado**
```bash
# Usar herramientas como terser
terser script.js -o script.min.js
```

---

## Problemas Comunes y Soluciones

### Problema: Tiempo de carga > 3 segundos

**Causas Posibles:**
- Muchos assets sin optimizar
- Servidor lento
- Conexión de red lenta
- JavaScript bloqueante

**Soluciones:**
1. Usar lazy loading para imágenes
2. Minificar CSS y JavaScript
3. Usar CDN para assets estáticos
4. Diferir JavaScript no crítico
5. Comprimir imágenes

### Problema: localStorage > 5MB

**Causas Posibles:**
- Demasiadas cotizaciones guardadas
- Datos no comprimidos
- Datos antiguos no limpiados

**Soluciones:**
1. Implementar limpieza automática
2. Comprimir datos antes de guardar
3. Limitar cantidad de registros guardados
4. Usar IndexedDB para datos grandes

### Problema: Memory leaks detectados

**Causas Posibles:**
- Event listeners no removidos
- Referencias circulares
- Timers no cancelados

**Soluciones:**
1. Remover event listeners al destruir componentes
2. Usar WeakMap para referencias débiles
3. Cancelar timers y promises
4. Usar DevTools para profiling

---

## Reporte de Performance

### Formato de Reporte

```
REPORTE DE PERFORMANCE - SISTEMA INTEGRAL DE ALAMBRADOS
═══════════════════════════════════════════════════════

✅ RESULTADOS:
─────────────────────────────────────────────────────
✓ Tiempo de carga: 2450.32ms (Objetivo: 3000ms)
✓ Tamaño localStorage: 2.45MB (Objetivo: 5MB)
✓ Uso de memoria: 125.45MB / 2048MB (6.13%)
✓ Assets: 45 archivos (2.3MB)

⚠️ PROBLEMAS DETECTADOS:
─────────────────────────────────────────────────────
1. [WARNING] Imágenes sin lazy loading: 3 imágenes
2. [WARNING] CSS no minificado: 150KB

✓ No se detectaron memory leaks críticos

═══════════════════════════════════════════════════════
```

### Exportar Reporte

```javascript
// Guardar reporte en archivo
const results = await testSuite.runAll();
const json = JSON.stringify(results, null, 2);
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'performance-report.json';
a.click();
```

---

## Requisitos Cumplidos

### Requirement 7.8: Loaders y Spinners
- ✅ Spinner para carga de productos desde Google Sheets
- ✅ Loader para generación de PDF
- ✅ Preloader existente utilizado apropiadamente

### Requirement 9.11: Lazy Loading
- ✅ jsPDF cargado solo cuando se necesita generar PDF
- ✅ Módulos cargados solo cuando usuario accede a sección
- ✅ IntersectionObserver para carga diferida de imágenes

---

## Próximos Pasos

1. **Ejecutar pruebas regularmente** durante desarrollo
2. **Monitorear performance** en producción
3. **Optimizar según resultados** de Lighthouse
4. **Mantener benchmarks** de performance
5. **Documentar cambios** que afecten performance

---

## Referencias

- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Web Vitals](https://web.dev/vitals/)
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)

---

**Última actualización:** 2024
**Versión:** 1.0
**Requisitos:** 7.8, 9.11
