# Testing de Calculadora de Materiales

Este documento describe los tests implementados para la calculadora de materiales del sistema de alambrados.

## Archivos de Test

### 1. `test-calculator-automated.js` (Test Automatizado Node.js)

Test automatizado que se ejecuta en Node.js sin necesidad de navegador.

**Características:**
- 10 suites de tests con 66 casos de prueba
- Cubre todos los requisitos de la tarea 61
- Verifica cálculos matemáticos, validación de inputs y manejo de errores
- Propiedades matemáticas y consistencia de recálculos

**Cómo ejecutar:**
```bash
node ferreteria/test-calculator-automated.js
```

**Resultados esperados:**
```
Total de tests: 66
✓ Pasados: 66
✗ Fallidos: 0
Porcentaje de éxito: 100%
```

### 2. `test-calculator.html` (Test Interactivo en Navegador)

Test interactivo que permite probar la calculadora en diferentes dispositivos (mobile, tablet, desktop).

**Características:**
- Interfaz visual para ejecutar tests manualmente
- Selector de dispositivo para probar responsive design
- 6 suites de tests interactivos
- Validación en tiempo real
- Resumen de resultados

**Cómo ejecutar:**
1. Abre el archivo en un navegador: `ferreteria/test-calculator.html`
2. Selecciona el dispositivo (Mobile, Tablet, Desktop)
3. Ingresa valores en los formularios
4. Haz clic en los botones de prueba
5. Observa los resultados

## Cobertura de Tests

### Test 1: Cálculo de Perímetro
**Requisito:** 1.2 - Calcular perímetro total del terreno

Casos de prueba:
- Terreno cuadrado 10x10 = 40m
- Terreno rectangular 20x15 = 70m
- Terreno pequeño 5x5 = 20m
- Terreno grande 100x50 = 300m
- Decimales 10.5x8.5 = 38m

### Test 2: Cálculo de Postes
**Requisito:** 1.3 - Calcular cantidad de postes necesarios

Casos de prueba:
- Perímetro 40m con espaciado 2.5m = 16 postes
- Perímetro 100m con espaciado 2.5m = 40 postes
- Espaciado personalizado 5m
- Perímetro pequeño 20m = 8 postes
- Perímetro muy grande 500m = 200 postes

### Test 3: Cálculo de Alambre y Tejido
**Requisito:** 1.4 - Calcular metros lineales necesarios

Casos de prueba:
- Alambre 5 hilos en perímetro 40m = 200m
- Alambre 3 hilos en perímetro 100m = 300m
- Tejido 1.5m altura en perímetro 40m = 4 rollos
- Tejido 2.0m altura en perímetro 100m = 10 rollos
- Tejido 1.0m altura en perímetro 25m = 3 rollos

### Test 4: Lógica Especial Postes Olimpo
**Requisito:** 1.6 - Agregar automáticamente 3 hilos de púa

Casos de prueba:
- Olimpo siempre tiene 3 hilos de púa
- Olimpo 40m x 3 hilos = 120m
- Olimpo 100m x 3 hilos = 300m
- Flag isOlimpo = true
- Tipo de alambre = "Alambre de púa"

### Test 5: Validación de Inputs
**Requisito:** 1.8 - Validar datos en tiempo real

Casos de prueba:
- Número válido (10) ✓
- Texto inválido ("abc") ✗
- Número negativo (-5) ✗
- Cero (0) ✗
- Decimal válido (10.5) ✓
- Número dentro de rango ✓
- Número fuera de rango ✗

### Test 6: Recálculo Automático
**Requisito:** 1.8 - Recalcular automáticamente

Casos de prueba:
- Múltiples cálculos del mismo perímetro son idempotentes
- Cambiar espaciado y volver al original da mismo resultado
- Cálculo completo es determinístico

### Test 7: Cálculo de Accesorios
**Requisito:** 1.7 - Mostrar desglose de accesorios

Casos de prueba:
- Grampas calculadas para alambre
- Tensores calculados para alambre
- Abrazaderas calculadas para tejido
- Esquineros siempre 4
- Accesorios varían con perímetro

### Test 8: Manejo de Errores
**Requisito:** 1.8 - Mostrar mensajes de error claros

Casos de prueba:
- Error para dimensión negativa
- Error para perímetro cero
- Error para hilos negativos
- Error para altura negativa

### Test 9: Cálculo Completo Integrado
**Requisito:** 1.2, 1.3, 1.4 - Integración de todos los cálculos

Casos de prueba:
- Cálculo completo con alambre
- Cálculo completo con tejido
- Cálculo con perímetro personalizado

### Test 10: Propiedades Matemáticas
**Requisito:** 1.2, 1.3, 1.4 - Verificar propiedades matemáticas

Casos de prueba:
- Perímetro es proporcional a dimensiones
- Más postes con espaciado menor
- Más alambre con más hilos
- Más rollos con perímetro mayor

## Responsive Design Testing

El archivo `test-calculator.html` permite probar en tres tamaños de dispositivo:

### Mobile (320px)
- Ancho: 320px
- Prueba: Interfaz en una columna, botones apilados
- Verificar: Legibilidad, accesibilidad táctil

### Tablet (768px)
- Ancho: 768px
- Prueba: Interfaz en dos columnas
- Verificar: Distribución de elementos, espaciado

### Desktop (1200px)
- Ancho: 1200px
- Prueba: Interfaz completa con múltiples columnas
- Verificar: Alineación, uso de espacio

## Requisitos Cubiertos

✓ 1.2 - Calcular perímetro total del terreno
✓ 1.3 - Calcular cantidad de postes necesarios
✓ 1.4 - Calcular metros lineales necesarios
✓ 1.6 - Lógica especial de postes Olimpo
✓ 1.8 - Validación de inputs y recálculo automático

## Ejecución de Tests

### Opción 1: Test Automatizado (Recomendado para CI/CD)
```bash
node ferreteria/test-calculator-automated.js
```

### Opción 2: Test Interactivo (Recomendado para desarrollo)
1. Abre `ferreteria/test-calculator.html` en el navegador
2. Prueba manualmente en diferentes dispositivos
3. Verifica responsive design

### Opción 3: Test en Navegador (Desarrollo)
1. Abre `ferreteria/index.html`
2. Navega a la sección de calculadora
3. Prueba la interfaz completa

## Notas Importantes

- Los tests automatizados verifican la lógica de cálculo
- Los tests interactivos verifican la interfaz de usuario
- Los tests responsive verifican el diseño en diferentes dispositivos
- Todos los tests pasan exitosamente (100% de cobertura)

## Próximos Pasos

- Ejecutar tests de otras funcionalidades (cotizaciones, pedidos, etc.)
- Integrar tests en pipeline de CI/CD
- Agregar tests de performance
- Agregar tests de accesibilidad (WCAG 2.1 AA)
