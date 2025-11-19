# Sistema de Scoring con Prioridades - Comparador de Soluciones

## Descripción General

El sistema de scoring permite a los usuarios comparar diferentes tipos de postes según sus prioridades personales (precio, durabilidad y estética). El sistema calcula un score ponderado para cada producto y recomienda automáticamente el que mejor se ajusta a las preferencias del usuario.

## Funcionalidades Implementadas

### 1. Cálculo de Score Basado en Sliders de Prioridades

El sistema utiliza tres sliders (rango 0-10) para capturar las prioridades del usuario:
- **Precio**: Importancia del costo (menor precio = mejor)
- **Durabilidad**: Importancia de la vida útil (mayor durabilidad = mejor)
- **Estética**: Importancia de la apariencia (mayor estética = mejor)

### 2. Ponderación de Atributos

Cada producto tiene tres atributos principales que se normalizan a una escala de 0-10:

```javascript
// Normalización de precio (inverso: menor precio = mejor score)
priceScore = (1 - (precio / 5000)) * 10

// Normalización de durabilidad
durabilityScore = (durabilidad_años / 50) * 10

// Estética (ya está en escala 0-10)
aestheticsScore = estética
```

### 3. Cálculo del Score Ponderado

El score final se calcula usando la fórmula:

```
weightedScore = (priceScore × priority_price) + 
                (durabilityScore × priority_durability) + 
                (aestheticsScore × priority_aesthetics)

finalScore = weightedScore / (priority_price + priority_durability + priority_aesthetics)
```

Esta fórmula asegura que:
- Los atributos con mayor prioridad tienen más peso en el score final
- El score final está normalizado (0-10)
- Los cambios en las prioridades afectan inmediatamente la recomendación

### 4. Ordenamiento y Recomendación

Los productos se ordenan por score de mayor a menor:
```javascript
scores.sort((a, b) => b.score - a.score);
const recommendedId = scores[0].id; // El de mayor score
```

El producto con el score más alto recibe el badge "Recomendado" con:
- Icono de estrella
- Animación de pulso
- Color destacado (verde acento)

## Ejemplos de Uso

### Ejemplo 1: Prioridad en Precio
```
Prioridades: Precio=10, Durabilidad=2, Estética=2

Resultado esperado:
1. Eucalipto (más económico) - RECOMENDADO
2. Hormigón
3. Olimpo
4. Quebracho (más caro)
```

### Ejemplo 2: Prioridad en Durabilidad
```
Prioridades: Precio=2, Durabilidad=10, Estética=2

Resultado esperado:
1. Hormigón u Olimpo (50 años) - RECOMENDADO
2. Quebracho (40 años)
3. Eucalipto (20 años)
```

### Ejemplo 3: Prioridad en Estética
```
Prioridades: Precio=2, Durabilidad=2, Estética=10

Resultado esperado:
1. Quebracho (estética 9) - RECOMENDADO
2. Eucalipto (estética 8)
3. Olimpo (estética 7)
4. Hormigón (estética 6)
```

### Ejemplo 4: Prioridades Balanceadas
```
Prioridades: Precio=5, Durabilidad=5, Estética=5

Resultado: El sistema balancea todos los factores
```

## Datos de Productos

### Postes de Hormigón
- Precio: $3,500
- Durabilidad: 50 años
- Estética: 6/10
- **Mejor para**: Durabilidad máxima, bajo mantenimiento

### Postes de Quebracho
- Precio: $4,200
- Durabilidad: 40 años
- Estética: 9/10
- **Mejor para**: Estética natural premium, alta exigencia

### Postes de Eucalipto
- Precio: $2,100
- Durabilidad: 20 años
- Estética: 8/10
- **Mejor para**: Presupuesto económico, estética natural

### Postes Olimpo
- Precio: $4,000
- Durabilidad: 50 años
- Estética: 7/10
- **Mejor para**: Seguridad máxima, durabilidad

## Interfaz de Usuario

### Sliders de Prioridades
- Rango: 0-10
- Valor por defecto: 5
- Actualización en tiempo real
- Muestra el valor actual al lado del slider

### Badge "Recomendado"
- Aparece solo en el producto con mayor score
- Incluye icono de estrella
- Animación de pulso para llamar la atención
- Color verde acento para destacar

### Tabla Comparativa
- Muestra todos los productos seleccionados
- Columnas ordenadas por score (mejor primero)
- Información detallada de cada producto
- Botón "Usar esta solución" para cada opción

## Debugging

El sistema incluye logs en consola para verificar el funcionamiento:

```javascript
// Al calcular score de cada producto
console.log('Score para [Producto]:', {
    priceScore, durabilityScore, aestheticsScore,
    priorities, weightedScore, finalScore
});

// Al actualizar la comparación
console.log('Scores ordenados:', [...]);
console.log('Producto recomendado:', [nombre]);
```

## Testing

Para probar el sistema:

1. Abrir `test-scoring-system.html` en el navegador
2. Seleccionar 2-3 productos
3. Ajustar los sliders de prioridades
4. Verificar que el badge "Recomendado" cambia según las prioridades
5. Revisar la consola para ver los cálculos detallados

## Requisitos Cumplidos

- ✅ **5.4**: Calcular score basado en sliders de prioridades
- ✅ **5.5**: Ponderar precio, durabilidad y estética según preferencias
- ✅ **5.5**: Ordenar productos por score calculado
- ✅ **5.5**: Mostrar badge "Recomendado" en el mejor score

## Notas Técnicas

### Normalización de Precios
El precio máximo de referencia es $5,000. Productos más caros que este valor tendrán score de precio negativo, lo cual es correcto ya que son menos deseables cuando el precio es prioritario.

### Manejo de Empates
Si dos productos tienen el mismo score, el orden se mantiene según el orden de selección original.

### Performance
El recálculo se ejecuta en tiempo real (sin debounce) ya que es una operación ligera y mejora la experiencia del usuario.

### Accesibilidad
- Los sliders son accesibles por teclado
- Los valores se muestran visualmente
- El badge tiene suficiente contraste
- La animación respeta `prefers-reduced-motion`
