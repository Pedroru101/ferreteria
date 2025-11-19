# Testing del Panel de Administración

## Descripción General

Este documento describe la suite de pruebas automatizadas para el panel de administración del sistema de alambrados. Los tests verifican todas las funcionalidades críticas del panel incluyendo autenticación, estadísticas, filtros, actualización de estado, exportación de datos y gestión de productos y precios.

## Archivos de Testing

### 1. `test-admin-panel.html`
Interfaz web interactiva para ejecutar los tests en el navegador.

**Características:**
- Ejecución de todos los tests simultáneamente
- Pruebas individuales por funcionalidad
- Gestión de datos de prueba
- Visualización en tiempo real de resultados
- Resumen de estadísticas

**Cómo usar:**
1. Abrir `test-admin-panel.html` en el navegador
2. Hacer clic en "Ejecutar Todos los Tests"
3. Ver resultados en la consola de salida

### 2. `test-admin-node.js`
Suite de tests ejecutable desde Node.js para CI/CD.

**Características:**
- Tests automatizados sin interfaz gráfica
- Salida en consola formateada
- Exit code 0 si todos los tests pasan, 1 si hay fallos
- Ideal para integración continua

**Cómo usar:**
```bash
node ferreteria/test-admin-node.js
```

### 3. `test-admin-panel-automated.js`
Clase reutilizable con la lógica de todos los tests.

**Características:**
- Clase `AdminPanelTestSuite` con métodos de test individuales
- Métodos de utilidad para logging y assertions
- Puede ser importada en otros contextos

**Cómo usar:**
```javascript
const suite = new AdminPanelTestSuite();
const results = suite.runAllTests();
```

## Funcionalidades Testeadas

### 1. Autenticación (6 tests)
- ✓ Hash de contraseña funciona correctamente
- ✓ Usuario no autenticado inicialmente
- ✓ Login exitoso con contraseña correcta
- ✓ Usuario autenticado después del login
- ✓ Login falla con contraseña incorrecta
- ✓ Usuario desautenticado después del logout

**Requisitos:** 6.1

### 2. Cálculo de Estadísticas (10 tests)
- ✓ Se cargan 3 pedidos correctamente
- ✓ Se cargan 3 cotizaciones correctamente
- ✓ Estadísticas mensuales de pedidos calculadas
- ✓ Estadísticas mensuales de cotizaciones calculadas
- ✓ Ingresos mensuales calculados
- ✓ Tasa de conversión calculada
- ✓ Conteo de pedidos por estado funciona
- ✓ Conteo de cotizaciones en borrador funciona
- ✓ Conteo de cotizaciones enviadas funciona
- ✓ Conteo de cotizaciones expiradas funciona

**Requisitos:** 6.2, 6.11

### 3. Filtros de Pedidos (5 tests)
- ✓ Filtro por estado 'pending'
- ✓ Filtro por estado 'confirmed'
- ✓ Filtro por estado 'in_progress'
- ✓ Filtro por cliente
- ✓ Filtro por fecha

**Requisitos:** 6.9

### 4. Filtros de Cotizaciones (5 tests)
- ✓ Filtro por estado 'draft'
- ✓ Filtro por estado 'sent'
- ✓ Filtro por estado 'accepted'
- ✓ Filtro por estado 'expired'
- ✓ Filtro por rango de montos

**Requisitos:** 6.5

### 5. Actualización de Estado de Pedidos (2 tests)
- ✓ Estado actualizado correctamente
- ✓ Historial de estados actualizado

**Requisitos:** 6.6, 6.11

### 6. Exportación a CSV (4 tests)
- ✓ CSV contiene ID de pedido
- ✓ CSV contiene nombre de cliente
- ✓ CSV contiene total del pedido
- ✓ CSV tiene múltiples filas

**Requisitos:** 6.10

### 7. Gestión de Productos (3 tests)
- ✓ Producto agregado correctamente
- ✓ Nombre del producto guardado correctamente
- ✓ Precio del producto guardado correctamente

**Requisitos:** 6.3

### 8. Gestión de Configuración (3 tests)
- ✓ Separación entre postes guardada correctamente
- ✓ Costo de instalación guardado correctamente
- ✓ Validez de cotizaciones guardada correctamente

**Requisitos:** 6.6, 6.7

## Resultados de Ejecución

### Resumen Total
- **Tests Pasados:** 38
- **Tests Fallidos:** 0
- **Tasa de Éxito:** 100%

### Desglose por Funcionalidad
| Funcionalidad | Tests | Pasados | Fallidos |
|---|---|---|---|
| Autenticación | 6 | 6 | 0 |
| Estadísticas | 10 | 10 | 0 |
| Filtros de Pedidos | 5 | 5 | 0 |
| Filtros de Cotizaciones | 5 | 5 | 0 |
| Actualización de Estado | 2 | 2 | 0 |
| Exportación CSV | 4 | 4 | 0 |
| Gestión de Productos | 3 | 3 | 0 |
| Gestión de Configuración | 3 | 3 | 0 |
| **TOTAL** | **38** | **38** | **0** |

## Datos de Prueba

Los tests utilizan datos de prueba predefinidos que incluyen:

### Pedidos (3 registros)
1. **ORD-20240115-0001** - Pendiente (Juan Pérez)
   - Total: $97,500
   - Incluye instalación

2. **ORD-20240116-0002** - Confirmado (María García)
   - Total: $33,600
   - Sin instalación

3. **ORD-20240117-0003** - En Proceso (Carlos López)
   - Total: $105,000
   - Incluye instalación

### Cotizaciones (3 registros)
1. **COT-1705315800000-123** - Enviada (válida)
   - Total: $85,000

2. **COT-1705402200000-456** - Borrador (expirada)
   - Total: $33,600

3. **COT-1705488600000-789** - Aceptada (válida)
   - Total: $105,000

## Requisitos Cubiertos

Los tests cubren los siguientes requisitos del documento de especificación:

- **6.1:** Autenticación y login
- **6.2:** Cálculo de estadísticas del dashboard
- **6.3:** Gestión de productos
- **6.5:** Visualización de cotizaciones
- **6.6:** Configuración de parámetros y actualización de estado
- **6.7:** Guardado de configuraciones
- **6.9:** Filtros de pedidos
- **6.10:** Exportación de datos a CSV
- **6.11:** Actualización de estado y notificaciones

## Ejecución en CI/CD

Para integrar los tests en un pipeline de CI/CD:

```bash
# Ejecutar tests
node ferreteria/test-admin-node.js

# Capturar exit code
if [ $? -eq 0 ]; then
    echo "Todos los tests pasaron"
else
    echo "Algunos tests fallaron"
    exit 1
fi
```

## Extensión de Tests

Para agregar nuevos tests:

1. Agregar un nuevo método a la clase `AdminPanelTestSuite`
2. Usar `this.assert(condition, message)` para verificaciones
3. Usar `this.log(message, type)` para logging
4. Llamar al nuevo método desde `runAllTests()`

Ejemplo:
```javascript
testNewFeature() {
    this.log('Iniciando pruebas de nueva funcionalidad...', 'info');
    
    const result = someFunction();
    this.assert(result === expected, 'Descripción del test');
}
```

## Notas Importantes

- Los tests utilizan localStorage para simular persistencia de datos
- Todos los datos de prueba se crean en memoria y se limpian después
- Los tests son independientes y pueden ejecutarse en cualquier orden
- La suite es compatible con navegadores modernos y Node.js

## Troubleshooting

### Los tests fallan en el navegador
- Verificar que la consola del navegador no muestre errores
- Asegurar que los archivos `config.js` y `admin.js` estén cargados
- Limpiar localStorage: `localStorage.clear()`

### Los tests fallan en Node.js
- Verificar que Node.js esté instalado (v14+)
- Ejecutar desde el directorio correcto
- Verificar que no haya conflictos con variables globales

## Contacto y Soporte

Para reportar problemas o sugerencias sobre los tests, contactar al equipo de desarrollo.
