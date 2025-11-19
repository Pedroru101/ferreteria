# Guía de Integración de Accesibilidad

## Descripción General

Este documento explica cómo la accesibilidad se integra con los módulos existentes del sistema de alambrados.

## Integración con Módulos Existentes

### 1. Calculadora (calculator.js, calculator-ui.js)

#### Mejoras Implementadas
- Todos los inputs tienen `aria-label` descriptivos
- Los selects tienen etiquetas asociadas
- Los botones tienen `aria-label` para acciones
- El orden de tabulación es lógico (de arriba a abajo)
- Los resultados se anuncian a lectores de pantalla

#### Ejemplo de Uso
```javascript
// En calculator-ui.js
const lengthInput = document.getElementById('calculatorLength');
lengthInput.setAttribute('aria-label', 'Largo del terreno en metros');
lengthInput.setAttribute('aria-required', 'true');

// Anunciar resultados
accessibilityManager.announceToScreenReader(
    `Cálculo completado: ${materials.posts.total} postes necesarios`
);
```

### 2. Sistema de Cotizaciones (quotation.js, quotation-modal.js)

#### Mejoras Implementadas
- Modal tiene `role="dialog"` y `aria-modal="true"`
- Botón de cerrar tiene `aria-label="Cerrar"`
- Tabla de productos tiene estructura semántica
- Los totales se anuncian dinámicamente
- Focus trap en el modal

#### Ejemplo de Uso
```javascript
// En quotation-modal.js
const modal = document.getElementById('quotationModal');
accessibilityManager.enhanceModalAccessibility(modal);

// Anunciar cambios de total
accessibilityManager.announceToScreenReader(
    `Total actualizado: $${quotation.total}`
);
```

### 3. Catálogo (catalog.js)

#### Mejoras Implementadas
- Botones "Agregar a Cotización" tienen aria-label
- Modal de producto tiene estructura accesible
- Imágenes tienen alt text
- Especificaciones técnicas están bien estructuradas

#### Ejemplo de Uso
```javascript
// En catalog.js
const addBtn = document.querySelector('.add-to-quote');
addBtn.setAttribute('aria-label', `Agregar ${product.name} a cotización`);

// Anunciar adición al carrito
accessibilityManager.announceToScreenReader(
    `${product.name} agregado al carrito`
);
```

### 4. Sistema de Pedidos (orders.js, order-tracking.js)

#### Mejoras Implementadas
- Formulario de pedido tiene validación accesible
- Estados de pedido se anuncian
- Tabla de pedidos tiene estructura semántica
- Botones de acción tienen aria-label

#### Ejemplo de Uso
```javascript
// En orders.js
const form = document.querySelector('.order-form');
accessibilityManager.enhanceFormAccessibility();

// Anunciar estado
accessibilityManager.announceToScreenReader(
    `Pedido ${order.id} actualizado a ${order.status}`,
    true // isAlert
);
```

### 5. Comparador (comparator.js)

#### Mejoras Implementadas
- Tabla comparativa tiene estructura semántica
- Sliders tienen aria-label
- Checkboxes tienen etiquetas asociadas
- Recomendaciones se anuncian

#### Ejemplo de Uso
```javascript
// En comparator.js
const table = document.querySelector('.comparison-table');
accessibilityManager.enhanceTableAccessibility(table);

// Anunciar recomendación
accessibilityManager.announceToScreenReader(
    'Quebracho recomendado para alta exigencia'
);
```

### 6. Panel de Administración (admin.js)

#### Mejoras Implementadas
- Formularios de login tienen validación accesible
- Tablas de datos tienen estructura semántica
- Botones de acción tienen aria-label
- Filtros tienen etiquetas descriptivas

#### Ejemplo de Uso
```javascript
// En admin.js
const loginForm = document.querySelector('.admin-login-form');
accessibilityManager.enhanceFormAccessibility();

// Anunciar login exitoso
accessibilityManager.announceToScreenReader(
    'Sesión iniciada exitosamente'
);
```

## Patrones de Implementación

### Patrón 1: Etiquetas para Botones con Iconos

```javascript
// Antes (no accesible)
<button class="btn-primary">
    <i class="fas fa-download"></i>
</button>

// Después (accesible)
<button class="btn-primary" aria-label="Descargar PDF">
    <i class="fas fa-download"></i>
</button>

// O automáticamente
const button = document.querySelector('.btn-primary');
accessibilityManager.enhanceButtonAccessibility(button);
```

### Patrón 2: Anuncios a Lectores de Pantalla

```javascript
// Para notificaciones normales
accessibilityManager.announceToScreenReader(
    'Cotización guardada exitosamente'
);

// Para alertas urgentes
accessibilityManager.announceToScreenReader(
    'Error: Campo requerido',
    true // isAlert
);
```

### Patrón 3: Validación de Formularios

```javascript
// Antes (no accesible)
input.addEventListener('invalid', (e) => {
    e.preventDefault();
    showNotification('Campo inválido', 'error');
});

// Después (accesible)
input.addEventListener('invalid', (e) => {
    e.preventDefault();
    input.setAttribute('aria-invalid', 'true');
    accessibilityManager.announceToScreenReader(
        input.validationMessage,
        true
    );
});
```

### Patrón 4: Modales Accesibles

```javascript
// Crear modal
const modal = document.createElement('div');
modal.classList.add('modal');
modal.setAttribute('role', 'dialog');
modal.setAttribute('aria-modal', 'true');

// Mejorar accesibilidad
accessibilityManager.enhanceModalAccessibility(modal);

// Abrir modal
modal.classList.add('active');
```

### Patrón 5: Tablas Accesibles

```javascript
// Mejorar tabla existente
const table = document.querySelector('table');
accessibilityManager.enhanceTableAccessibility(table);

// Resultado: headers tienen scope="col", rows tienen role="row"
```

## Checklist de Implementación

### Para Nuevas Funcionalidades

- [ ] Todos los inputs tienen `aria-label` o etiqueta `<label>`
- [ ] Todos los botones tienen `aria-label` o texto visible
- [ ] Los modales tienen `role="dialog"` y `aria-modal="true"`
- [ ] Las tablas tienen estructura semántica (th, scope)
- [ ] El contraste cumple WCAG AA (4.5:1)
- [ ] Los elementos interactivos tienen 44x44px mínimo
- [ ] El orden de tabulación es lógico
- [ ] Las imágenes tienen `alt` text
- [ ] Los formularios tienen validación accesible
- [ ] Los cambios dinámicos se anuncian

### Para Modales

- [ ] Modal tiene `role="dialog"`
- [ ] Modal tiene `aria-modal="true"`
- [ ] Modal tiene `aria-labelledby` apuntando al título
- [ ] Botón de cerrar tiene `aria-label="Cerrar"`
- [ ] Focus trap está implementado
- [ ] Overlay tiene `aria-hidden="true"`

### Para Formularios

- [ ] Todos los inputs tienen etiqueta asociada
- [ ] Campos requeridos tienen `aria-required="true"`
- [ ] Validación usa `aria-invalid`
- [ ] Mensajes de error se anuncian
- [ ] Tamaño mínimo de toque es 44x44px

### Para Tablas

- [ ] Headers tienen `scope="col"`
- [ ] Filas tienen `role="row"`
- [ ] Primera celda de fila tiene `scope="row"`
- [ ] Tabla tiene título o descripción
- [ ] Datos complejos tienen explicación

## Pruebas de Integración

### Prueba Manual

1. **Navegación por Teclado**
   - Abre la página
   - Presiona Tab para navegar
   - Verifica que el orden sea lógico
   - Prueba Escape en modales

2. **Lector de Pantalla**
   - Usa NVDA, JAWS o VoiceOver
   - Navega por la página
   - Verifica que todos los elementos sean anunciados
   - Prueba formularios y modales

3. **Contraste**
   - Usa axe DevTools o WAVE
   - Verifica ratios de contraste
   - Prueba en modo oscuro
   - Verifica con herramienta de contraste

4. **Tamaño de Toque**
   - Abre DevTools
   - Inspecciona elementos interactivos
   - Verifica que sean 44x44px mínimo
   - Prueba en dispositivo móvil

### Prueba Automática

```javascript
// En la consola del navegador
accessibilityManager.validateAccessibility();

// Resultado: Array de problemas encontrados
```

## Integración con Herramientas Externas

### axe DevTools
1. Instala la extensión
2. Abre DevTools
3. Ve a la pestaña "axe DevTools"
4. Haz clic en "Scan ALL of my page"
5. Revisa los resultados

### WAVE
1. Ve a https://wave.webaim.org/
2. Ingresa la URL del sitio
3. Revisa los errores y advertencias
4. Verifica que no haya errores críticos

### Lighthouse
1. Abre DevTools
2. Ve a la pestaña "Lighthouse"
3. Selecciona "Accessibility"
4. Haz clic en "Analyze page load"
5. Revisa la puntuación

## Mantenimiento Continuo

### Checklist Mensual
- [ ] Ejecutar validación automática
- [ ] Probar con lector de pantalla
- [ ] Verificar contraste en ambos modos
- [ ] Probar navegación por teclado
- [ ] Revisar nuevas funcionalidades

### Checklist Trimestral
- [ ] Ejecutar auditoría completa con axe
- [ ] Probar en múltiples navegadores
- [ ] Probar en dispositivos móviles
- [ ] Revisar WCAG 2.1 AA compliance
- [ ] Actualizar documentación

## Recursos de Referencia

### Documentación
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Herramientas
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### Comunidades
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)
- [Inclusive Components](https://inclusive-components.design/)

## Soporte y Contacto

Para preguntas o problemas de accesibilidad:
1. Revisa la documentación en ACCESSIBILITY_README.md
2. Ejecuta `accessibilityManager.validateAccessibility()`
3. Abre un issue con detalles específicos
4. Incluye pasos para reproducir el problema
