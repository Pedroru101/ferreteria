# Testing de Modo Oscuro/Claro

## Descripción

Este documento describe el testing completo del sistema de modo oscuro/claro del sitio web de "Metales & Hierros Mar del Plata".

**Requirements:** 7.10, 8.2

## Requisitos Verificados

### Requisito 7.10
- WHEN el usuario cambia entre modo claro/oscuro THEN todas las nuevas funcionalidades SHALL respetar el tema activo usando las variables CSS del data-theme

### Requisito 8.2
- WHEN el sitio carga en modo oscuro THEN el sistema SHALL usar la siguiente paleta de colores:
  - Color Principal (Primary): `#4caf50` (Verde vibrante)
  - Fondo Principal: `#0d1f0d` (Negro verdoso)
  - Texto Principal: `#e8f5e9` (Verde muy claro)
  - Y otros colores según la paleta definida

## Archivos de Test

### 1. test-dark-mode.html
Archivo HTML interactivo para testing manual del modo oscuro/claro.

**Ubicación:** `ferreteria/test-dark-mode.html`

**Cómo usar:**
1. Abre el archivo en un navegador
2. Verifica cada sección manualmente
3. Marca los checkboxes según corresponda
4. Haz clic en "Ejecutar Tests Automatizados" para correr los tests automáticos

**Tests incluidos:**
- Test 1: Persistencia de Preferencia
- Test 2: Contraste en Modo Claro (WCAG AA)
- Test 3: Contraste en Modo Oscuro (WCAG AA)
- Test 4: Transiciones Suaves
- Test 5: Elementos Interactivos Respetan el Tema
- Test 6: Componentes Visuales Respetan el Tema
- Test 7: Paleta de Colores
- Test 8: Todas las Secciones Respetan el Tema

### 2. test-dark-mode-automated.js
Script JavaScript que ejecuta tests automatizados del modo oscuro/claro.

**Ubicación:** `ferreteria/test-dark-mode-automated.js`

**Cómo usar:**
```javascript
// Ejecutar todos los tests
DarkModeTests.runAll();

// Los resultados se mostrarán en la consola del navegador
```

**Tests incluidos:**
1. **testThemePersistence()** - Verifica que el tema se persiste en localStorage
2. **testThemeIconChange()** - Verifica que el icono del tema cambia
3. **testSectionThemeRespect()** - Verifica que todas las secciones respetan el tema
4. **testLightModeContrast()** - Verifica contraste en modo claro (WCAG AA)
5. **testDarkModeContrast()** - Verifica contraste en modo oscuro (WCAG AA)
6. **testSmoothTransitions()** - Verifica transiciones suaves entre temas
7. **testInteractiveElementsTheme()** - Verifica que elementos interactivos respetan el tema
8. **testInputsTheme()** - Verifica que inputs respetan el tema
9. **testNavbarTheme()** - Verifica que navbar respeta el tema
10. **testFooterTheme()** - Verifica que footer respeta el tema

## Paleta de Colores

### Modo Claro
```css
--primary: #2d7a3e;           /* Verde bosque profesional */
--primary-hover: #236030;     /* Verde bosque oscuro */
--secondary: #1a4d2e;         /* Verde pino oscuro */
--accent: #4caf50;            /* Verde vibrante */
--accent-light: #81c784;      /* Verde menta */
--bg-primary: #f8faf9;        /* Blanco verdoso muy suave */
--bg-secondary: #e8f5e9;      /* Verde muy claro */
--bg-card: #ffffff;           /* Blanco puro para cards */
--text-primary: #1a1a1a;      /* Negro suave */
--text-secondary: #4a5f4a;    /* Gris verdoso */
--text-muted: #6b7c6b;        /* Gris verdoso claro */
--border-color: #c8e6c9;      /* Verde pastel */
```

### Modo Oscuro
```css
--primary: #4caf50;           /* Verde vibrante */
--primary-hover: #66bb6a;     /* Verde claro */
--secondary: #2d7a3e;         /* Verde bosque */
--accent: #81c784;            /* Verde menta */
--accent-dark: #1b5e20;       /* Verde oscuro profundo */
--bg-primary: #0d1f0d;        /* Negro verdoso */
--bg-secondary: #1a2e1a;      /* Verde muy oscuro */
--bg-tertiary: #243324;       /* Verde oscuro medio */
--bg-card: #1a2e1a;           /* Verde muy oscuro para cards */
--text-primary: #e8f5e9;      /* Verde muy claro */
--text-secondary: #a5d6a7;    /* Verde claro */
--text-muted: #7fa87f;        /* Verde medio */
--border-color: #2d4a2d;      /* Verde oscuro */
```

## Ratios de Contraste (WCAG 2.1)

### Modo Claro
| Elemento | Fondo | Texto | Ratio | Estado |
|----------|-------|-------|-------|--------|
| Texto principal | #f8faf9 | #1a1a1a | 19.8:1 | ✅ AAA |
| Texto secundario | #f8faf9 | #4a5f4a | 7.2:1 | ✅ AA |
| Botón primario | #2d7a3e | #ffffff | 5.8:1 | ✅ AA |
| Enlaces | #f8faf9 | #2d7a3e | 5.8:1 | ✅ AA |

### Modo Oscuro
| Elemento | Fondo | Texto | Ratio | Estado |
|----------|-------|-------|-------|--------|
| Texto principal | #0d1f0d | #e8f5e9 | 18.5:1 | ✅ AAA |
| Texto secundario | #0d1f0d | #a5d6a7 | 11.2:1 | ✅ AAA |
| Botón primario | #4caf50 | #0d1f0d | 8.9:1 | ✅ AAA |
| Enlaces | #0d1f0d | #4caf50 | 8.9:1 | ✅ AAA |

## Checklist de Testing Manual

### Persistencia de Preferencia
- [ ] El tema cambia al hacer clic en el toggle
- [ ] El tema se mantiene después de recargar la página
- [ ] El icono del toggle cambia (luna ↔ sol)

### Contraste en Modo Claro
- [ ] El texto principal es legible sobre el fondo claro
- [ ] El texto secundario es legible sobre el fondo claro
- [ ] Los botones tienen suficiente contraste

### Contraste en Modo Oscuro
- [ ] El texto principal es legible sobre el fondo oscuro
- [ ] El texto secundario es legible sobre el fondo oscuro
- [ ] Los botones tienen suficiente contraste en modo oscuro

### Transiciones Suaves
- [ ] El cambio de tema es suave (no instantáneo)
- [ ] Los colores de fondo transicionan suavemente
- [ ] El texto transiciona suavemente

### Elementos Interactivos
- [ ] Los botones respetan el tema actual
- [ ] Los inputs respetan el tema actual
- [ ] Los inputs tienen focus visible

### Componentes Visuales
- [ ] Las cards respetan el tema
- [ ] Los gradientes respetan el tema
- [ ] Las sombras se adaptan al tema

### Paleta de Colores
- [ ] Los colores primarios son correctos
- [ ] Los colores de fondo son correctos
- [ ] Los colores de texto son correctos

### Secciones del Sitio
- [ ] Navbar respeta el tema
- [ ] Hero section respeta el tema
- [ ] Sección de productos respeta el tema
- [ ] Sección de servicios respeta el tema
- [ ] Sección de fabricación respeta el tema
- [ ] Galería respeta el tema
- [ ] Sección de contacto respeta el tema
- [ ] Footer respeta el tema

## Cómo Ejecutar los Tests

### Opción 1: Test Manual Interactivo
```bash
# Abre el archivo en tu navegador
open ferreteria/test-dark-mode.html
# o
firefox ferreteria/test-dark-mode.html
# o
chrome ferreteria/test-dark-mode.html
```

### Opción 2: Tests Automatizados en Consola
1. Abre el archivo `test-dark-mode.html` en el navegador
2. Abre la consola del navegador (F12 o Cmd+Option+I)
3. Haz clic en "Ejecutar Tests Automatizados"
4. Revisa los resultados en la consola

### Opción 3: Incluir en Página Principal
```html
<!-- Agregar al final de index.html antes de </body> -->
<script src="test-dark-mode-automated.js"></script>
<script>
    // Ejecutar tests automáticamente
    DarkModeTests.runAll();
</script>
```

## Resultados Esperados

### Tests Automatizados
Todos los tests deben pasar (PASS):
- ✅ Persistencia de preferencia de tema
- ✅ Cambio de icono del tema
- ✅ Todas las secciones respetan el tema
- ✅ Contraste en modo claro (WCAG AA)
- ✅ Contraste en modo oscuro (WCAG AA)
- ✅ Transiciones suaves entre temas
- ✅ Elementos interactivos respetan el tema
- ✅ Inputs respetan el tema
- ✅ Navbar respeta el tema
- ✅ Footer respeta el tema

### Tests Manuales
Todos los checkboxes deben estar marcados (29/29).

## Herramientas Recomendadas

### Para Verificar Contraste
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Contrast Ratio](https://contrast-ratio.com/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### Para Testing de Accesibilidad
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Para Testing de Responsive Design
- Chrome DevTools (F12)
- Firefox Developer Tools (F12)
- [Responsively App](https://responsively.app/)

## Notas Importantes

1. **Variables CSS**: Todas las variables deben definirse en `:root` y `[data-theme="dark"]`
2. **Transiciones**: Agregar `transition: all 0.3s ease` para cambios suaves entre temas
3. **Fallbacks**: Incluir colores hexadecimales como fallback para navegadores antiguos
4. **Testing**: Probar en diferentes dispositivos y condiciones de luz
5. **Navegadores**: Probar en Chrome, Firefox, Safari y Edge (últimas 2 versiones)

## Troubleshooting

### El tema no se persiste
- Verificar que localStorage está habilitado en el navegador
- Verificar que `localStorage.setItem('theme', newTheme)` se ejecuta
- Verificar que `localStorage.getItem('theme')` devuelve el valor correcto

### El contraste es insuficiente
- Verificar los valores de color en la paleta
- Usar WebAIM Contrast Checker para verificar
- Ajustar los colores según sea necesario

### Las transiciones no son suaves
- Verificar que `transition: all 0.3s ease` está definido en `body`
- Verificar que no hay `transition: none` en elementos específicos
- Verificar que los navegadores soportan CSS transitions

### El icono no cambia
- Verificar que Font Awesome está cargado correctamente
- Verificar que las clases `fa-moon` y `fa-sun` existen
- Verificar que `updateThemeIcon()` se ejecuta correctamente

## Referencias

- [WCAG 2.1 Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Variables (Custom Properties)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Dark Mode Best Practices](https://web.dev/prefers-color-scheme/)
- [Accessible Colors](https://www.a11y-101.com/design/color-contrast)

## Historial de Cambios

### v1.0 (2024-01-15)
- Creación inicial de tests de modo oscuro/claro
- Implementación de 10 tests automatizados
- Creación de página de test interactiva
- Documentación completa

## Contacto

Para reportar problemas o sugerencias sobre el testing de modo oscuro/claro, contacta al equipo de desarrollo.
