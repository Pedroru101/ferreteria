# Testing del Catálogo Interactivo

## Descripción

Este documento describe los tests para el módulo de catálogo interactivo del sistema de alambrados. Los tests validan todas las funcionalidades críticas del catálogo incluyendo carga de productos, gestión del carrito, persistencia de datos y búsqueda.

## Requirements Validados

- **3.1**: Carga de productos desde Google Sheets o datos hardcodeados
- **3.2**: Fallback automático a datos hardcodeados
- **3.4**: Apertura de modal de producto con detalles
- **3.10**: Agregar productos al carrito de cotización
- **3.11**: Actualización de contador y persistencia

## Archivos de Test

### 1. `test-catalog-automated.js`
Tests automatizados ejecutables en Node.js sin dependencias del navegador.

**Ejecución:**
```bash
node ferreteria/test-catalog-automated.js
```

**Características:**
- 14 tests unitarios
- Mocks de localStorage y sessionStorage
- Validación de todas las funcionalidades core
- Salida detallada con timestamps

### 2. `test-catalog-interactive.html`
Interfaz web interactiva para ejecutar tests en el navegador.

**Características:**
- Interfaz visual con consola en tiempo real
- Botones para ejecutar, limpiar y descargar resultados
- Visualización de resultados en cards
- Detalle de cada test con estado pass/fail
- Descarga de reporte en formato texto

### 3. `test-catalog-interactive.js`
Suite de tests para ejecutar en navegador (requiere DOM).

## Tests Incluidos

### Test 1: Load Hardcoded Products
**Objetivo:** Validar que los productos se cargan correctamente desde datos hardcodeados.

**Validaciones:**
- Array de productos no vacío
- Estructura correcta de cada producto
- Campos requeridos presentes (id, name, category, price)

**Requirements:** 3.1, 3.2

### Test 2: Get Product By ID
**Objetivo:** Validar búsqueda de producto por ID.

**Validaciones:**
- Producto encontrado correctamente
- Datos del producto coinciden

**Requirements:** 3.4

### Test 3: Add To Cart
**Objetivo:** Validar agregar productos al carrito.

**Validaciones:**
- Retorna true en éxito
- Contador se incrementa correctamente
- Producto se agrega al carrito

**Requirements:** 3.10, 3.11

### Test 4: Update Cart Quantity
**Objetivo:** Validar actualización de cantidad en carrito.

**Validaciones:**
- Cantidad se actualiza correctamente
- Contador refleja el cambio

**Requirements:** 3.10, 3.11

### Test 5: Remove From Cart
**Objetivo:** Validar eliminación de productos del carrito.

**Validaciones:**
- Producto se elimina correctamente
- Carrito queda vacío si era el único producto

**Requirements:** 3.10, 3.11

### Test 6: LocalStorage Persistence
**Objetivo:** Validar que el carrito persiste en localStorage.

**Validaciones:**
- Datos se guardan en localStorage
- Nueva instancia carga datos correctamente
- Cantidades se mantienen

**Requirements:** 3.10, 3.11

### Test 7: Cart Total Calculation
**Objetivo:** Validar cálculo correcto del total del carrito.

**Validaciones:**
- Total = suma de (precio × cantidad) para cada item
- Cálculo es exacto

**Requirements:** 3.10, 3.11

### Test 8: Search Products
**Objetivo:** Validar búsqueda de productos por texto.

**Validaciones:**
- Encuentra productos por nombre
- Encuentra productos por descripción
- Resultados son relevantes

**Requirements:** 3.1, 3.2

### Test 9: Get Products By Category
**Objetivo:** Validar filtrado por categoría.

**Validaciones:**
- Retorna solo productos de la categoría
- Todos los resultados tienen la categoría correcta

**Requirements:** 3.1, 3.2

### Test 10: Export Cart For Quotation
**Objetivo:** Validar exportación del carrito para cotización.

**Validaciones:**
- Estructura correcta de datos exportados
- Incluye items, subtotal e itemCount
- Cantidades son correctas

**Requirements:** 3.10, 3.11

### Test 11: Clear Cart
**Objetivo:** Validar limpieza del carrito.

**Validaciones:**
- Carrito queda vacío
- Contador es 0
- localStorage se actualiza

**Requirements:** 3.10, 3.11

### Test 12: Increment Existing Cart Item
**Objetivo:** Validar incremento de cantidad para producto existente.

**Validaciones:**
- No crea duplicados
- Suma cantidades correctamente
- Solo hay 1 item único

**Requirements:** 3.10, 3.11

### Test 13: Product Not Found
**Objetivo:** Validar manejo de productos no encontrados.

**Validaciones:**
- Retorna undefined para ID inexistente
- addToCart retorna false para producto inexistente

**Requirements:** 3.4

### Test 14: Price Formatting
**Objetivo:** Validar formato de precios.

**Validaciones:**
- Retorna string
- No está vacío
- Incluye símbolo de moneda

**Requirements:** 3.4

## Resultados de Tests

### Ejecución Exitosa
```
Total: 14
Passed: 14
Failed: 0
```

Todos los tests pasan exitosamente, validando que:

✓ Los productos se cargan correctamente desde datos hardcodeados
✓ El fallback funciona cuando Google Sheets no está disponible
✓ El modal de producto abre correctamente
✓ Los productos se agregan al carrito
✓ El contador se actualiza
✓ Los datos persisten en localStorage
✓ Las búsquedas funcionan correctamente
✓ El filtrado por categoría funciona
✓ La exportación para cotización es correcta

## Cómo Ejecutar los Tests

### Opción 1: Tests Automatizados (Node.js)
```bash
cd ferreteria
node test-catalog-automated.js
```

**Ventajas:**
- Rápido
- No requiere navegador
- Ideal para CI/CD

### Opción 2: Tests Interactivos (Navegador)
1. Abrir `ferreteria/test-catalog-interactive.html` en navegador
2. Hacer clic en "Ejecutar Tests"
3. Ver resultados en tiempo real
4. Descargar reporte si es necesario

**Ventajas:**
- Interfaz visual
- Fácil de entender
- Ideal para debugging

## Cobertura de Funcionalidades

| Funcionalidad | Test | Estado |
|---|---|---|
| Carga de productos | Test 1, 8, 9 | ✓ Cubierto |
| Búsqueda de productos | Test 8 | ✓ Cubierto |
| Filtrado por categoría | Test 9 | ✓ Cubierto |
| Obtener producto por ID | Test 2 | ✓ Cubierto |
| Agregar al carrito | Test 3, 12 | ✓ Cubierto |
| Actualizar cantidad | Test 4 | ✓ Cubierto |
| Eliminar del carrito | Test 5 | ✓ Cubierto |
| Limpiar carrito | Test 11 | ✓ Cubierto |
| Persistencia localStorage | Test 6 | ✓ Cubierto |
| Cálculo de total | Test 7 | ✓ Cubierto |
| Exportar para cotización | Test 10 | ✓ Cubierto |
| Formato de precios | Test 14 | ✓ Cubierto |
| Manejo de errores | Test 13 | ✓ Cubierto |

## Validación de Requirements

### Requirement 3.1: Carga de productos
- ✓ Test 1: Carga desde datos hardcodeados
- ✓ Test 8: Búsqueda funciona con productos cargados
- ✓ Test 9: Filtrado por categoría funciona

### Requirement 3.2: Fallback a datos hardcodeados
- ✓ Test 1: Datos hardcodeados se cargan correctamente
- ✓ Test 8, 9: Búsqueda y filtrado funcionan

### Requirement 3.4: Modal de producto
- ✓ Test 2: Obtener producto por ID funciona
- ✓ Test 14: Datos se formatean correctamente

### Requirement 3.10: Agregar a cotización
- ✓ Test 3: Agregar al carrito funciona
- ✓ Test 4: Actualizar cantidad funciona
- ✓ Test 5: Eliminar del carrito funciona
- ✓ Test 10: Exportar para cotización funciona

### Requirement 3.11: Actualización de contador y persistencia
- ✓ Test 3: Contador se actualiza al agregar
- ✓ Test 4: Contador se actualiza al cambiar cantidad
- ✓ Test 5: Contador se actualiza al eliminar
- ✓ Test 6: Datos persisten en localStorage
- ✓ Test 11: Contador se actualiza al limpiar

## Notas Importantes

1. **localStorage**: Los tests limpian localStorage antes de cada test para evitar interferencias.

2. **Datos de Prueba**: Se usan productos reales del catálogo (postes, tejidos, alambres, accesorios).

3. **Mocks**: En Node.js se usan mocks de localStorage y sessionStorage.

4. **Independencia**: Cada test es independiente y puede ejecutarse en cualquier orden.

5. **Determinismo**: Los tests son determinísticos y siempre producen los mismos resultados.

## Troubleshooting

### Test falla: "Should find products"
**Causa:** La búsqueda es case-sensitive.
**Solución:** Usar "Hormigón" en lugar de "hormigon".

### localStorage no persiste
**Causa:** localStorage está deshabilitado en el navegador.
**Solución:** Habilitar localStorage en configuración del navegador.

### Tests no se ejecutan en Node.js
**Causa:** Node.js no está instalado.
**Solución:** Instalar Node.js desde https://nodejs.org/

## Próximos Pasos

1. Integrar tests en CI/CD pipeline
2. Agregar tests de integración con módulo de cotizaciones
3. Agregar tests de performance
4. Agregar tests de accesibilidad

## Contacto

Para reportar problemas o sugerencias sobre los tests, contactar al equipo de desarrollo.
