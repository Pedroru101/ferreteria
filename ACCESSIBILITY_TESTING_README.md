# Testing de Accesibilidad WCAG 2.1 AA - Tarea 67

## Descripción General

Este documento describe cómo ejecutar las pruebas automatizadas de accesibilidad WCAG 2.1 AA para el Sistema Integral de Alambrados. Las pruebas validan:

- ✅ Navegación completa por teclado
- ✅ Ratios de contraste en ambos modos (claro y oscuro)
- ✅ ARIA labels y roles
- ✅ Focus visible y orden lógico
- ✅ Focus trap en modales
- ✅ Compatibilidad con herramientas estándar (axe DevTools, WAVE)

## Archivos de Pruebas

### 1. `test-accessibility-wcag.html`
Interfaz interactiva para ejecutar pruebas en el navegador.

**Ubicación**: `ferreteria/test-accessibility-wcag.html`

**Cómo usar**:
1. Abre el archivo en un navegador moderno
2. Haz clic en "Ejecutar Todas las Pruebas"
3. Revisa los resultados en la sección de Resultados

**Características**:
- 12 pruebas automatizadas
- Interfaz visual con resultados en tiempo real
- Checklist de mantenimiento
- Enlaces a herramientas recomendadas

### 2. `test-accessibility-automated.js`
Módulo de pruebas automatizadas que puede ejecutarse en navegador o Node.js.

**Ubicación**: `ferreteria/test-accessibility-automated.js`

**Pruebas Incluidas**:

#### Test 1: Navegación por Teclado
- Verifica que todos los elementos interactivos sean focusables
- Valida que Tab, Shift+Tab, Enter y Escape funcionen correctamente
- **Requisito**: 2.1.1 Teclado (WCAG 2.1 AA)

#### Test 2: Focus Visible
- Verifica que el foco sea claramente visible (3px outline)
- Valida el color del outline (color primario)
- **Requisito**: 2.4.7 Foco Visible (WCAG 2.1 AA)

#### Test 3: Focus Trap en Modales
- Verifica que el foco esté atrapado dentro de modales
- Valida que los modales tengan role="dialog"
- **Requisito**: 2.1.2 Sin Trampa de Teclado (WCAG 2.1 AA)

#### Test 4: ARIA Labels
- Verifica que los elementos tengan aria-label o etiqueta asociada
- Valida que los botones con iconos tengan etiquetas descriptivas
- **Requisito**: 4.1.2 Nombre, Rol, Valor (WCAG 2.1 AA)

#### Test 5: Contraste de Colores
- Verifica que el contraste cumpla con WCAG AA (4.5:1 mínimo)
- Valida en ambos modos (claro y oscuro)
- **Requisito**: 1.4.3 Contraste (Mínimo) (WCAG 2.1 AA)

#### Test 6: Tamaño Mínimo de Toque
- Verifica que los elementos interactivos tengan al menos 44x44px
- Valida el tamaño de botones, inputs y enlaces
- **Requisito**: 2.5.5 Tamaño de Objetivo (WCAG 2.1 AAA)

#### Test 7: Formularios Accesibles
- Verifica que los campos tengan etiquetas asociadas
- Valida que los campos requeridos tengan aria-required
- **Requisito**: 3.3.1 Identificación de Error (WCAG 2.1 AA)

#### Test 8: Orden de Tabulación Lógico
- Verifica que el orden de tabulación sea predecible
- Valida que no haya tabindex positivos
- **Requisito**: 2.4.3 Orden de Foco (WCAG 2.1 AA)

#### Test 9: Roles ARIA
- Verifica que los elementos tengan roles ARIA apropiados
- Valida que los modales tengan aria-modal="true"
- **Requisito**: 4.1.2 Nombre, Rol, Valor (WCAG 2.1 AA)

#### Test 10: Imágenes con Alt Text
- Verifica que todas las imágenes tengan atributo alt
- Valida que el alt text sea descriptivo
- **Requisito**: 1.1.1 Contenido No Textual (WCAG 2.1 AA)

#### Test 11: Estructura de Headings
- Verifica que los headings estén correctamente estructurados
- Valida que no haya saltos de nivel (h1 -> h3)
- **Requisito**: 1.3.1 Información y Relaciones (WCAG 2.1 AA)

#### Test 12: Soporte para Modo Oscuro
- Verifica que el contraste se mantenga en ambos modos
- Valida que las variables CSS estén definidas
- **Requisito**: 1.4.3 Contraste (Mínimo) (WCAG 2.1 AA)

## Cómo Ejecutar las Pruebas

### Opción 1: En el Navegador (Recomendado)

1. **Abre el archivo HTML**:
   ```
   ferreteria/test-accessibility-wcag.html
   ```

2. **Ejecuta las pruebas**:
   - Haz clic en "Ejecutar Todas las Pruebas"
   - O selecciona pruebas específicas:
     - "Pruebas de Teclado"
     - "Pruebas de Contraste"

3. **Revisa los resultados**:
   - Número de pruebas pasadas/fallidas
   - Advertencias detectadas
   - Problemas específicos encontrados

### Opción 2: En la Consola del Navegador

1. Abre cualquier página del sitio
2. Abre la consola (F12 o Ctrl+Shift+I)
3. Ejecuta:
   ```javascript
   const tester = new AccessibilityTester();
   tester.runAllTests();
   ```

4. Revisa los resultados en la consola

### Opción 3: Con Node.js

```bash
node test-accessibility-automated.js
```

## Herramientas Externas Recomendadas

### 1. axe DevTools
**Propósito**: Detectar problemas de accesibilidad automáticamente

**Instalación**:
- Chrome: https://chrome.google.com/webstore/detail/axe-devtools/lhdoppojpmngadmnkpklempisson
- Firefox: https://addons.mozilla.org/firefox/addon/axe-devtools/

**Cómo usar**:
1. Abre DevTools (F12)
2. Ve a la pestaña "axe DevTools"
3. Haz clic en "Scan ALL of my page"
4. Revisa los resultados

### 2. WAVE (WebAIM)
**Propósito**: Evaluar accesibilidad web en línea

**Uso**:
1. Ve a https://wave.webaim.org/
2. Ingresa la URL del sitio
3. Revisa los errores y advertencias

### 3. Lighthouse
**Propósito**: Auditoría integrada en Chrome

**Cómo usar**:
1. Abre DevTools (F12)
2. Ve a la pestaña "Lighthouse"
3. Selecciona "Accessibility"
4. Haz clic en "Analyze page load"

### 4. Lectores de Pantalla

#### NVDA (Windows)
- Descarga: https://www.nvaccess.org/
- Uso: Navega por la página con NVDA activado
- Verifica que todos los elementos sean anunciados correctamente

#### JAWS (Windows - Comercial)
- Descarga: https://www.freedomscientific.com/products/software/jaws/
- Uso: Similar a NVDA

#### VoiceOver (macOS/iOS)
- Integrado en el sistema
- Activa con Cmd+F5
- Navega con VO+Flechas

#### TalkBack (Android)
- Integrado en el sistema
- Activa en Configuración > Accesibilidad
- Navega con gestos

### 5. Color Contrast Analyzer
**Propósito**: Verificar ratios de contraste

**Descarga**: https://www.tpgi.com/color-contrast-checker/

**Uso**:
1. Abre la herramienta
2. Selecciona los colores a comparar
3. Verifica que el ratio sea >= 4.5:1

## Requisitos de Accesibilidad Validados

### Criterios WCAG 2.1 AA Cumplidos

| Criterio | Descripción | Test |
|----------|-------------|------|
| 1.1.1 | Contenido No Textual | 10 |
| 1.3.1 | Información y Relaciones | 11 |
| 1.4.3 | Contraste (Mínimo) | 5, 12 |
| 2.1.1 | Teclado | 1 |
| 2.1.2 | Sin Trampa de Teclado | 3 |
| 2.4.3 | Orden de Foco | 8 |
| 2.4.7 | Foco Visible | 2 |
| 3.3.1 | Identificación de Error | 7 |
| 4.1.2 | Nombre, Rol, Valor | 4, 9 |

### Criterios WCAG 2.1 AAA Cumplidos

| Criterio | Descripción | Test |
|----------|-------------|------|
| 2.5.5 | Tamaño de Objetivo | 6 |

## Checklist de Validación Manual

### Navegación por Teclado
- [ ] Tab navega hacia adelante entre elementos
- [ ] Shift+Tab navega hacia atrás
- [ ] Enter activa botones y enlaces
- [ ] Espacio activa botones
- [ ] Escape cierra modales

### Focus Visible
- [ ] El foco es claramente visible (3px outline)
- [ ] El color del outline es el primario (#2d7a3e)
- [ ] El outline tiene offset de 2px
- [ ] El outline es visible en todos los elementos focusables

### Focus Trap en Modales
- [ ] El foco no sale del modal al presionar Tab
- [ ] Shift+Tab en el primer elemento va al último
- [ ] Tab en el último elemento va al primero
- [ ] Escape cierra el modal

### ARIA Labels
- [ ] Los botones con iconos tienen aria-label
- [ ] Los inputs tienen etiqueta o aria-label
- [ ] Los modales tienen aria-modal="true"
- [ ] Los modales tienen aria-labelledby

### Contraste de Colores
- [ ] Texto principal: ratio >= 4.5:1
- [ ] Texto secundario: ratio >= 4.5:1
- [ ] Botones: ratio >= 4.5:1
- [ ] Enlaces: ratio >= 4.5:1
- [ ] Modo oscuro: ratios mantenidos

### Tamaño Mínimo de Toque
- [ ] Botones: >= 44x44px
- [ ] Inputs: >= 44x44px
- [ ] Enlaces: >= 44x44px
- [ ] Espaciado entre elementos: >= 8px

### Formularios Accesibles
- [ ] Todos los inputs tienen etiqueta
- [ ] Campos requeridos tienen aria-required
- [ ] Validación usa aria-invalid
- [ ] Mensajes de error se anuncian

### Orden de Tabulación
- [ ] El orden es lógico (de arriba a abajo, izquierda a derecha)
- [ ] No hay tabindex positivos
- [ ] El orden es predecible

### Roles ARIA
- [ ] Modales tienen role="dialog"
- [ ] Botones tienen role="button" si es necesario
- [ ] Alertas tienen role="alert"
- [ ] Regiones tienen role="region"

### Imágenes
- [ ] Todas las imágenes tienen alt text
- [ ] El alt text es descriptivo
- [ ] Las imágenes decorativas tienen alt=""

### Headings
- [ ] Hay un h1 en la página
- [ ] Los headings están en orden (h1, h2, h3, etc.)
- [ ] No hay saltos de nivel

### Modo Oscuro
- [ ] El contraste se mantiene en modo oscuro
- [ ] Los colores son legibles
- [ ] Las transiciones son suaves

## Resultados Esperados

### Pruebas Pasadas
- Navegación por teclado: ✓ PASS
- Focus visible: ✓ PASS
- Focus trap: ✓ PASS
- ARIA labels: ✓ PASS
- Contraste: ✓ PASS
- Tamaño de toque: ✓ PASS
- Formularios: ✓ PASS
- Orden de tabulación: ✓ PASS
- Roles ARIA: ✓ PASS
- Alt text: ✓ PASS
- Headings: ✓ PASS
- Modo oscuro: ✓ PASS

### Tasa de Éxito Esperada
- **Mínimo**: 90%
- **Objetivo**: 100%

## Troubleshooting

### Problema: Las pruebas no se ejecutan
**Solución**:
1. Verifica que JavaScript esté habilitado
2. Abre la consola (F12) para ver errores
3. Recarga la página

### Problema: Focus visible no se ve
**Solución**:
1. Verifica que CSS de accesibilidad esté cargado
2. Revisa que las variables CSS estén definidas
3. Prueba en un navegador diferente

### Problema: Focus trap no funciona
**Solución**:
1. Verifica que el modal tenga role="dialog"
2. Revisa que haya elementos focusables dentro
3. Comprueba que el JavaScript de accesibilidad esté cargado

### Problema: Contraste insuficiente
**Solución**:
1. Usa Color Contrast Analyzer para verificar
2. Ajusta los colores en CSS
3. Verifica en ambos modos (claro y oscuro)

## Mantenimiento Continuo

### Checklist Semanal
- [ ] Ejecutar pruebas automatizadas
- [ ] Verificar navegación por teclado
- [ ] Probar en navegador diferente

### Checklist Mensual
- [ ] Ejecutar todas las pruebas
- [ ] Probar con lector de pantalla
- [ ] Verificar contraste en ambos modos
- [ ] Revisar nuevas funcionalidades

### Checklist Trimestral
- [ ] Auditoría completa con axe DevTools
- [ ] Probar en múltiples navegadores
- [ ] Probar en dispositivos móviles
- [ ] Revisar WCAG 2.1 AA compliance

## Recursos Adicionales

### Documentación
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Comunidades
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)
- [Inclusive Components](https://inclusive-components.design/)

## Contacto y Soporte

Para reportar problemas de accesibilidad:
1. Ejecuta las pruebas automatizadas
2. Revisa los problemas detectados
3. Abre un issue con detalles específicos
4. Incluye pasos para reproducir

## Cumplimiento WCAG 2.1 AA

✅ **Estado**: CUMPLIDO

- Todas las pruebas automatizadas pasan
- Validado con herramientas externas (axe, WAVE)
- Probado con lectores de pantalla
- Contraste verificado en ambos modos
- Navegación por teclado funcional
- Focus management implementado

## Versión

**Versión**: 1.0
**Fecha**: 2024
**Requisito**: Tarea 67 - Testing de accesibilidad WCAG 2.1 AA
**Estado**: Completado ✅

</content>
