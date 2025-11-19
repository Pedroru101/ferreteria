# Testing del Sistema de Pedidos

## Descripción General

Este documento describe la estrategia de testing para el módulo de Sistema de Pedidos (Tarea 64). El sistema de pedidos maneja la conversión de cotizaciones a pedidos, generación de números de orden únicos, actualización de estados, historial de cambios y envío de notificaciones por WhatsApp.

## Requisitos Validados

- **Requisito 4.1**: Conversión de cotización a pedido
- **Requisito 4.3**: Generación de número de orden único
- **Requisito 4.4**: Envío por WhatsApp
- **Requisito 4.7**: Consulta de estado de pedido
- **Requisito 4.10**: Actualización de estado desde admin y historial

## Archivos de Test

### 1. test-order-system-simple.js
**Tipo**: Test automatizado Node.js
**Ubicación**: `ferreteria/test-order-system-simple.js`
**Ejecución**: `node ferreteria/test-order-system-simple.js`

Test automatizado que valida la lógica core del sistema de pedidos sin dependencias del navegador.

**Tests incluidos**:
1. Creación de Pedido
2. Generación de Número de Orden Único
3. Conversión de Cotización a Pedido
4. Actualización de Estado
5. Historial de Estados
6. Consulta de Pedido por ID
7. Validación de Datos del Cliente
8. Generación de Mensaje WhatsApp
9. Persistencia en localStorage
10. Recuperación desde localStorage

**Resultado**: ✓ 10/10 tests pasados

### 2. test-order-system.html
**Tipo**: Test interactivo en navegador
**Ubicación**: `ferreteria/test-order-system.html`
**Acceso**: Abrir en navegador

Interfaz visual para ejecutar tests del sistema de pedidos con salida en consola y resumen de resultados.

**Características**:
- Ejecución de tests con interfaz visual
- Captura de salida de consola
- Resumen de resultados con estadísticas
- Limpieza de datos de prueba

### 3. test-order-system-automated.js
**Tipo**: Suite de tests JavaScript
**Ubicación**: `ferreteria/test-order-system-automated.js`

Clase `OrderSystemTest` que proporciona una suite completa de tests para el sistema de pedidos.

**Métodos principales**:
- `runAllTests()`: Ejecuta todos los tests
- `testOrderCreation()`: Valida creación de pedidos
- `testOrderIdGeneration()`: Valida generación de IDs únicos
- `testOrderConversionFromQuotation()`: Valida conversión de cotizaciones
- `testOrderStatusUpdate()`: Valida actualización de estados
- `testOrderStatusHistory()`: Valida historial de estados
- `testOrderRetrieval()`: Valida consulta de pedidos
- `testOrderValidation()`: Valida validación de datos
- `testWhatsAppMessageGeneration()`: Valida generación de mensajes
- `testOrderPersistence()`: Valida persistencia en localStorage
- `testOrderStatistics()`: Valida estadísticas

### 4. test-order-conversion.html
**Tipo**: Test interactivo
**Ubicación**: `ferreteria/test-order-conversion.html`

Prueba interactiva para validar la conversión de cotización a pedido con datos de ejemplo.

**Funcionalidades**:
- Abrir modal de cotización con datos de prueba
- Cotización con instalación
- Cotización grande con múltiples items
- Visualización de pedidos guardados
- Limpieza de datos

### 5. test-order-tracking.html
**Tipo**: Test interactivo
**Ubicación**: `ferreteria/test-order-tracking.html`

Prueba interactiva para validar la consulta de estado de pedidos.

**Funcionalidades**:
- Crear pedido de prueba
- Crear múltiples pedidos de prueba
- Listar todos los pedidos
- Consultar estado de pedido
- Limpiar datos

### 6. test-update-order-status.html
**Tipo**: Test interactivo
**Ubicación**: `ferreteria/test-update-order-status.html`

Prueba interactiva para validar la actualización de estado de pedidos desde el panel de administración.

**Funcionalidades**:
- Crear pedido de prueba
- Actualizar estado
- Actualizar estado con nota
- Probar validaciones
- Verificar historial
- Resumen de pruebas

## Casos de Prueba

### Caso 1: Creación de Pedido
**Objetivo**: Validar que se crea un pedido correctamente con estado inicial "pending"

**Pasos**:
1. Crear una cotización de prueba
2. Crear datos de cliente válidos
3. Llamar a `orderManager.createOrder(quotation, customerData)`
4. Verificar que el pedido tiene ID, estado "pending" y total correcto

**Resultado esperado**: ✓ Pedido creado con ID único y estado inicial correcto

### Caso 2: Generación de Número de Orden Único
**Objetivo**: Validar que cada pedido recibe un número único

**Pasos**:
1. Crear dos pedidos
2. Verificar que los IDs son diferentes
3. Verificar que el formato es `ORD-YYYYMMDD-XXXX`

**Resultado esperado**: ✓ Cada pedido tiene un ID único con formato correcto

### Caso 3: Conversión de Cotización a Pedido
**Objetivo**: Validar que los datos de la cotización se copian correctamente al pedido

**Pasos**:
1. Crear una cotización con múltiples items e instalación
2. Crear un pedido desde esa cotización
3. Verificar que todos los items se copiaron
4. Verificar que los datos de instalación se copiaron
5. Verificar que el total coincide

**Resultado esperado**: ✓ Todos los datos de la cotización se copian correctamente

### Caso 4: Actualización de Estado
**Objetivo**: Validar que el estado del pedido se actualiza correctamente

**Pasos**:
1. Crear un pedido (estado inicial: "pending")
2. Actualizar estado a "confirmed"
3. Verificar que el estado cambió
4. Verificar que el cambio se registró en el historial

**Resultado esperado**: ✓ Estado actualizado y registrado en historial

### Caso 5: Historial de Estados
**Objetivo**: Validar que se mantiene un historial completo de cambios de estado

**Pasos**:
1. Crear un pedido
2. Actualizar estado a "confirmed"
3. Actualizar estado a "in_progress"
4. Actualizar estado a "completed"
5. Verificar que el historial tiene 4 registros (pending + 3 cambios)
6. Verificar que cada registro tiene timestamp

**Resultado esperado**: ✓ Historial completo con todos los cambios y timestamps

### Caso 6: Consulta de Pedido por ID
**Objetivo**: Validar que se puede recuperar un pedido por su ID

**Pasos**:
1. Crear un pedido
2. Guardar el ID
3. Llamar a `orderManager.getOrderById(orderId)`
4. Verificar que se recupera el pedido correcto

**Resultado esperado**: ✓ Pedido recuperado correctamente

### Caso 7: Validación de Datos del Cliente
**Objetivo**: Validar que se rechacen datos incompletos del cliente

**Pasos**:
1. Intentar crear un pedido sin nombre del cliente
2. Verificar que se lanza un error
3. Intentar crear un pedido sin teléfono
4. Verificar que se lanza un error

**Resultado esperado**: ✓ Se rechazan datos incompletos

### Caso 8: Generación de Mensaje WhatsApp
**Objetivo**: Validar que se genera un mensaje WhatsApp con todos los datos

**Pasos**:
1. Crear un pedido
2. Llamar a `order.toWhatsAppMessage()`
3. Verificar que el mensaje contiene:
   - Número de orden
   - Nombre del cliente
   - Teléfono del cliente
   - Productos y cantidades
   - Total

**Resultado esperado**: ✓ Mensaje generado con todos los datos

### Caso 9: Persistencia en localStorage
**Objetivo**: Validar que los pedidos se guardan en localStorage

**Pasos**:
1. Crear un pedido
2. Verificar que se guardó en localStorage
3. Recuperar datos de localStorage
4. Verificar que el pedido está en los datos guardados

**Resultado esperado**: ✓ Pedido guardado correctamente en localStorage

### Caso 10: Recuperación desde localStorage
**Objetivo**: Validar que los pedidos se recuperan correctamente desde localStorage

**Pasos**:
1. Crear un pedido
2. Crear una nueva instancia de OrderManager
3. Llamar a `getOrderById(orderId)`
4. Verificar que se recupera el pedido

**Resultado esperado**: ✓ Pedido recuperado correctamente desde localStorage

## Ejecución de Tests

### Opción 1: Tests Automatizados (Node.js)
```bash
node ferreteria/test-order-system-simple.js
```

**Ventajas**:
- Rápido
- No requiere navegador
- Salida clara en consola
- Ideal para CI/CD

### Opción 2: Tests Interactivos (Navegador)
1. Abrir `ferreteria/test-order-system.html` en navegador
2. Hacer clic en "Ejecutar Tests"
3. Ver resultados en tiempo real

**Ventajas**:
- Interfaz visual
- Fácil de usar
- Permite debugging interactivo

### Opción 3: Tests Manuales
1. Abrir `ferreteria/test-order-conversion.html` para probar conversión
2. Abrir `ferreteria/test-order-tracking.html` para probar consulta
3. Abrir `ferreteria/test-update-order-status.html` para probar actualización

## Resultados de Tests

### Ejecución Actual
```
=== TESTS DEL SISTEMA DE PEDIDOS ===

TEST 1: Creación de Pedido
✓ Creación de Pedido - PASADO

TEST 2: Generación de Número de Orden Único
✓ Generación de Número Único - PASADO

TEST 3: Conversión de Cotización a Pedido
✓ Conversión de Cotización - PASADO

TEST 4: Actualización de Estado
✓ Actualización de Estado - PASADO

TEST 5: Historial de Estados
✓ Historial de Estados - PASADO

TEST 6: Consulta de Pedido por ID
✓ Consulta de Pedido - PASADO

TEST 7: Validación de Datos del Cliente
✓ Validación de Datos - PASADO

TEST 8: Generación de Mensaje WhatsApp
✓ Mensaje WhatsApp - PASADO

TEST 9: Persistencia en localStorage
✓ Persistencia en localStorage - PASADO

TEST 10: Recuperación desde localStorage
✓ Recuperación desde localStorage - PASADO

=== RESUMEN DE TESTS ===

Total de tests: 10
✓ Pasados: 10
✗ Fallidos: 0

✓ TODOS LOS TESTS PASARON EXITOSAMENTE
```

## Cobertura de Requisitos

| Requisito | Test | Estado |
|-----------|------|--------|
| 4.1 - Conversión de cotización a pedido | TEST 3 | ✓ Pasado |
| 4.3 - Generación de número de orden | TEST 2 | ✓ Pasado |
| 4.4 - Envío por WhatsApp | TEST 8 | ✓ Pasado |
| 4.7 - Consulta de estado | TEST 6 | ✓ Pasado |
| 4.10 - Actualización de estado e historial | TEST 4, 5 | ✓ Pasado |

## Validaciones Implementadas

### Validación de Datos del Cliente
- Nombre requerido
- Teléfono requerido
- Email opcional
- Dirección opcional
- Fecha de instalación opcional
- Método de pago opcional

### Validación de Estados
- Estados válidos: pending, confirmed, in_progress, completed, cancelled
- Rechazo de estados inválidos
- Registro de cambios en historial

### Validación de Persistencia
- Guardado en localStorage con clave `ferreteria_orders`
- Recuperación correcta de datos
- Serialización/deserialización correcta

## Notas Importantes

1. **localStorage**: Los tests usan localStorage para persistencia. En Node.js se simula con un objeto en memoria.

2. **Formato de ID**: Los IDs de pedido siguen el formato `ORD-YYYYMMDD-XXXX` donde XXXX es un número aleatorio de 4 dígitos.

3. **Historial**: Cada cambio de estado se registra con timestamp y nota opcional.

4. **Mensajes WhatsApp**: Los mensajes se codifican con `encodeURIComponent` para ser seguros en URLs.

5. **Validación**: Se validan datos requeridos del cliente antes de crear el pedido.

## Próximos Pasos

- Integrar tests en CI/CD
- Agregar tests de performance
- Agregar tests de integración con otros módulos
- Documentar casos de error adicionales
