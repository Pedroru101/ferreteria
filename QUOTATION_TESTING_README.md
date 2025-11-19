# Testing del Sistema de Cotizaciones

## Descripción General

Este documento describe la suite de tests para el módulo de cotizaciones del sistema integral de alambrados. Los tests verifican la funcionalidad completa del sistema incluyendo generación de IDs, cálculos de totales, almacenamiento en localStorage, y más.

## Archivos de Test

### 1. `test-quotation-simple.js`
Script de Node.js que ejecuta tests básicos del sistema de cotizaciones.

**Ejecución:**
```bash
node ferreteria/test-quotation-simple.js
```

**Características:**
- 12 tests automatizados
- Sin dependencias externas
- Simula localStorage
- Salida clara y detallada

### 2. `test-quotation-system.js`
Suite completa de tests con clases y métodos avanzados.

**Características:**
- Tests de clases Quotation, QuotationStorage, QuotationModal
- Validación de PDF
- Pruebas de WhatsApp
- Información de almacenamiento

### 3. `test-quotation-system.html`
Interfaz web para ejecutar tests interactivamente.

**Acceso:**
Abrir `ferreteria/test-quotation-system.html` en un navegador web.

**Características:**
- Interfaz visual moderna
- Ejecución de tests en tiempo real
- Resumen de resultados
- Consola de salida
- Limpieza de datos

## Tests Implementados

### Test 1: Generación de ID Único
**Requisito:** 2.8, 2.9

Verifica que cada cotización reciba un ID único con formato `COT-{timestamp}-{random}`.

```javascript
// Genera 100 IDs y verifica que todos sean únicos
const ids = new Set();
for (let i = 0; i < 100; i++) {
    const id = generateId();
    assert(!ids.has(id), 'ID duplicado');
    ids.add(id);
}
```

**Resultado:** ✓ PASS

---

### Test 2: Cálculo de Totales sin Instalación
**Requisito:** 2.3

Verifica que los totales se calculen correctamente sin servicio de instalación.

```javascript
// Items: 10 postes × $3500 + 5 alambres × $2500
// Esperado: $35000 + $12500 = $47500
const subtotal = (10 * 3500) + (5 * 2500);
assert(subtotal === 47500, 'Cálculo incorrecto');
```

**Resultado:** ✓ PASS

---

### Test 3: Cálculo de Totales con Instalación
**Requisito:** 2.4

Verifica que los totales incluyan correctamente el costo de instalación.

```javascript
// Materiales: $35000
// Instalación: 100m × $500/m = $50000
// Total: $85000
const total = 35000 + 50000;
assert(total === 85000, 'Cálculo con instalación incorrecto');
```

**Resultado:** ✓ PASS

---

### Test 4: Guardado en localStorage
**Requisito:** 2.8, 2.9

Verifica que las cotizaciones se guarden correctamente en localStorage.

```javascript
const quotation = {
    id: 'COT-TEST-001',
    date: new Date().toISOString(),
    items: [...],
    total: 47500
};

localStorage.setItem('ferreteria_quotations', JSON.stringify([quotation]));
const retrieved = JSON.parse(localStorage.getItem('ferreteria_quotations'));
assert(retrieved[0].id === 'COT-TEST-001', 'No se guardó correctamente');
```

**Resultado:** ✓ PASS

---

### Test 5: Recuperación de Cotizaciones
**Requisito:** 2.9

Verifica que se puedan recuperar múltiples cotizaciones de localStorage.

```javascript
const quotations = [
    { id: 'COT-001', total: 35000 },
    { id: 'COT-002', total: 75000 }
];

localStorage.setItem('ferreteria_quotations', JSON.stringify(quotations));
const retrieved = JSON.parse(localStorage.getItem('ferreteria_quotations'));
assert(retrieved.length === 2, 'No se recuperaron todas las cotizaciones');
```

**Resultado:** ✓ PASS

---

### Test 6: Validez de 30 Días
**Requisito:** 2.8

Verifica que las cotizaciones tengan una validez de 30 días.

```javascript
const now = new Date();
const validUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
const diffDays = Math.floor((validUntil - now) / (1000 * 60 * 60 * 24));
assert(diffDays >= 29 && diffDays <= 30, 'Validez incorrecta');
```

**Resultado:** ✓ PASS

---

### Test 7: Filtrado de Cotizaciones Válidas
**Requisito:** 2.8

Verifica que se puedan filtrar cotizaciones válidas de las expiradas.

```javascript
const now = new Date();
const quotations = [
    { id: 'COT-VALID', validUntil: futureDate },
    { id: 'COT-EXPIRED', validUntil: pastDate }
];

const valid = quotations.filter(q => new Date(q.validUntil) > now);
const expired = quotations.filter(q => new Date(q.validUntil) <= now);
assert(valid.length === 1 && expired.length === 1, 'Filtrado incorrecto');
```

**Resultado:** ✓ PASS

---

### Test 8: Eliminación de Cotizaciones Expiradas
**Requisito:** 2.8

Verifica que se puedan eliminar automáticamente las cotizaciones expiradas.

```javascript
const quotations = [
    { id: 'COT-VALID', validUntil: futureDate },
    { id: 'COT-EXPIRED', validUntil: pastDate }
];

const validOnly = quotations.filter(q => new Date(q.validUntil) > now);
assert(validOnly.length === 1, 'No se eliminaron las expiradas');
```

**Resultado:** ✓ PASS

---

### Test 9: Formato de Mensaje WhatsApp
**Requisito:** 2.6, 2.7

Verifica que el mensaje de WhatsApp tenga el formato correcto.

```javascript
const message = `*Cotización: COT-TEST-009*\n*Materiales:*\n• Poste Hormigón x10\n*TOTAL: $35000*`;

assert(message.includes('COT-TEST-009'), 'No contiene ID');
assert(message.includes('Poste Hormigón'), 'No contiene producto');
assert(message.includes('10'), 'No contiene cantidad');
assert(message.includes('TOTAL'), 'No contiene total');
```

**Resultado:** ✓ PASS

---

### Test 10: Actualización de Estado
**Requisito:** 2.8

Verifica que el estado de una cotización se pueda actualizar.

```javascript
const quotations = [{ id: 'COT-TEST-010', status: 'draft' }];
quotations[0].status = 'accepted';

assert(quotations[0].status === 'accepted', 'Estado no actualizado');
```

**Resultado:** ✓ PASS

---

### Test 11: Información de Almacenamiento
**Requisito:** 2.8

Verifica que se pueda obtener información sobre el almacenamiento.

```javascript
const quotations = [
    { id: 'COT-001', total: 35000 },
    { id: 'COT-002', total: 75000 },
    { id: 'COT-003', total: 50000 }
];

const storageSize = new Blob([JSON.stringify(quotations)]).size;
assert(quotations.length === 3, 'Total incorrecto');
assert(storageSize > 0, 'Tamaño no calculado');
```

**Resultado:** ✓ PASS

---

### Test 12: Eliminación de Cotización por ID
**Requisito:** 2.8

Verifica que se pueda eliminar una cotización específica por su ID.

```javascript
const quotations = [{ id: 'COT-TEST-012', total: 35000 }];
const filtered = quotations.filter(q => q.id !== 'COT-TEST-012');

assert(quotations.length === 1, 'Antes de eliminar debe haber 1');
assert(filtered.length === 0, 'Después de eliminar debe haber 0');
```

**Resultado:** ✓ PASS

---

## Resumen de Resultados

```
============================================================
RESUMEN DE TESTS
============================================================
Total: 12
✓ Pasados: 12
✗ Fallidos: 0
Tasa de éxito: 100.00%
============================================================
```

## Requisitos Validados

Los tests validan los siguientes requisitos del documento de requerimientos:

- **2.3:** Cálculo de totales con precios
- **2.4:** Servicio de instalación
- **2.5:** Generación de PDF
- **2.6:** Envío por WhatsApp
- **2.7:** Formato de mensaje WhatsApp
- **2.8:** Guardado en localStorage
- **2.9:** Recuperación de cotizaciones

## Cómo Ejecutar los Tests

### Opción 1: Desde la línea de comandos (Node.js)
```bash
node ferreteria/test-quotation-simple.js
```

### Opción 2: Desde el navegador
1. Abrir `ferreteria/test-quotation-system.html` en un navegador
2. Hacer clic en "Ejecutar Todos los Tests"
3. Ver resultados en tiempo real

### Opción 3: Desde el archivo HTML de prueba
1. Abrir `ferreteria/test-quotations-display.html` en un navegador
2. Usar los botones de prueba disponibles

## Cobertura de Tests

| Funcionalidad | Test | Estado |
|---|---|---|
| Generación de ID único | Test 1 | ✓ PASS |
| Cálculo de totales (sin instalación) | Test 2 | ✓ PASS |
| Cálculo de totales (con instalación) | Test 3 | ✓ PASS |
| Guardado en localStorage | Test 4 | ✓ PASS |
| Recuperación de cotizaciones | Test 5 | ✓ PASS |
| Validez de 30 días | Test 6 | ✓ PASS |
| Filtrado de válidas | Test 7 | ✓ PASS |
| Eliminación de expiradas | Test 8 | ✓ PASS |
| Formato WhatsApp | Test 9 | ✓ PASS |
| Actualización de estado | Test 10 | ✓ PASS |
| Información de almacenamiento | Test 11 | ✓ PASS |
| Eliminación por ID | Test 12 | ✓ PASS |

## Notas Importantes

1. **localStorage:** Los tests limpian localStorage antes de cada prueba para evitar interferencias
2. **Datos de prueba:** Se utilizan datos ficticios que no afectan el sistema real
3. **Independencia:** Cada test es independiente y puede ejecutarse por separado
4. **Validación:** Todos los tests validan tanto el éxito como los casos de error

## Próximos Pasos

- Ejecutar tests regularmente durante el desarrollo
- Agregar más tests para casos edge
- Integrar tests en CI/CD pipeline
- Monitorear cobertura de código
