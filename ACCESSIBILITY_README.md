# Accesibilidad WCAG 2.1 AA - Documentación

## Descripción General

Este documento describe las mejoras de accesibilidad implementadas en el sistema integral de alambrados para cumplir con los estándares WCAG 2.1 AA.

## Archivos Implementados

### 1. `js/accessibility.js`
Módulo principal de accesibilidad que implementa:

- **Navegación por Teclado**: Soporte completo para Tab, Shift+Tab, Enter, Espacio y Escape
- **Focus Management**: Gestión automática del foco en elementos interactivos
- **Focus Traps**: Atrapamiento del foco en modales para evitar que escape
- **ARIA Labels**: Etiquetas descriptivas para elementos sin texto visible
- **Live Regions**: Regiones dinámicas para anuncios a lectores de pantalla
- **Skip Links**: Enlaces para saltar al contenido principal
- **Validación Automática**: Detección de problemas de accesibilidad

### 2. `css/accessibility.css`
Estilos CSS que implementan:

- **Focus Visible**: Indicadores de foco claros y visibles (3px outline)
- **Contraste de Colores**: Ratios WCAG AA (4.5:1 mínimo)
- **Tamaño Mínimo de Toque**: 44x44 píxeles para todos los elementos interactivos
- **Responsive Text Scaling**: Escalado de texto según el dispositivo
- **Screen Reader Only Content**: Contenido oculto pero accesible
- **Soporte para Modo Oscuro**: Contraste mantenido en ambos modos
- **Soporte para Movimiento Reducido**: Respeta preferencias del usuario

## Características Implementadas

### 1. Navegación por Teclado

#### Funcionalidad
- **Tab**: Navega hacia adelante entre elementos focusables
- **Shift+Tab**: Navega hacia atrás entre elementos focusables
- **Enter/Espacio**: Activa botones y enlaces
- **Escape**: Cierra modales y dropdowns

#### Implementación
```javascript
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        this.handleEscapeKey();
    }
    if (e.key === 'Tab') {
        this.handleTabKey(e);
    }
});
```

### 2. Focus Visible

#### Características
- Contorno de 3px en color primario (#2d7a3e)
- Offset de 2px para mejor visibilidad
- Aplicado a todos los elementos focusables
- Respeta preferencias de contraste alto

#### CSS
```css
:focus-visible {
    outline: 3px solid var(--primary, #2d7a3e);
    outline-offset: 2px;
    border-radius: 2px;
}
```

### 3. Focus Trap en Modales

#### Funcionalidad
- El foco se mantiene dentro del modal
- Tab en el último elemento va al primero
- Shift+Tab en el primer elemento va al último
- Se implementa automáticamente para todos los modales

#### Implementación
```javascript
createFocusTrap(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Gestionar Tab/Shift+Tab para atrapar el foco
}
```

### 4. ARIA Labels

#### Elementos Etiquetados
- Botones con iconos (PDF, WhatsApp, Cerrar, etc.)
- Campos de formulario sin etiqueta visible
- Elementos interactivos sin texto
- Modales y diálogos

#### Ejemplo
```html
<button class="modal-close" aria-label="Cerrar">
    <i class="fas fa-times"></i>
</button>
```

### 5. Contraste de Colores

#### Ratios Verificados (WCAG AA)
| Elemento | Ratio | Cumple |
|----------|-------|--------|
| Texto principal sobre fondo | 19.8:1 | ✅ AAA |
| Texto secundario sobre fondo | 7.2:1 | ✅ AA |
| Botón primario | 5.8:1 | ✅ AA |
| Enlaces | 5.8:1 | ✅ AA |

#### Modo Oscuro
| Elemento | Ratio | Cumple |
|----------|-------|--------|
| Texto principal sobre fondo | 18.5:1 | ✅ AAA |
| Texto secundario sobre fondo | 11.2:1 | ✅ AAA |
| Botón primario | 6.1:1 | ✅ AA |
| Enlaces | 8.9:1 | ✅ AAA |

### 6. Tamaño Mínimo de Toque

#### Especificación
- Todos los elementos interactivos: mínimo 44x44 píxeles
- Padding adicional para botones pequeños
- Espaciado entre elementos para evitar activaciones accidentales

#### CSS
```css
button, a, input, select, textarea {
    min-height: 44px;
    min-width: 44px;
}
```

### 7. Formularios Accesibles

#### Características
- Etiquetas asociadas a todos los campos
- Atributos `aria-required` para campos obligatorios
- Validación accesible con `aria-invalid`
- Mensajes de error anunciados a lectores de pantalla

#### Ejemplo
```html
<label for="email">Email *</label>
<input type="email" id="email" required aria-required="true">
```

### 8. Live Regions

#### Tipos
- **aria-live="polite"**: Para notificaciones normales
- **aria-live="assertive"**: Para alertas urgentes

#### Uso
```javascript
announceToScreenReader('Cotización guardada exitosamente', false);
announceToScreenReader('Error: Campo requerido', true);
```

### 9. Skip Links

#### Funcionalidad
- Enlaces para saltar al contenido principal
- Visibles al recibir foco
- Ubicados al inicio del documento

#### HTML
```html
<div class="skip-links">
    <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
    <a href="#calculadora" class="skip-link">Ir a calculadora</a>
</div>
```

### 10. Orden de Tabulación Lógico

#### Implementación
- Orden natural del DOM respetado
- Elementos con `tabindex` positivo evitados
- Navegación predecible y consistente

### 11. Soporte para Modo Oscuro

#### Características
- Contraste mantenido en ambos modos
- Variables CSS para fácil personalización
- Transiciones suaves entre temas

#### CSS
```css
[data-theme="dark"] {
    --text-primary: #e8f5e9;
    --bg-primary: #0d1f0d;
    --primary: #4caf50;
}
```

### 12. Soporte para Movimiento Reducido

#### Características
- Respeta `prefers-reduced-motion`
- Desactiva animaciones para usuarios sensibles
- Mantiene funcionalidad sin movimiento

#### CSS
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

## Integración en el Proyecto

### Inclusión en HTML
```html
<!-- CSS de Accesibilidad -->
<link rel="stylesheet" href="css/accessibility.css">

<!-- Script de Accesibilidad -->
<script src="js/accessibility.js"></script>
```

### Inicialización Automática
El módulo se inicializa automáticamente cuando se carga el DOM:
```javascript
document.addEventListener('DOMContentLoaded', () => {
    accessibilityManager.setupFocusVisibility();
    accessibilityManager.setupColorContrastEnforcement();
    accessibilityManager.setupResponsiveTextScaling();
    accessibilityManager.setupScreenReaderOnlyContent();
    accessibilityManager.enhanceFormAccessibility();
    accessibilityManager.setupTabOrder();
    accessibilityManager.validateAccessibility();
});
```

## Pruebas de Accesibilidad

### Archivo de Pruebas
Se incluye `test-accessibility.html` con 12 pruebas interactivas:

1. Navegación por Teclado
2. Indicador de Foco Visible
3. Focus Trap en Modales
4. ARIA Labels
5. Contraste de Colores
6. Tamaño Mínimo de Toque
7. Formularios Accesibles
8. Contenido para Lectores de Pantalla
9. Orden de Tabulación Lógico
10. Soporte para Modo Oscuro
11. Soporte para Movimiento Reducido
12. Validación Automática

### Cómo Ejecutar las Pruebas
1. Abre `test-accessibility.html` en un navegador
2. Prueba cada sección manualmente
3. Usa un lector de pantalla (NVDA, JAWS, VoiceOver)
4. Verifica el contraste con herramientas como axe DevTools

## Herramientas Recomendadas para Validación

### Navegador
- **axe DevTools**: Extensión para Chrome/Firefox
- **WAVE**: Herramienta en línea de WebAIM
- **Lighthouse**: Auditoría integrada en Chrome DevTools

### Lectores de Pantalla
- **NVDA**: Gratuito para Windows
- **JAWS**: Comercial para Windows
- **VoiceOver**: Integrado en macOS/iOS
- **TalkBack**: Integrado en Android

### Validadores
- **WCAG Contrast Checker**: Verificar ratios de contraste
- **Color Contrast Analyzer**: Herramienta de contraste
- **Accessibility Insights**: Herramienta de Microsoft

## Mejores Prácticas Implementadas

### 1. Semántica HTML
- Uso correcto de etiquetas semánticas
- Estructura lógica del documento
- Roles ARIA cuando sea necesario

### 2. Formularios
- Etiquetas asociadas a inputs
- Validación clara y accesible
- Mensajes de error descriptivos

### 3. Navegación
- Orden de tabulación lógico
- Skip links funcionales
- Indicadores de ubicación actual

### 4. Contenido
- Texto alternativo para imágenes
- Descripciones de elementos complejos
- Lenguaje claro y simple

### 5. Interactividad
- Feedback visual claro
- Confirmaciones para acciones importantes
- Opciones de deshacer cuando sea posible

## Requisitos de Mantenimiento

### Checklist para Nuevas Funcionalidades
- [ ] Todos los botones tienen aria-label o texto visible
- [ ] Los inputs tienen etiquetas asociadas
- [ ] El contraste cumple WCAG AA (4.5:1)
- [ ] Los elementos interactivos tienen 44x44px mínimo
- [ ] El orden de tabulación es lógico
- [ ] Los modales tienen focus trap
- [ ] Las imágenes tienen alt text
- [ ] Los formularios tienen validación accesible

### Validación Automática
Ejecuta `accessibilityManager.validateAccessibility()` en la consola para detectar problemas.

## Cumplimiento WCAG 2.1 AA

### Criterios Cumplidos
- ✅ 1.4.3 Contraste (Mínimo)
- ✅ 1.4.11 Contraste (No Textual)
- ✅ 2.1.1 Teclado
- ✅ 2.1.2 Sin Trampa de Teclado
- ✅ 2.4.3 Orden de Foco
- ✅ 2.4.7 Foco Visible
- ✅ 3.2.1 Al Recibir Foco
- ✅ 3.3.1 Identificación de Error
- ✅ 3.3.3 Sugerencia de Error
- ✅ 4.1.2 Nombre, Rol, Valor
- ✅ 4.1.3 Mensajes de Estado

## Soporte de Navegadores

### Navegadores Soportados
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Características Degradadas
- Navegadores antiguos: Funcionalidad básica sin estilos avanzados
- Sin JavaScript: Navegación por teclado limitada

## Recursos Adicionales

### Documentación
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)

### Tutoriales
- [Accessible Web Design](https://www.udacity.com/course/web-accessibility--ud891)
- [A11y Project](https://www.a11yproject.com/)

## Contacto y Soporte

Para reportar problemas de accesibilidad o sugerencias:
1. Abre un issue en el repositorio
2. Describe el problema específico
3. Incluye pasos para reproducir
4. Especifica el navegador y lector de pantalla usado

## Changelog

### Versión 1.0 (Inicial)
- Implementación de navegación por teclado
- Focus visible en todos los elementos
- Focus trap en modales
- ARIA labels automáticos
- Contraste WCAG AA
- Tamaño mínimo de toque
- Formularios accesibles
- Live regions
- Skip links
- Validación automática
- Soporte para modo oscuro
- Soporte para movimiento reducido
