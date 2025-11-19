# Testing del Comparador de Soluciones

## Descripción General

Este documento describe los tests automatizados para el módulo Comparador de Soluciones. Los tests validan todas las funcionalidades críticas del comparador según los requerimientos especificados.

## Ejecución de Tests

### Ejecutar todos los tests
```bash
node ferreteria/test-comparator-automated.js
```

### Resultado esperado
```
Total de tests: 127
✓ Pasados: 127
✗ Fallidos: 0
Porcentaje de éxito: 100%
```

## Cobertura de Tests

### Test 1: Selección de Productos (máximo 3)
**Requisito: 5.2**

Valida que:
- Se puede seleccionar 1 producto
- Se puede seleccionar 2 productos
- Se puede seleccionar 3 productos
- No se pueden seleccionar más de 3 productos (lanza error)
- Se pueden remover productos y agregar otros

**Casos de prueba**: 7

### Test 2: Cálculo de Scores con Prioridades
**Requisito: 5.4, 5.5**

Valida que:
- Se calculan scores para todos los productos seleccionados
- Los scores están en rango 0-10
- Con prioridad precio: Eucalipto (más barato) tiene mejor score
- Con prioridad durabilidad: Hormigón (más duradero) tiene mejor score
- Con prioridad estética: Quebracho (más estético) tiene mejor score
- Los scores son determinísticos (mismo resultado cada vez)

**Casos de prueba**: 6

### Test 3: Generación de Tabla Comparativa
**Requisito: 5.3**

Valida que:
- Se puede generar comparativa con 2 productos
- Se puede generar comparativa con 3 productos
- Todos los productos tienen datos completos (nombre, precio, durabilidad, etc.)
- Los productos están ordenados por score descendente
- Cada producto tiene ventajas y desventajas

**Casos de prueba**: 8

### Test 4: Recomendaciones Contextuales
**Requisito: 5.6, 5.7, 5.8**

Valida que:
- Contexto "Alta Exigencia": Quebracho y Hormigón recomendados, Eucalipto no
- Contexto "Presupuesto Económico": Eucalipto recomendado, Quebracho no
- Contexto "Equilibrado": Hormigón y Eucalipto recomendados
- Contexto "Seguridad": Olimpo y Hormigón recomendados, Eucalipto no
- Se puede verificar si un producto es recomendado para un contexto

**Casos de prueba**: 11

### Test 5: Producto Recomendado (Mejor Score)
**Requisito: 5.5**

Valida que:
- Sin productos seleccionados, no hay recomendación
- Con 1 producto, ese producto es recomendado
- Con 2 productos y prioridad precio: Eucalipto es recomendado
- Con 2 productos y prioridad durabilidad: Hormigón es recomendado
- Con 3 productos, hay un producto recomendado válido

**Casos de prueba**: 6

### Test 6: Validación de Prioridades
**Requisito: 5.4, 5.5**

Valida que:
- Prioridades válidas (0-10) se aceptan
- Prioridades en extremos (0, 0, 10) se aceptan
- Prioridades negativas lanzan error
- Prioridades mayores a 10 lanzan error
- Contextos inválidos lanzan error

**Casos de prueba**: 5

### Test 7: Propiedades de Idempotencia
**Requisito: Correctness Property**

Valida que:
- Calcular score múltiples veces da el mismo resultado
- Obtener recomendación múltiples veces da el mismo resultado
- El orden de scores es consistente
- Cambiar prioridades y volver a las originales restaura los scores

**Casos de prueba**: 4

### Test 8: Propiedades de Ordenamiento
**Requisito: 5.5**

Valida que:
- Los scores están ordenados descendentemente
- El primer elemento en scores es el producto recomendado
- Cambiar prioridades cambia el orden de scores

**Casos de prueba**: 4

### Test 9: Completitud de Datos de Productos
**Requisito: 5.3**

Valida que cada producto (Hormigón, Quebracho, Eucalipto, Olimpo) tiene:
- Nombre
- Precio válido
- Durabilidad válida
- Estética válida (0-10)
- Resistencia a humedad (0-10)
- Resistencia a plagas (0-10)
- Resistencia al fuego (0-10)
- Ventajas
- Desventajas
- Aplicaciones

**Casos de prueba**: 40

### Test 10: Disponibilidad de Contextos
**Requisito: 5.6, 5.7, 5.8**

Valida que cada contexto (high-demand, budget, balanced, security) tiene:
- Título
- Productos recomendados
- Sugerencia de prioridades

**Casos de prueba**: 12

## Resumen de Cobertura

| Requisito | Test | Casos | Estado |
|-----------|------|-------|--------|
| 5.2 | Test 1 | 7 | ✅ Cubierto |
| 5.3 | Test 3, 9 | 8 + 40 | ✅ Cubierto |
| 5.4 | Test 2, 6 | 6 + 5 | ✅ Cubierto |
| 5.5 | Test 2, 5, 6, 8 | 6 + 6 + 5 + 4 | ✅ Cubierto |
| 5.6 | Test 4, 10 | 11 + 12 | ✅ Cubierto |
| 5.7 | Test 4, 10 | 11 + 12 | ✅ Cubierto |
| 5.8 | Test 4, 10 | 11 + 12 | ✅ Cubierto |
| 5.9 | Test 5 | 6 | ✅ Cubierto |

## Propiedades Verificadas

### Property 1: Selección Limitada
*Para cualquier* comparador, la cantidad de productos seleccionados nunca debe exceder 3.

**Validado en**: Test 1

### Property 2: Scores Determinísticos
*Para cualquier* conjunto de productos y prioridades, calcular el score múltiples veces debe dar el mismo resultado.

**Validado en**: Test 2, Test 7

### Property 3: Ordenamiento Descendente
*Para cualquier* conjunto de productos seleccionados, los scores deben estar ordenados de mayor a menor.

**Validado en**: Test 3, Test 8

### Property 4: Recomendación Consistente
*Para cualquier* conjunto de productos, el producto recomendado debe ser el que tiene el score más alto.

**Validado en**: Test 5, Test 8

### Property 5: Contextos Válidos
*Para cualquier* contexto válido, debe haber productos recomendados y sugerencias de prioridades.

**Validado en**: Test 4, Test 10

### Property 6: Datos Completos
*Para cualquier* producto en COMPARISON_DATA, debe tener todos los campos requeridos con valores válidos.

**Validado en**: Test 9

## Casos de Prueba Especiales

### Prioridades Extremas
- Precio = 10, Durabilidad = 0, Estética = 0 → Eucalipto gana
- Precio = 0, Durabilidad = 10, Estética = 0 → Hormigón/Olimpo ganan
- Precio = 0, Durabilidad = 0, Estética = 10 → Quebracho gana

### Contextos Especiales
- Alta Exigencia: Recomienda Quebracho y Hormigón
- Presupuesto: Recomienda Eucalipto
- Equilibrado: Recomienda Hormigón y Eucalipto
- Seguridad: Recomienda Olimpo y Hormigón

### Validaciones de Error
- Seleccionar más de 3 productos → Error
- Prioridad negativa → Error
- Prioridad > 10 → Error
- Contexto inválido → Error

## Requisitos Cumplidos

✅ **5.2**: Selección de hasta 3 productos
✅ **5.3**: Generación de tabla comparativa
✅ **5.4**: Cálculo de scores con prioridades
✅ **5.5**: Ponderación y ordenamiento
✅ **5.6**: Recomendaciones contextuales (Alta Exigencia)
✅ **5.7**: Recomendaciones contextuales (Presupuesto)
✅ **5.8**: Recomendaciones contextuales (Seguridad)
✅ **5.9**: Botón "Usar esta solución" (validado en código)

## Notas Técnicas

### Normalización de Scores
- Precio: `(1 - (precio / 5000)) * 10` (inverso: menor precio = mejor)
- Durabilidad: `(durabilidad_años / 50) * 10`
- Estética: `valor_directo` (ya está 0-10)

### Fórmula de Score Ponderado
```
weightedScore = (priceScore × priority_price) + 
                (durabilityScore × priority_durability) + 
                (aestheticsScore × priority_aesthetics)

finalScore = weightedScore / (priority_price + priority_durability + priority_aesthetics)
```

### Datos de Referencia
- Precio máximo de referencia: $5,000
- Durabilidad máxima: 50 años
- Estética máxima: 10/10
- Resistencias máximas: 10/10

## Debugging

Para ver logs detallados durante la ejecución:
```bash
node ferreteria/test-comparator-automated.js 2>&1 | tee test-output.log
```

## Próximos Pasos

- [ ] Tests de integración con la calculadora
- [ ] Tests de integración con el sistema de cotizaciones
- [ ] Tests de UI (navegación, clicks, etc.)
- [ ] Tests de performance con muchos productos
- [ ] Tests de accesibilidad

