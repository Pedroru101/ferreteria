# Quick Start - Testing de Performance

## 🚀 Inicio Rápido

### Opción 1: Testing Visual en Navegador (Recomendado)

```
1. Abre: ferreteria/test-performance.html
2. Haz clic en "▶ Ejecutar Todas las Pruebas"
3. Espera 5-10 segundos
4. Revisa los resultados en las tarjetas
5. Consulta la consola para detalles
```

**Ventajas:**
- ✅ No requiere instalación
- ✅ Interfaz visual clara
- ✅ Resultados inmediatos
- ✅ Funciona en cualquier navegador

---

### Opción 2: Lighthouse en Chrome DevTools

```
1. Abre el sitio en Chrome
2. Presiona F12 (DevTools)
3. Ve a "Lighthouse"
4. Selecciona "Performance"
5. Haz clic en "Analyze page load"
6. Espera 30-60 segundos
7. Revisa el reporte
```

**Métricas Principales:**
- Performance Score: 0-100
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

---

### Opción 3: Lighthouse CLI (Avanzado)

```bash
# Instalar
npm install -g lighthouse

# Ejecutar
lighthouse https://www.metalesmdp.com.ar --view

# Con opciones
lighthouse https://www.metalesmdp.com.ar \
  --output=json \
  --output-path=./report.json
```

---

## 📊 Interpretación de Resultados

### Tiempo de Carga

| Resultado | Estado | Acción |
|-----------|--------|--------|
| < 2000ms | ✅ Excelente | Mantener |
| 2000-3000ms | ✅ Bueno | Monitorear |
| 3000-4000ms | ⚠️ Aceptable | Optimizar |
| > 4000ms | ❌ Pobre | Optimizar urgente |

### Tamaño localStorage

| Resultado | Estado | Acción |
|-----------|--------|--------|
| < 1MB | ✅ Excelente | Mantener |
| 1-3MB | ✅ Bueno | Monitorear |
| 3-5MB | ⚠️ Aceptable | Limpiar datos |
| > 5MB | ❌ Pobre | Limpiar urgente |

### Uso de Memoria

| Resultado | Estado | Acción |
|-----------|--------|--------|
| < 50% | ✅ Excelente | Mantener |
| 50-70% | ✅ Bueno | Monitorear |
| 70-80% | ⚠️ Aceptable | Optimizar |
| > 80% | ❌ Pobre | Optimizar urgente |

---

## 🔧 Optimizaciones Rápidas

### Si el tiempo de carga es lento:

```javascript
// 1. Lazy load de imágenes
<img src="image.jpg" loading="lazy" alt="Descripción">

// 2. Diferir JavaScript no crítico
<script defer src="non-critical.js"></script>

// 3. Preload de recursos críticos
<link rel="preload" href="critical.css" as="style">
```

### Si localStorage es muy grande:

```javascript
// 1. Limpiar datos antiguos
function cleanup() {
    const quotations = JSON.parse(localStorage.getItem('ferreteria_quotations') || '[]');
    const now = new Date();
    const active = quotations.filter(q => new Date(q.validUntil) > now);
    localStorage.setItem('ferreteria_quotations', JSON.stringify(active));
}

// 2. Ejecutar limpieza periódicamente
setInterval(cleanup, 24 * 60 * 60 * 1000); // Cada 24 horas
```

### Si hay memory leaks:

```javascript
// 1. Remover event listeners
element.removeEventListener('click', handler);

// 2. Cancelar timers
clearInterval(intervalId);
clearTimeout(timeoutId);

// 3. Limpiar referencias
object = null;
```

---

## 📈 Monitoreo Continuo

### Crear un Dashboard de Performance

```html
<!-- Agregar a index.html -->
<div id="performance-monitor" style="position: fixed; bottom: 10px; right: 10px; 
     background: rgba(0,0,0,0.8); color: #4caf50; padding: 10px; 
     border-radius: 5px; font-size: 12px; z-index: 9999;">
    <div>Load: <span id="load-time">--</span>ms</div>
    <div>Memory: <span id="memory-usage">--</span>MB</div>
    <div>Storage: <span id="storage-size">--</span>MB</div>
</div>

<script>
function updatePerformanceMonitor() {
    // Tiempo de carga
    const perf = performance.getEntriesByType('navigation')[0];
    if (perf) {
        const loadTime = perf.loadEventEnd - perf.fetchStart;
        document.getElementById('load-time').textContent = loadTime.toFixed(0);
    }
    
    // Memoria
    if (performance.memory) {
        const memMB = (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(1);
        document.getElementById('memory-usage').textContent = memMB;
    }
    
    // Storage
    let storageSize = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            storageSize += localStorage.getItem(key).length;
        }
    }
    const storageMB = (storageSize / (1024 * 1024)).toFixed(2);
    document.getElementById('storage-size').textContent = storageMB;
}

// Actualizar cada 5 segundos
setInterval(updatePerformanceMonitor, 5000);
updatePerformanceMonitor();
</script>
```

---

## ✅ Checklist de Validación

- [ ] Tiempo de carga < 3 segundos
- [ ] localStorage < 5MB
- [ ] Sin memory leaks detectables
- [ ] Imágenes optimizadas (lazy loading)
- [ ] CSS y JS minificados
- [ ] Lighthouse score > 80
- [ ] LCP < 2.5 segundos
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Funciona en mobile, tablet, desktop

---

## 🐛 Troubleshooting

### "Performance.memory no disponible"
```
Solución: Ejecutar Chrome con flag:
chrome --enable-precise-memory-info
```

### "Lighthouse no se instala"
```
Solución: Usar versión global
npm install -g @lhci/cli@latest
```

### "localStorage muestra 0MB"
```
Solución: Verificar que hay datos guardados
console.log(localStorage);
```

---

## 📚 Recursos Adicionales

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Docs](https://developers.google.com/web/tools/lighthouse)
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

---

**Última actualización:** 2024
**Versión:** 1.0
